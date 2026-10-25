import { describe, expect, test } from "bun:test";
import { Bundle, children, type Node } from "../src/ast.ts";
import { literal, short, unique } from "../src/surface/common.ts";
import { KINDS, surface } from "../src/surface/index.ts";
import { bundle, items, names } from "./surface/util.ts";

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

  test("a repeated name keeps its first module and its last offset in it", () => {
    const a = "var x=process.env.AAA_ONE;var y=process.env.AAA_ONE;";
    const b = new Bundle([
      { name: "/$bunfs/root/a.js", text: a },
      { name: "/$bunfs/root/b.js", text: a },
    ]);
    const hit = surface(b, "env").find((i) => i.name === "AAA_ONE");
    expect([hit?.module, hit?.offset]).toEqual([
      "a.js",
      a.lastIndexOf("process"),
    ]);
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
