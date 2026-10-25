import type { Variant } from "../variants.ts";

export type ApiBlock = {
  type: string;
  text: string;
  input?: unknown;
  content?: unknown;
};
export type Part = { label: string; text: string };
export type Tool = {
  name: string;
  desc: number;
  schema: number;
  text: string;
  schemaText: string;
};
export type Cap = {
  v: Variant;
  text: string;
  parts: Part[];
  chars: number;
  tools: Tool[];
  sections: string[];
  model: string;
  ok: boolean;
};
export type IndexRow = {
  after?: string;
  change: string;
  toggle: string;
  where: string;
  status: string;
  select?: string;
  chars?: number;
  tools?: number;
  sections?: string;
};
export type HandPage = {
  id: string;
  title: string;
  row?: IndexRow | undefined;
};
export type FrontMatter = {
  title?: string;
  generated?: boolean;
  index?: IndexRow;
};
