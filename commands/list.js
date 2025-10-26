import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";

const projectRoot = process.cwd();
const templatesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../templates"
);
const componentsDir = path.join(projectRoot, "app/components/ui");

async function loadRegistry() {
  const registryPath = path.join(templatesRoot, "components.json");

  const exists = await fs.pathExists(registryPath);
  if (!exists) {
    console.error(chalk.red("❌ Missing components.json inside templates."));
    process.exit(1);
  }

  const data = await fs.readJson(registryPath);
  return data.components || [];
}

async function listComponents() {
  const registry = await loadRegistry();
  const results = [];

  for (const { name } of registry) {
    const isInstalled = await fs.pathExists(path.join(componentsDir, name));

    results.push({
      name,
      status: isInstalled
        ? chalk.green("✔ installed")
        : chalk.gray("✖ not installed"),
    });
  }

  console.log(chalk.cyan("\n📦 Available Components:\n"));
  for (const c of results) {
    console.log(`${chalk.bold(c.name.padEnd(15))} ${c.status}`);
  }
  console.log();
}

export default listComponents;
