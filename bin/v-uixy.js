#!/usr/bin/env node

import { createRequire } from "module";
import { Command } from "commander";
import add from "../commands/add.js";
import remove from "../commands/remove.js";
import list from "../commands/list.js";
import init from "../commands/init.js";

const require = createRequire(import.meta.url);

let pkgVersion = "0.0.0";
try {
  const pkg = require("../package.json");
  pkgVersion = pkg.version || pkgVersion;
} catch {}

const program = new Command();

program
  .name("v-uixy")
  .description("A UI components CLI for Nuxt + Tailwind")
  .version(pkgVersion);

program.command("add <component>").description("Add a component").action(add);

program
  .command("remove <component>")
  .description("Remove a component")
  .action(remove);

program.command("list").description("List available components").action(list);

program
  .command("init")
  .description("Initialize v-uixy in your project")
  .action(init);

program.parse(process.argv);
