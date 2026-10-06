import { spawn } from "node:child_process";
import { closeSync, mkdirSync, openSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { projectProcess } from "./local-processes.mjs";
import net from "node:net";

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

const PREFERRED_PORT = 5173;
const portFile = join(root, ".grok/dev-port");

const tcpOpen = (port) =>
  new Promise((resolve) => {
    const s = net.createConnection({ port, host: "127.0.0.1", timeout: 800 });
    s.on("connect", () => { s.destroy(); resolve(true); });
    s.on("timeout", () => { s.destroy(); resolve(false); });
    s.on("error", () => resolve(false));
  });

// resolvePort: an explicit $PORT wins (numeric-checked); otherwise the first
// TCP-free port at/above the preferred, capped at +50. The choice is saved
// to .grok/dev-port so later runs (and humans) can find the server.
async function resolvePort() {
  const explicit = (process.env.PORT || "").trim();
  if (explicit) {
    if (!/^\d+$/.test(explicit)) throw new Error(`PORT must be numeric, got '${explicit}'`);
    writeFileSync(portFile, `${explicit}\n`);
    return explicit;
  }
  let port = PREFERRED_PORT;
  while (await tcpOpen(port)) {
    port += 1;
    if (port > PREFERRED_PORT + 50) throw new Error(`no open port near ${PREFERRED_PORT}`);
  }
  writeFileSync(portFile, `${port}\n`);
  if (port !== PREFERRED_PORT) console.error(`port ${PREFERRED_PORT} busy, dev server on ${port}`);
  return String(port);
}

if (!reuse) {
  const log = openSync(join(root, ".grok/dev.log"), "w");
  const port = await resolvePort();
  const child = spawn("npm", ["run", "dev", "--", ...process.argv.slice(2)], {
    cwd: root,
    detached: true,
    stdio: ["ignore", log, log],
    env: { ...process.env, PORT: port },
  });
  await new Promise((resolve, reject) => {
    child.once("spawn", resolve);
    child.once("error", reject);
  });
  writeFileSync(pidFile, `${child.pid}\n`);
  closeSync(log);
  child.unref();
}
