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
  { src: "components.json", dest: "components.json" },
  {
    src: "scripts/generateIconTypes.script.js",
    dest: "scripts/generateIconTypes.script.js",
  },
  { src: "assets/css/main.css", dest: "app/assets/css/main.css" },
  { src: "tailwind.config.ts", dest: "tailwind.config.ts" },
  { src: "nuxt.config.ts", dest: "nuxt.config.ts" },
  { src: "tsconfig.json", dest: "tsconfig.json" },
  { src: "types/styles.d.ts", dest: "types/styles.d.ts" },
  { src: "types/icons.ts", dest: "app/types/icons.ts" },
  { src: "utils/styles.ts", dest: "app/utils/styles.ts" },
  { src: "utils/twMerge.ts", dest: "app/utils/twMerge.ts" },
];

const dirsToCopy = [{ src: "assets/icons", dest: "app/assets/icons" }];

async function installPackages() {
  const packages = [
    "tailwindcss",
    "postcss",
    "autoprefixer",
    "vite-svg-loader",
    "tailwind-merge",
    "@tailwindcss/vite",
    "typescript",
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

  for (const { src: srcRel, dest: destRel } of filesToCopy) {
    const src = path.join(templateRoot, srcRel);
    const dest = path.join(root, destRel);

    const exists = await fs.pathExists(dest);
    if (exists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `${chalk.yellow(destRel)} already exists. Overwrite?`,
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
    console.log(chalk.green(`✔ Created ${destRel}`));
  }

  for (const { src: srcRel, dest: destRel } of dirsToCopy) {
    const src = path.join(templateRoot, srcRel);
    const dest = path.join(root, destRel);

    const exists = await fs.pathExists(dest);
    if (exists) {
      const { overwrite } = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: `${chalk.yellow(
            destRel
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
    console.log(chalk.green(`✔ Copied directory ${destRel}`));
  }

  if (!options.withoutPackages) {
    await installPackages();
  }

  console.log(chalk.green("\n🎉 v-uixy initialized successfully!\n"));
}
