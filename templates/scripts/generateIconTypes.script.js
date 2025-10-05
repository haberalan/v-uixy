import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgDir = path.join(__dirname, "../assets/icons");
const outputFile = path.join(__dirname, "../types/icons.ts");

function formatKey(name) {
  return name
    .replace(/ /g, "-")
    .split(" ")
    .map((word) =>
      word
        .split("")
        .map((letter) =>
          letter === letter.toUpperCase() && /[a-zA-Z]/.test(letter)
            ? `-${letter.toLowerCase()}`
            : letter
        )
        .join("")
    )
    .join("");
}

try {
  const files = fs
    .readdirSync(svgDir)
    .filter((file) => path.extname(file) === ".svg");

  const exportObject = `const ICONS = {\n  ${files
    .map((file) => {
      const rawName = path.basename(file, ".svg");
      const formattedName = formatKey(rawName);
      return `'${formattedName}': '${rawName}',`;
    })
    .join("\n  ")}\n} as const;\n\nexport { ICONS };`;

  const typeDefinition = `\nexport type IconName = keyof typeof ICONS;\n`;

  fs.writeFileSync(outputFile, `${exportObject}${typeDefinition}\n`);

  console.log("✅ icons.ts generated successfully!");
} catch (error) {
  console.error("❌ Error generating icons.ts:", error);
}
