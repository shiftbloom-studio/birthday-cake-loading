import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

const runNodeScript = (scriptPath, { cwd } = {}) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], { stdio: "inherit", cwd });
    child.on("close", (code) => resolve(code ?? 1));
  });

const tsupCliPath = require.resolve("tsup/dist/cli-default.js");

const main = async () => {
  const rootDir = process.cwd();

  const coreDir = path.join(rootDir, "packages", "core");
  const reactDir = path.join(rootDir, "packages", "react");

  const codeCore = await runNodeScript(tsupCliPath, { cwd: coreDir });
  if (codeCore !== 0) {
    process.exit(codeCore);
  }

  const codeReact = await runNodeScript(tsupCliPath, { cwd: reactDir });
  if (codeReact !== 0) {
    process.exit(codeReact);
  }
  // Ensure Next.js friendliness for React entrypoints.
  await runNodeScript(path.join(rootDir, "scripts", "ensure-use-client.mjs"), {
    cwd: reactDir
  });

  const codeRoot = await runNodeScript(tsupCliPath, { cwd: rootDir });
  await import("./ensure-use-client.mjs");
  process.exit(codeRoot);
};

await main();

