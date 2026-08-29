import fs from "fs";
import path from "path";

const workflowDirectory = path.resolve(".github/workflows");
const failures = [];

const workflowFiles = fs
  .readdirSync(workflowDirectory)
  .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
  .sort();

for (const file of workflowFiles) {
  const relativePath = `.github/workflows/${file}`;
  const text = fs.readFileSync(path.join(workflowDirectory, file), "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (/\bTODO\s*:/.test(line)) {
      failures.push(`${relativePath}:${lineNumber}: placeholder TODO`);
    }

    if (/\bexit\s+0\b/.test(line)) {
      failures.push(`${relativePath}:${lineNumber}: explicit success exit`);
    }

    if (/\|\|\s*(true|:|echo)\b/.test(line)) {
      failures.push(`${relativePath}:${lineNumber}: fail-open operator`);
    }

    if (/createCommitStatus/.test(line)) {
      failures.push(`${relativePath}:${lineNumber}: manual status publisher`);
    }

    if (/\bstate\s*=\s*["']success["']/.test(line)) {
      failures.push(`${relativePath}:${lineNumber}: hardcoded success state`);
    }

    if (/\bgit\s+push\s+--force(?:\s|$)/.test(line)) {
      failures.push(`${relativePath}:${lineNumber}: force push`);
    }

    const usesMatch = line.match(/^\s*uses:\s*([^\s#]+)/);

    if (usesMatch) {
      const reference = usesMatch[1];

      if (
        !reference.startsWith("./") &&
        !reference.startsWith("docker://") &&
        !/@[a-f0-9]{40}$/.test(reference)
      ) {
        failures.push(
          `${relativePath}:${lineNumber}: action is not pinned to a 40-character commit: ${reference}`,
        );
      }
    }
  });
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Workflow hygiene verified across ${workflowFiles.length} files`);
}
