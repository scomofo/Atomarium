import { spawn } from "node:child_process";
import { closeSync, mkdirSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectProcess } from "./local-processes.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pidFile = join(root, ".grok/dev.pid");
mkdirSync(join(root, ".grok"), { recursive: true });
let pid;
try {
  pid = Number(readFileSync(pidFile, "utf8").trim());
} catch {
  /* No previous dev process. */
}
const isDev = (cmd) => /\brun\s+dev(?:\s|$)/.test(cmd.replaceAll("\0", " "));
// npm briefly sets its process title to just "npm" while initializing. Give a
// live process in this project time to reveal its script before starting another.
let reuse = false;
if (Number.isInteger(pid) && pid > 1) {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (projectProcess(pid, root, isDev)) {
      reuse = true;
      break;
    }
    if (!projectProcess(pid, root, () => true)) break;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}
if (!reuse) {
  const log = openSync(join(root, ".grok/dev.log"), "w");
  const child = spawn("npm", ["run", "dev", "--", ...process.argv.slice(2)], {
    cwd: root,
    detached: true,
    stdio: ["ignore", log, log],
  });
  await new Promise((resolve, reject) => {
    child.once("spawn", resolve);
    child.once("error", reject);
  });
  writeFileSync(pidFile, `${child.pid}\n`);
  closeSync(log);
  child.unref();
}
