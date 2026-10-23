import { describe, expect, test } from "bun:test";
import { Bundle, children, type Node } from "../src/ast.ts";
import { listInstalls, program } from "../src/binary.ts";
import { Resolver } from "../src/resolve.ts";
import { literal, short, unique } from "../src/surface/common.ts";
import { KINDS, surface } from "../src/surface/index.ts";
import { baseTools } from "../src/tools.ts";

const bundle = (text: string) =>
  new Bundle([{ name: "/$bunfs/root/a.js", text }]);
const items = (kind: string, text: string) => surface(bundle(text), kind);
const names = (kind: string, text: string) =>
  items(kind, text).map((i) => i.name);

describe("registry", () => {
  test("lists the kinds", () => {
    expect(Object.keys(KINDS).sort()).toEqual([
      "beta",
      "endpoint",
      "env",
      "error",
      "file",
      "flag",
      "gate",
      "hook-event",
      "keybinding",
      "mod-api",
      "model",
      "otel-event",
      "permission-rule",
      "setting",
      "slash-command",
      "subcommand",
      "tool",
    ]);
  });

  test("throws on an unknown kind", () => {
    expect(() => surface(bundle("var a=1"), "nope")).toThrow(/unknown kind/);
  });

  test("computes a kind once per bundle", () => {
    const b = bundle('var a=["PreToolUse","PostToolUse"]');
    expect(surface(b, "hook-event")).toBe(surface(b, "hook-event"));
  });
});

describe("common helpers", () => {
  test("unique keeps the first item and fills missing fields", () => {
    const base = { kind: "k", module: null, offset: null };
    const out = unique([
      { ...base, name: "b" },
      { ...base, name: "a" },
      { ...base, name: "b", detail: "d" },
    ]);
    expect(out.map((i) => i.name)).toEqual(["a", "b"]);
    expect(out[1]?.detail).toBe("d");
  });

  test("short blanks placeholders and cuts long text", () => {
    expect(short("a $" + "{x}  b")).toBe("a $" + "{…} b");
    expect(short("x".repeat(10), 4)).toBe("xxxx…");
  });

  test("literal reads short literals", () => {
    const m = bundle("var a=[!0,!1,-1,void 0,'s',f(),[1,2]]").get("a.js");
    const elements: Node[] = [];
    const stack: Node[] = m ? [m.ast] : [];
    while (stack.length) {
      const n = stack.pop() as Node;
      if (n.type === "ArrayExpression" && !elements.length)
        elements.push(...(n.elements as Node[]));
      else stack.push(...children(n));
    }
    const out = elements.map((e) => (m ? literal(m, e) : ""));
    expect(out).toEqual([
      "true",
      "false",
      "-1",
      "undefined",
      '"s"',
      "unknown",
      "[1,2]",
    ]);
  });
});

describe("env", () => {
  test("reads of process.env and of the typed registry", () => {
    const src = `
var H={bool:()=>1,enum:()=>1,int:()=>1};
var v1=H.bool(),v2=H.enum(["a","b"]),v3=H.int({min:0});
var ns=reg("x",{REG_BOOL:()=>v1,REG_ENUM:()=>v2,REG_INT:()=>v3});
var x=process.env.READ_DOT,y=process.env["READ_BRACKET"];
var z="READ_IN" in process.env;
var {READ_DESTRUCT:q}=process.env;
function g(){return process.env}
var w=g().VIA_FN_UPPER;
`;
    const out = items("env", src);
    const by = new Map(out.map((i) => [i.name, i]));
    for (const n of [
      "REG_BOOL",
      "REG_ENUM",
      "REG_INT",
      "READ_DOT",
      "READ_BRACKET",
      "READ_IN",
      "READ_DESTRUCT",
      "VIA_FN_UPPER",
    ])
      expect(by.has(n)).toBe(true);
    expect(by.get("REG_BOOL")?.detail).toBe("bool");
    expect(by.get("REG_ENUM")?.values).toEqual(["a", "b"]);
    expect(by.get("REG_INT")?.detail).toBe("int{min:0}");
  });

  test("names set for a child process", () => {
    const src = `
spawn("x",[],{env:{...process.env,CHILD_SET:1}});
var a=["--setenv","SANDBOX_VAR","1"];
`;
    const by = new Map(items("env", src).map((i) => [i.name, i]));
    expect(by.get("CHILD_SET")?.detail).toBe("set for a child process");
    expect(by.get("SANDBOX_VAR")?.detail).toBe("set for a child process");
  });

  test("a lowercase read of another object is not an env name", () => {
    const n = names("env", "var o={a:1};var x=o.FOO_BAR,y=o.low;");
    expect(n).not.toContain("FOO_BAR");
    expect(n).not.toContain("low");
  });
});

describe("flag", () => {
  test("option, requiredOption, and addOption with hideHelp", () => {
    const src = `
var p=new C();
p.option("-d, --debug [filter]","Enable debug");
p.requiredOption("--issuer <url>","Issuer");
p.addOption(new O("--init","Run init").hideHelp());
p.addOption(new O("--shown","Shown"));
`;
    const by = new Map(items("flag", src).map((i) => [i.name, i]));
    expect([...by.keys()].sort()).toEqual([
      "--debug",
      "--init",
      "--issuer",
      "--shown",
    ]);
    expect(by.get("--debug")?.detail).toBe(
      "-d, --debug [filter] | Enable debug",
    );
    expect(by.get("--init")?.gate).toBe("hidden");
    expect(by.get("--shown")?.gate).toBeUndefined();
  });

  test("a flag on a subcommand gets the command path", () => {
    const src = `
var p=new C();
var m=p.command("mcp");
m.command("add <name>").option("--transport <t>","Transport");
`;
    expect(names("flag", src)).toEqual(["mcp add --transport"]);
  });

  test("an option in a variable and a conditional one", () => {
    const src = `
var p=new C();
let h=new O("--var-opt","V");
p.addOption(h);
var h2=new O("--cond-opt","C");
p.addOption(k?h2:h2.hideHelp());
`;
    const by = new Map(items("flag", src).map((i) => [i.name, i]));
    expect(by.has("--var-opt")).toBe(true);
    expect(by.get("--cond-opt")?.gate).toBe("hidden unless k");
  });

  test("a non-flag first argument is dropped", () => {
    expect(names("flag", 'o.option("plain","x");o.option(1,"y");')).toEqual([]);
  });
});

describe("subcommand", () => {
  test("paths, args, and hidden", () => {
    const src = `
var p=new C();
var m=p.command("mcp");
m.command("add <name> [args...]");
p.command("secret",{hidden:!0});
p.command("auth").command("login");
`;
    const by = new Map(items("subcommand", src).map((i) => [i.name, i]));
    expect([...by.keys()].sort()).toEqual([
      "auth",
      "auth login",
      "mcp",
      "mcp add",
      "secret",
    ]);
    expect(by.get("mcp add")?.detail).toBe("<name> [args...]");
    expect(by.get("secret")?.gate).toBe("hidden");
    expect(by.get("mcp")?.gate).toBeUndefined();
  });

  test("a name that starts with a dash or is not constant is dropped", () => {
    expect(names("subcommand", 'p.command("-x");p.command(f());')).toEqual([]);
  });
});

describe("slash-command", () => {
  test("local, local-jsx, and prompt objects", () => {
    const src = `
var a={type:"local",name:"compact",description:"Free up context",aliases:["c","sq"],isEnabled:()=>!0};
var b={type:"local-jsx",name:"hid",description:"H",isHidden:!0};
var c={type:"prompt",name:"avail",description:"A",availability:["claude-ai","console"]};
`;
    const by = new Map(items("slash-command", src).map((i) => [i.name, i]));
    expect([...by.keys()].sort()).toEqual(["/avail", "/compact", "/hid"]);
    expect(by.get("/compact")?.detail).toBe(
      "local (aliases c, sq) | Free up context",
    );
    expect(by.get("/compact")?.gate).toBe("isEnabled ()=>!0");
    expect(by.get("/hid")?.gate).toBe("hidden");
    expect(by.get("/avail")?.gate).toBe("availability claude-ai, console");
  });

  test("a builder that makes a prompt command from its name", () => {
    const src = `
function build({name:e}){return{type:"prompt",name:e,description:"d"}}
build({name:"security-review",description:"Review"});
`;
    expect(names("slash-command", src)).toContain("/security-review");
  });

  test("negatives: other types, run-time names, and bad names", () => {
    const src = `
var a={type:"tool",name:"bash"};
var b={type:"local",name:e.name};
var c={type:"local",name:"Bad Name"};
var d={name:"notype"};
`;
    expect(names("slash-command", src)).toEqual([]);
  });
});

describe("setting", () => {
  test("keys of the schema object, details, and conditional spread", () => {
    const src = `
function s(){return{
$schema:()=>z.string().describe("JSON Schema reference for Claude Code settings").optional(),
apiKeyHelper:()=>z.string().describe("Script that prints a key").optional(),
permissions:()=>z.object({}),
...i.CLAUDE_CODE_ENABLE_XAA&&{xaaIdp:()=>z.string().describe("XAA")}
}}
`;
    const by = new Map(items("setting", src).map((i) => [i.name, i]));
    expect([...by.keys()].sort()).toEqual([
      "$schema",
      "apiKeyHelper",
      "permissions",
      "xaaIdp",
    ]);
    expect(by.get("apiKeyHelper")?.detail).toBe("Script that prints a key");
    expect(by.get("permissions")?.detail).toBeUndefined();
    expect(by.get("xaaIdp")?.gate).toBe("i.CLAUDE_CODE_ENABLE_XAA");
  });

  test("gated tables give buildGate as the gate", () => {
    const src = `var t={tbl:{buildGate:()=>!0,shape:()=>({gatedKey:z.string()})}};`;
    const [it] = items("setting", src);
    expect(it?.name).toBe("gatedKey");
    expect(it?.gate).toBe("buildGate ()=>!0");
  });

  test("an object with no anchor gives no settings", () => {
    expect(names("setting", "var o={apiKeyHelper:()=>z.string()};")).toEqual(
      [],
    );
  });
});

describe("hook-event", () => {
  test("takes the longest PascalCase list with PreToolUse and PostToolUse", () => {
    const src = `
var a=["PreToolUse","PostToolUse"];
var b=["PreToolUse","PostToolUse","SessionStart","Stop"];
var c=["PreToolUse","PostToolUse","not_pascal","Another","Yet","More","Names"];
var d=["SessionStart","Stop","Other","More","Names"];
`;
    expect(names("hook-event", src)).toEqual([
      "PostToolUse",
      "PreToolUse",
      "SessionStart",
      "Stop",
    ]);
  });

  test("no list gives no events", () => {
    expect(names("hook-event", 'var a=["PreToolUse","Stop"];')).toEqual([]);
  });
});

describe("gate", () => {
  test("readers give names and literal defaults", () => {
    const src = `
F.read("tengu_a_bool",!1);
F.read("tengu_b_num",5);
F.read("tengu_c_str","x");
F.read("tengu_d_none");
F.read("tengu_e_computed",f());
F.read("tengu_f_cfg",{a:1});
F.read("tengu_y",!1);
`;
    const by = new Map(items("gate", src).map((i) => [i.name, i]));
    expect(by.get("tengu_a_bool")?.default).toBe("false");
    expect(by.get("tengu_y")?.default).toBe("false");
    expect(by.get("tengu_b_num")?.default).toBe("5");
    expect(by.get("tengu_c_str")?.default).toBe('"x"');
    // Spec inspect-surface-lookup: a computed value is shown as `unknown`.
    expect(by.get("tengu_e_computed")?.default).toBe("unknown");
    for (const n of ["tengu_d_none", "tengu_f_cfg"]) {
      expect(by.has(n)).toBe(true);
      expect(by.get(n)?.default).toBeUndefined();
    }
  });

  test("event-logger calls are not gates", () => {
    const src = `
a("tengu_x",{feature_name:1});
a("tengu_x2",{feature_name:2,b:3});
a("tengu_x3",{k:1});
F.read("tengu_real",!0);
`;
    expect(names("gate", src)).toEqual(["tengu_real"]);
  });

  test("a wrapper that passes its parameter to a logger is a logger", () => {
    const src = `
function a(e,t){}
a("tengu_log1",{feature_name:1});
a("tengu_log2",{feature_name:2});
function fo(e){a(e,{feature_name:3})}
fo("tengu_wrapped");
fo("tengu_wrapped2");
Jr("tengu_safe",{safe:!0});
`;
    const n = names("gate", src);
    expect(n).not.toContain("tengu_wrapped");
    expect(n).not.toContain("tengu_wrapped2");
    expect(n).not.toContain("tengu_log1");
    expect(n).toContain("tengu_safe");
  });

  test("a bare prefix and a trailing underscore are dropped", () => {
    const src = `
F.read("tengu_",!1);
F.read("tengu_bad_",!1);
F.read("tengu_Upper",!1);
F.read("tengu_ok1",!1);
`;
    expect(names("gate", src)).toEqual(["tengu_ok1"]);
  });
});

describe("tool", () => {
  test("the tools getAllBaseTools returns, with their gates", () => {
    const t = items(
      "tool",
      'const B=(d)=>({isEnabled:()=>!0,...d});const S=B({name:"Shell"}),G=B({name:"Glob",isEnabled(){return process.env.G==="1"}}),C=B({name:"CronCreate"});function L(){return process.env.L==="1"}function A(){return[S,G,...L()?[C]:[]]}globalThis.api={getAllBaseTools:A};',
    );
    expect(t.map((i) => i.name)).toEqual(["CronCreate", "Glob", "Shell"]);
    expect(t.find((i) => i.name === "CronCreate")?.gate).toContain("L()");
    expect(t.find((i) => i.name === "Glob")?.detail).toContain("process.env.G");
    expect(t.every((i) => i.module === "a.js" && i.offset === null)).toBe(true);
  });
});

describe("otel-event", () => {
  test("the emitter's event names with their call site counts", () => {
    const e = items(
      "otel-event",
      'const b=()=>({"session.id":"s"});async function e(n,a){globalThis.o={...b(),"event.name":n,"event.sequence":1,...a}}e("tool_result",{tool_name:"Bash"});e("tool_result",{x:1});e("api_error",{status:500});',
    );
    expect(e.map((i) => [i.name, i.detail])).toEqual([
      ["api_error", "1 call sites"],
      ["tool_result", "2 call sites"],
    ]);
  });
});

describe("mod-api", () => {
  const DTS = `declare module 'claude-code' {
  export interface CoreEngineInterface {
      /**
       * Doc with a key: like this.
       */
      plugin: {
          name: string;
      };
      ui: {
          /** Logs. */
          log(text: string): void;
          ring?: (n: number) => void;
      };
      version: string;
  }
  export type EngineEventOf = {
      'tool.check': ToolCheckInput;
  };
  export type OpEventOf = {
      'model.complete': X;
  };
  type HookInput = { hook_event_name: 'PreToolUse' } | { hook_event_name: 'Stop' };
}
`;
  const files = [
    {
      name: "/$bunfs/root/claude-code.d.ts-abc.zst",
      bytes: Buffer.from(Bun.zstdCompressSync(DTS)),
    },
  ];
  test("$ calls through nested types, event map keys, and classic events", () => {
    const m = surface(bundle("var a=1"), "mod-api", files);
    expect(m.map((i) => [i.name, i.detail])).toEqual([
      ["$.plugin.name", "property"],
      ["$.ui.log", "call"],
      ["$.ui.ring", "call"],
      ["$.version", "property"],
      ["classic.PreToolUse", "event"],
      ["classic.Stop", "event"],
      ["model.complete", "event"],
      ["tool.check", "event"],
    ]);
    const log = m.find((i) => i.name === "$.ui.log");
    expect(DTS.slice(log?.offset ?? 0).trimStart()).toStartWith("log(");
  });
  test("throws without the embedded files", () => {
    expect(() => surface(bundle("var a=1"), "mod-api")).toThrow(/embedded/);
  });
});

describe("keybinding", () => {
  test("actions and contexts from their two arrays", () => {
    const src = `
var c=["Global","Chat","Help"];
var a=["app:exit","chat:cancel","chat:submit"];
var short=["Global","Chat"];
var other=["chat:cancel"];
`;
    const by = new Map(items("keybinding", src).map((i) => [i.name, i]));
    expect(by.get("chat:cancel")?.detail).toBe("action");
    expect(by.get("app:exit")?.detail).toBe("action");
    expect(by.get("Global")?.detail).toBe("context");
    expect(by.get("Help")?.detail).toBe("context");
  });

  test("an array that is not all strings gives nothing", () => {
    expect(names("keybinding", 'var a=["Global","Chat",f()];')).toEqual([]);
  });
});

describe("model", () => {
  test("ids and aliases", () => {
    const src = `
var t=[["claude-sonnet-4-5","R1"],["claude-3-5-haiku-20241022","R2"],["claude-opus-4-1@20250805","R3"]];
var al=["sonnet","opus","opusplan"];
`;
    const by = new Map(items("model", src).map((i) => [i.name, i]));
    expect(by.get("claude-sonnet-4-5")?.detail).toBe("id");
    expect(by.get("claude-3-5-haiku-20241022")?.detail).toBe("id");
    expect(by.get("claude-opus-4-1@20250805")?.detail).toBe("id");
    expect(by.get("opusplan")?.detail).toBe("alias");
  });

  test("text that holds an id, a prefix, and other claude names are not ids", () => {
    const src = `
var a="use claude-opus-4-6 here",b="claude-3-",c="claude-code",d="claude-ai-oauth";
var e=["sonnet","opus"];
`;
    expect(names("model", src)).toEqual([]);
  });
});

describe("beta", () => {
  test("dated names, with the registry key as the detail", () => {
    const src = `
v("long_context","context-1m-2025-08-07");
v("claude_code","claude-code-20250219");
var o="oauth-2025-04-20";
`;
    const by = new Map(items("beta", src).map((i) => [i.name, i]));
    expect(by.get("context-1m-2025-08-07")?.detail).toBe("long_context");
    expect(by.get("claude-code-20250219")?.detail).toBe("claude_code");
    expect(by.get("oauth-2025-04-20")?.detail).toBeUndefined();
  });

  test("API versions, dated model ids, and plain dates are not betas", () => {
    const src = `
var a="bedrock-2023-05-31",b="vertex-2023-10-16",c="2023-06-01";
var d="claude-opus-4-5-20251101";
f("model","claude-opus-4-5-20251101");
`;
    expect(names("beta", src)).toEqual([]);
  });
});

describe("endpoint", () => {
  test("Anthropic URLs and BASE_API_URL paths", () => {
    const src = `
var u={BASE_API_URL:"https://api.anthropic.com",X:"https://platform.claude.com/v1/oauth/token"};
f(\`\${an().BASE_API_URL}/api/oauth/profile\`);
f(\`\${an().BASE_API_URL}/v1/code/sessions/\${e}/events\`);
`;
    const by = new Map(items("endpoint", src).map((i) => [i.name, i]));
    expect(by.get("https://api.anthropic.com")?.detail).toBe("url");
    expect(by.get("https://platform.claude.com/v1/oauth/token")?.detail).toBe(
      "url",
    );
    expect(by.get("/api/oauth/profile")?.detail).toBe("path");
    expect(by.has(`/v1/code/sessions/\${…}/events`)).toBe(true);
    expect(by.get("/v1/oauth/token")?.detail).toBe("path");
  });

  test("path literals and templates with an API prefix", () => {
    const src = `
var d="/v1/messages/count_tokens";
f(\`\${base}/v1/traces\`);
f(\`/model/\${m}/invoke\`);
`;
    expect(names("endpoint", src)).toEqual([
      `/model/\${…}/invoke`,
      "/v1/messages/count_tokens",
      "/v1/traces",
    ]);
  });

  test("third-party URLs, other paths, and variable paths are dropped", () => {
    const src = `
var a="https://login.microsoftonline.com/common",b="https://example.com";
var c="http://api.anthropic.com",d="/usr/v1/x",e="/v1/has space";
f(\`\${an().BASE_API_URL}\${h}\`);
f(\`\${an().OTHER}/x\`);
`;
    expect(names("endpoint", src)).toEqual([]);
  });
});

describe("file", () => {
  test("names joined to the config folder, found by the two anchors", () => {
    const src = `
var Le=memo(()=>home());
join(Le(),"history.jsonl");
join(Le(),"keybindings.json");
join(Le(),"settings.json");
join(other(),"nope.json");
join(proj,"project.json");
`;
    expect(names("file", src)).toEqual([
      "history.jsonl",
      "keybindings.json",
      "settings.json",
    ]);
  });

  test("a base without both anchors gives nothing", () => {
    expect(
      names("file", 'var B=f();join(B(),"history.jsonl");join(B(),"a.json");'),
    ).toEqual([]);
  });
});

describe("permission-rule", () => {
  test("the modes of the described enum", () => {
    const src = `
var m=f(()=>z(Iy,B(["default","plan","auto"])).describe("Permission mode for controlling how tool executions are handled. 'default' - x"));
var o=["other","list"];
`;
    const out = items("permission-rule", src);
    expect(out.map((i) => i.name)).toEqual(["auto", "default", "plan"]);
    expect(out.every((i) => i.detail === "mode")).toBe(true);
  });

  test("an enum with another description gives nothing", () => {
    expect(
      names("permission-rule", 'z(B(["default","plan"])).describe("Other");'),
    ).toEqual([]);
  });
});

describe("error", () => {
  test("a throw inside a CommonJS library wrapper is left out", () => {
    const src = `
var L=x((e,n)=>{function f(){throw Error("library text inside")}n.exports=f});
var M=x((e,n)=>{function g(){throw Error("wrapper with no exports")}g()});
function h(){throw Error("app text outside")}
`;
    expect(names("error", src)).toEqual([
      "app text outside",
      "wrapper with no exports",
    ]);
  });

  test("throws of Error types and subclasses, and stderr writes", () => {
    const src = `
class A extends Error{}
class B extends A{}
var C=class extends TypeError{};
throw Error("Not connected to server");
throw new TypeError("Invalid mode value");
throw new B("Subclass of subclass fails");
throw new C("Class expression fails");
throw new RangeError(\`Out of range: \${x}\`);
throw new SyntaxError("Bad " + name + " syntax");
process.stderr.write("Cloud gateway session expired\\n");
process.stderr.write(\`Cloud gateway \${n} is not trusted\`);
`;
    const by = new Map(items("error", src).map((i) => [i.name, i]));
    expect([...by.keys()].sort()).toEqual([
      `Bad \${…} syntax`,
      "Class expression fails",
      `Cloud gateway \${…} is not trusted`,
      "Cloud gateway session expired",
      "Invalid mode value",
      "Not connected to server",
      `Out of range: \${…}`,
      "Subclass of subclass fails",
    ]);
    expect(by.get("Not connected to server")?.detail).toBe("throw Error");
    expect(by.get("Subclass of subclass fails")?.detail).toBe("throw Error");
    expect(by.get("Class expression fails")?.detail).toBe("throw TypeError");
    expect(by.get("Cloud gateway session expired")?.detail).toBe("stderr");
  });

  test("factory throws, other classes, short texts, and codes are dropped", () => {
    const src = `
throw dyn("Cloud gateway failed here");
class Own{}
throw new Own("Not an error class");
throw new Error("aborted");
throw new Error("not JSON");
throw new Error("unreachable_state_code");
throw new Error("12345 67890 - 12");
console.error("Printed by a library only");
function f(Error){throw new Error("Shadowed Error is local")}
`;
    expect(names("error", src)).toEqual([]);
  });
});

const installs = listInstalls();
const has = installs.some((i) => i.version === "2.1.309");

describe.skipIf(!has)("installed binary 2.1.309", () => {
  const p = has ? program("2.1.309") : (undefined as never);
  const b = p?.bundle;
  const get = (kind: string) => surface(b, kind, p.modules).map((i) => i.name);

  test("tool: the names of list_tools", () => {
    const n = get("tool");
    expect(n).toEqual(
      [
        ...new Set(baseTools(b, new Resolver()).tools.map((t) => t.name)),
      ].sort(),
    );
    expect(n).toContain("Bash");
    expect(n).toContain("Agent");
  }, 300_000);

  test("otel-event", () => {
    const n = get("otel-event");
    expect(n).toContain("tool_result");
    expect(n).toContain("api_error");
  }, 300_000);

  test("mod-api", () => {
    const n = get("mod-api");
    expect(n).toContain("$.agent.spawn");
    expect(n).toContain("tool.check");
    expect(n.filter((x) => x.startsWith("classic."))).toHaveLength(33);
  }, 300_000);

  test("env", () => {
    expect(get("env")).toContain("CLAUDE_CODE_DISABLE_ULTRAREVIEW_TRUST_CHECK");
  }, 300_000);

  test("hook-event", () => {
    const n = get("hook-event");
    expect(n).toContain("PreToolUse");
    expect(n).toContain("SessionStart");
    expect(n).toHaveLength(33);
  }, 300_000);

  test("setting", () => {
    const n = get("setting");
    expect(n).toContain("permissions");
    expect(n).toHaveLength(194);
  }, 300_000);

  test("gate", () => {
    const n = get("gate");
    expect(n).toContain("tengu_calm_eagle");
    expect(new Set(n).size).toBe(1101);
  }, 300_000);

  test("flag", () => {
    const n = get("flag");
    expect(n).toContain("--model");
    expect(n).toContain("--debug");
  }, 300_000);

  test("subcommand", () => {
    const n = get("subcommand");
    expect(n).toContain("mcp");
    expect(n).toContain("auth login");
  }, 300_000);

  test("slash-command", () => {
    const n = get("slash-command");
    expect(n).toContain("/compact");
    expect(n).toContain("/model");
  }, 300_000);

  test("keybinding", () => {
    const n = get("keybinding");
    expect(n).toContain("chat:cancel");
    expect(n).toContain("Global");
  }, 300_000);

  test("model", () => {
    const n = get("model");
    expect(n).toContain("claude-opus-4-6");
    expect(n).toContain("claude-sonnet-4-5");
    expect(n).toContain("opusplan");
  }, 300_000);

  test("beta: the names of the docs page", () => {
    const n = get("beta");
    for (const b of [
      "context-1m-2025-08-07",
      "claude-code-20250219",
      "oauth-2025-04-20",
      "interleaved-thinking-2025-05-14",
      "ccr-byoc-2025-07-29",
      "afk-mode-2026-01-31",
      "token-counting-2024-11-01",
    ])
      expect(n).toContain(b);
    expect(n).not.toContain("bedrock-2023-05-31");
    expect(
      surface(b, "beta", p.modules).find(
        (i) => i.name === "context-1m-2025-08-07",
      )?.detail,
    ).toBe("long_context");
  }, 300_000);

  test("endpoint", () => {
    const n = get("endpoint");
    expect(n).toContain("https://api.anthropic.com");
    expect(n).toContain("https://api.anthropic.com/api/event_logging/v2/batch");
    expect(n).toContain("/api/oauth/profile");
    expect(n).toContain("/api/hello");
    // Paths from the docs endpoint table (docs/reference/api/endpoints.md).
    for (const p of [
      "/v1/messages/count_tokens",
      "/api/oauth/usage",
      "/api/claude_code/policy_limits",
      "/api/event_logging/v2/batch",
      "/v1/traces",
    ])
      expect(n).toContain(p);
  }, 300_000);

  test("file", () => {
    const n = get("file");
    expect(n).toContain("keybindings.json");
    expect(n).toContain("history.jsonl");
    expect(n).toContain("policy-limits.json");
  }, 300_000);

  test("permission-rule: the modes of the docs page", () => {
    expect(get("permission-rule")).toEqual([
      "acceptEdits",
      "auto",
      "bypassPermissions",
      "default",
      "dontAsk",
      "plan",
    ]);
  }, 300_000);

  test("error", () => {
    const n = get("error");
    console.log(`error items on 2.1.309: ${n.length}`);
    expect(n).toContain("Not connected");
    expect(n.some((x) => x.startsWith("Cloud gateway"))).toBe(true);
    expect(n.every((x) => x.length >= 10 && x.includes(" "))).toBe(true);
  }, 300_000);
});
