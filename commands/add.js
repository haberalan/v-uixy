import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { execa } from "execa";
import { fileURLToPath } from "url";

const projectRoot = process.cwd();
const templatesRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../templates"
);

const registryPath = path.join(templatesRoot, "components.json");

async function getProjectPaths() {
  const componentsDir = path.join(projectRoot, "app/components/ui");
  const composablesDir = path.join(projectRoot, "app/composables");

  return {
    componentsDir,
    composablesDir,
    componentIndexPath: path.join(componentsDir, "index.ts"),
    composablesIndexPath: path.join(composablesDir, "index.ts"),
  };
}

async function loadRegistry() {
  const exists = await fs.pathExists(registryPath);
  if (!exists) {
    console.error(chalk.red("❌ Missing components.json"));
    process.exit(1);
  }

  const data = await fs.readJson(registryPath);
  return data.components || [];
}

function parseRelated(raw) {
  if (Array.isArray(raw))
    return raw.flatMap((r) => r.split(",").map((s) => s.trim()));
  if (typeof raw === "string") return raw.split(",").map((s) => s.trim());
  return [];
}

async function resolveDeps(name, registry, resolved = new Set()) {
  if (resolved.has(name)) return;

  const def = registry.find((c) => c.name === name);
  if (!def) {
    console.error(chalk.red(`❌ Component "${name}" not found in registry.`));
    return;
  }

  resolved.add(name);

  for (const related of parseRelated(def["related-components"])) {
    await resolveDeps(related, registry, resolved);
  }
}

async function copyComponent(name) {
  const src = path.join(templatesRoot, `components/${name}`);
  const { componentsDir } = await getProjectPaths();
  const dest = path.join(componentsDir, name);

  if (!(await fs.pathExists(src))) {
    console.log(chalk.yellow(`⚠️  No template found for component "${name}"`));
    return;
  }
  await fs.ensureDir(componentsDir);
  await fs.copy(src, dest, { overwrite: true });
  console.log(chalk.green(`✔ Copied ${name} to app/components/ui/${name}`));
}

async function resolveComposableDeps(src, seen) {
  const content = await fs.readFile(src, "utf8");
  const deps = new Set();

  for (const match of content.matchAll(
    /(?:import|export)[^"']*from\s+["']\.\/([A-Za-z0-9_-]+)["']/g
  )) {
    deps.add(match[1]);
  }

  for (const dep of deps) {
    if (!seen.has(dep)) await copyComposable(dep, seen);
  }
}

async function copyComposable(name, seen = new Set()) {
  if (seen.has(name)) return;
  seen.add(name);

  const src = path.join(templatesRoot, `composables/${name}.ts`);
  const { composablesDir } = await getProjectPaths();
  const dest = path.join(composablesDir, `${name}.ts`);

  if (!(await fs.pathExists(src))) {
    console.log(chalk.yellow(`⚠️  No template found for composable "${name}"`));
    return;
  }

  await fs.ensureDir(composablesDir);
  await fs.copy(src, dest, { overwrite: true });
  console.log(chalk.green(`✔ Copied composable: ${name}.ts`));

  await updateComposablesIndex(name);

  await resolveComposableDeps(src, seen);
}

async function getExistingIndexComponents() {
  const { componentIndexPath } = await getProjectPaths();
  if (!(await fs.pathExists(componentIndexPath))) return [];

  const content = await fs.readFile(componentIndexPath, "utf8");
  const names = [];
  for (const line of content.split("\n")) {
    const m = line.match(/^\s*export \* from \"\.\/([^\"]+)\";\s*$/);
    if (m && m[1]) names.push(m[1].trim());
  }
  return names;
}

async function updateIndex(newComponents) {
  const { componentIndexPath, componentsDir } = await getProjectPaths();
  await fs.ensureDir(componentsDir);
  await fs.ensureFile(componentIndexPath);

  const existing = await getExistingIndexComponents();
  const existingSet = new Set(existing);

  const merged = [...existing];
  for (const name of newComponents) {
    if (!existingSet.has(name)) {
      merged.push(name);
      existingSet.add(name);
    }
  }

  const lines = merged.map((name) => `export * from "./${name}";`);
  await fs.writeFile(componentIndexPath, lines.join("\n") + "\n");
  console.log(chalk.green(`🔗 Updated app/components/ui/index.ts`));
}

async function updateComposablesIndex(name) {
  const { composablesIndexPath, composablesDir } = await getProjectPaths();
  const line = `export * from "./${name}";`;
  await fs.ensureDir(composablesDir);
  await fs.ensureFile(composablesIndexPath);
  const content = await fs.readFile(composablesIndexPath, "utf8");
  const lines = content.split("\n").map((line) => line.trim());

  if (!lines.includes(line)) {
    await fs.appendFile(composablesIndexPath, line + "\n");
    console.log(`🔗 Linked composable "${name}" in app/composables/index.ts`);
  } else {
    console.log(`ℹ️  Composable "${name}" already linked`);
  }
}

async function installPackages(componentNames, registry) {
  const packages = new Set();

  for (const name of componentNames) {
    const def = registry.find((c) => c.name === name);
    if (def?.packages?.length) {
      def.packages.forEach((pkg) => packages.add(pkg));
    }
  }

  if (packages.size === 0) return;

  const packageJsonPath = path.join(projectRoot, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  const existingDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const toInstall = [...packages].filter((pkg) => !existingDeps[pkg]);

  if (toInstall.length === 0) {
    console.log(chalk.gray("✅ All required packages are already installed."));
    return;
  }

  console.log(
    chalk.blue(`📦 Installing new packages: ${toInstall.join(", ")}`)
  );

  try {
    await execa("npm", ["install", ...toInstall], { stdio: "inherit" });
    console.log(chalk.green("✔ Packages installed"));
  } catch (err) {
    console.error(chalk.red("✖ Failed to install packages"));
  }
}

async function ensureTypeScriptInstalled() {
  const packageJsonPath = path.join(projectRoot, "package.json");
  if (!(await fs.pathExists(packageJsonPath))) return;

  const packageJson = await fs.readJson(packageJsonPath);
  const hasTS = Boolean(
    packageJson.dependencies?.typescript ||
      packageJson.devDependencies?.typescript
  );
  if (hasTS) return;

  console.log(chalk.blue("📦 Installing dev dependency: typescript"));
  try {
    await execa("npm", ["install", "-D", "typescript"], { stdio: "inherit" });
    console.log(chalk.green("✔ Installed typescript"));
  } catch (err) {
    console.error(chalk.red("✖ Failed to install typescript"));
  }
}

async function ensureTsconfig() {
  const tsconfigDest = path.join(projectRoot, "tsconfig.json");
  if (await fs.pathExists(tsconfigDest)) return;

  const tsconfigSrc = path.join(templatesRoot, "tsconfig.json");
  if (!(await fs.pathExists(tsconfigSrc))) return;

  try {
    await fs.copy(tsconfigSrc, tsconfigDest);
    console.log(chalk.green("✔ Added tsconfig.json"));
  } catch (err) {
    console.error(chalk.red("✖ Failed to add tsconfig.json"));
  }
}

async function copyTypes() {
  const typesSrcDir = path.join(templatesRoot, "types");
  if (!(await fs.pathExists(typesSrcDir))) return;

  const typesDestDir = path.join(projectRoot, "app/types");
  await fs.ensureDir(typesDestDir);

  const files = await fs.readdir(typesSrcDir);
  for (const file of files) {
    await fs.copy(
      path.join(typesSrcDir, file),
      path.join(typesDestDir, file),
      { overwrite: true }
    );
  }

  console.log(chalk.green("✔ Synced type definitions to app/types"));
}

export default async function add(componentName) {
  const registry = await loadRegistry();
  let componentsToAdd = new Set();

  await ensureTypeScriptInstalled();
  await ensureTsconfig();
  await copyTypes();

  if (componentName.toLowerCase() === "all") {
    componentsToAdd = new Set(registry.map((c) => c.name));
  } else {
    await resolveDeps(componentName, registry, componentsToAdd);
  }

  const copied = [];
  const copiedComposables = new Set();

  for (const name of componentsToAdd) {
    await copyComponent(name);
    copied.push(name);

    const def = registry.find((c) => c.name === name);
    for (const composable of def?.composables || []) {
      await copyComposable(composable, copiedComposables);
    }
  }

  await updateIndex(copied);
  await installPackages(componentsToAdd, registry);
}
