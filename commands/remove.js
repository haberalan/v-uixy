import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const projectRoot = process.cwd();
const templatesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../templates"
);
const componentsDir = path.join(projectRoot, "components/ui");
const componentIndexPath = path.join(componentsDir, "index.ts");

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

async function removeIndexExport(name) {
  const line = `export * from "./${name}";`;
  if (!(await fs.pathExists(componentIndexPath))) return;

  const content = await fs.readFile(componentIndexPath, "utf8");
  const newContent = content
    .split("\n")
    .filter((l) => l.trim() !== line)
    .join("\n");

  await fs.writeFile(componentIndexPath, newContent);
  console.log(`🧹 Removed export from index.ts for "${name}"`);
}

async function removeComponent(name) {
  const pathToRemove = path.join(componentsDir, name);
  const exists = await fs.pathExists(pathToRemove);

  if (!exists) {
    console.log(chalk.yellow(`⚠️  Component "${name}" does not exist.`));
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Remove component "${name}"?`,
      default: false,
    },
  ]);

  if (!confirm) return;

  await fs.remove(pathToRemove);
  await removeIndexExport(name);
  console.log(chalk.green(`🗑️  Removed component "${name}"`));
}

export default async function remove(componentName) {
  const registry = await loadRegistry();

  await removeComponent(componentName);
}
