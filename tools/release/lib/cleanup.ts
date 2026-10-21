// One shared exit/signal hook for sandbox, ports and proc. Handlers run once, in registration order.
const fns: (() => void)[] = [];
let done = false;
const runAll = (): void => {
  if (done) return;
  done = true;
  for (const f of fns)
    try {
      f();
    } catch {
      // best effort
    }
};
process.on("exit", runAll);
for (const sig of ["SIGINT", "SIGTERM"] as const)
  process.on(sig, () => {
    runAll();
    process.exit(sig === "SIGINT" ? 130 : 143);
  });

export const onCleanup = (f: () => void): void => void fns.push(f);
