import { Bundle } from "../../src/ast.ts";
import { surface } from "../../src/surface/index.ts";

export const bundle = (text: string) =>
  new Bundle([{ name: "/$bunfs/root/a.js", text }]);
export const items = (kind: string, text: string) =>
  surface(bundle(text), kind);
export const names = (kind: string, text: string) =>
  items(kind, text).map((i) => i.name);
