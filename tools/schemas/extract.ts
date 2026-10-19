// Reads the module table of a Bun single-file executable (read only) and returns each embedded module.
// Layout (Bun StandaloneModuleGraph), found by inspecting Claude Code 2.1.304:
//   [data ...][module table][...]  [Offsets: 32 bytes]  "\n---- Bun! ----\n"
//   Offsets = byte_count u64, modules {offset u32, length u32}, entry_point_id u32, argv {offset u32, length u32}, flags u32
//   Pointers are relative to base = (start of Offsets) - byte_count.
//   Each module entry is 52 bytes: name, contents, sourcemap, bytecode, module_info, bytecode_origin_path
//   (each {offset u32, length u32}) and 4 flag bytes.
import { readFileSync } from "node:fs";

export type BunModule = { name: string; source: string };

const TRAILER = "\n---- Bun! ----\n";
const ENTRY_SIZE = 52;

export function extractModules(binaryPath: string): {
  modules: BunModule[];
  entry: string;
} {
  const buf = readFileSync(binaryPath);
  const trailerAt = buf.lastIndexOf(TRAILER);
  if (trailerAt < 0)
    throw new Error(
      `${binaryPath} is not a Bun single-file executable (no trailer)`,
    );
  const at = trailerAt - 32;
  const byteCount = Number(buf.readBigUInt64LE(at));
  const tableOffset = buf.readUInt32LE(at + 8);
  const tableLength = buf.readUInt32LE(at + 12);
  const entryId = buf.readUInt32LE(at + 16);
  const base = at - byteCount;
  if (base < 0 || tableLength % ENTRY_SIZE !== 0)
    throw new Error("unexpected Bun module graph layout");
  const text = (offset: number, length: number) =>
    buf.toString("utf8", base + offset, base + offset + length);
  const modules: BunModule[] = [];
  for (let i = 0; i < tableLength / ENTRY_SIZE; i++) {
    const e = base + tableOffset + i * ENTRY_SIZE;
    const name = text(buf.readUInt32LE(e), buf.readUInt32LE(e + 4));
    if (!name.startsWith("/$bunfs/"))
      throw new Error(`bad module name at entry ${i}: ${JSON.stringify(name)}`);
    modules.push({
      name,
      source: text(buf.readUInt32LE(e + 8), buf.readUInt32LE(e + 12)),
    });
  }
  return { modules, entry: modules[entryId]?.name ?? "" };
}
