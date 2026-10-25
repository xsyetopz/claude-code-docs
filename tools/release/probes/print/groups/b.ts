// Print probe groups owned by chunk B3. index.ts (B2) concatenates this with groupsA.
import { automode } from "../automode.ts";
import { briefResume } from "../brief.ts";
import { cachetouch } from "../cachetouch.ts";
import { configmem } from "../configmem.ts";
import { dsc } from "../dsc.ts";
import { misc } from "../misc.ts";
import { models } from "../models.ts";
import { plugindata } from "../plugindata.ts";
import { subagents } from "../subagents.ts";
import type { PrintGroup } from "../types.ts";
import { workflow } from "../workflow.ts";

export const groupsB: PrintGroup[] = [
  automode,
  subagents,
  workflow,
  configmem,
  dsc,
  briefResume,
  cachetouch,
  models,
  misc,
  plugindata,
];
