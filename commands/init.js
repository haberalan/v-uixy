import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { execa } from "execa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = process.cwd();

const templateRoot = path.resolve(__dirname, "../templates");

const filesToCopy = [
  "components.json",
  "scripts/generateIconTypes.script.js",
  "assets/css/main.css",
  "tailwind.config.ts",
  "nuxt.config.ts",
  "tsconfig.json",
  "types/styles.d.ts",
  "types/icons.ts",
  "utils/styles.ts",
  "utils/twMerge.ts",
];

const dirsToCopy = ["assets/icons"];

async function installPackages() {
  const packages = [
    "tailwindcss",
    "postcss",
    "autoprefixer",
    "vite-svg-loader",
    "tailwind-merge",
    "@tailwindcss/vite",
  ];

  console.log(chalk.blue("\n📦 Installing dependencies..."));
  try {
    await execa("npm", ["install", "-D", ...packages], { stdio: "inherit" });
    console.log(chalk.green("✔ Dependencies installed successfully!"));
  } catch (err) {
    console.log(chalk.red("✖ Failed to install packages"));
    console.error(err);
  }
}

export default async function init(options = {}) {
  console.log(chalk.cyan("🧩 Initializing v-uixy..."));

  for (const relPath of filesToCopy) {
    const src = path.join(templateRoot, relPath);
    const dest = path.join(root, relPath);

    const exists = await fs.pathExists(dest);
    if (exists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `${chalk.yellow(relPath)} already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.gray(`→ Skipped ${relPath}`));
        continue;
      }
    }

    await fs.ensureDir(path.dirname(dest));
    await fs.copy(src, dest);
    console.log(chalk.green(`✔ Created ${relPath}`));
  }

  for (const relPath of dirsToCopy) {
    const src = path.join(templateRoot, relPath);
    const dest = path.join(root, relPath);

    const exists = await fs.pathExists(dest);
    if (exists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `${chalk.yellow(
            relPath
          )} already exists. Overwrite entire directory?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        console.log(chalk.gray(`→ Skipped ${relPath}`));
        continue;
      }

      await fs.remove(dest);
    }

    await fs.copy(src, dest);
    console.log(chalk.green(`✔ Copied directory ${relPath}`));
  }

  if (!options.withoutPackages) {
    await installPackages();
  }

  console.log(chalk.green("\n🎉 v-uixy initialized successfully!\n"));
}
