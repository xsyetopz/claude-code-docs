// Port allocator. OS-assigned by default; a registry dir keeps two toolkit processes from picking the same port.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { onCleanup } from "./cleanup.ts";

const REG = join(tmpdir(), "cc-release-toolkit-ports");
const mine = new Set<number>();

const alive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};
/** Atomic claim (flag "wx"). A stale file (owner PID dead) is removed and retried once. Returns false if held. */
const claim = (port: number): boolean => {
  mkdirSync(REG, { recursive: true });
  const f = join(REG, String(port));
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      writeFileSync(f, String(process.pid), { flag: "wx" });
      mine.add(port);
      return true;
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
      let pid = 0;
      try {
        pid = Number(readFileSync(f, "utf8"));
      } catch {
        // vanished: retry
      }
      if (pid > 0 && alive(pid)) return false;
      rmSync(f, { force: true });
    }
  }
  return false;
};
onCleanup(() => {
  for (const p of mine) rmSync(join(REG, String(p)), { force: true });
});

export const inUse = (port: number): Promise<boolean> =>
  new Promise((resolve) => {
    const s = createServer();
    s.once("error", () => resolve(true));
    s.listen(port, "127.0.0.1", () => s.close(() => resolve(false)));
  });

export const allocPort = async (): Promise<number> => {
  for (let i = 0; i < 20; i++) {
    const port = await new Promise<number>((resolve, reject) => {
      const s = createServer();
      s.once("error", reject);
      s.listen(0, "127.0.0.1", () => {
        const p = (s.address() as { port: number }).port;
        s.close(() => resolve(p));
      });
    });
    if (claim(port)) return port;
  }
  throw new Error("could not allocate a free port");
};

/** Pick an unclaimed port from a fixed range (default 18400-18499), for readable logs. Registry only; bind may still fail. */
export const reserve = (range: [number, number] = [18400, 18499]): number => {
  for (let p = range[0]; p <= range[1]; p++) {
    if (claim(p)) return p;
  }
  throw new Error(`no free port in ${range[0]}-${range[1]}`);
};
