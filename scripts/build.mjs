import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const runNodeScript = (scriptPath) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [scriptPath], { stdio: "inherit" });
    child.on("close", (code) => resolve(code ?? 1));
  });

const tsupCliPath = require.resolve("tsup/dist/cli-default.js");

const main = async () => {
  const code = await runNodeScript(tsupCliPath);
  await import("./ensure-use-client.mjs");
  process.exit(code);
};

await main();

