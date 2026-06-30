#!/usr/bin/env node
// scripts/dev-all.mjs - port-aware dev runner (scaffolded by /dev).
// Reads PORT / INNGEST_PORT from .env.development.local so every worktree
// runs `npm run dev:all` with zero flags; main worktree defaults 3000/8288.
import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const env = {};
if (existsSync(".env.development.local")) {
  for (const line of readFileSync(".env.development.local", "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
}
const port = env.PORT ?? "3000";
const inngestPort = env.INNGEST_PORT ?? "8288";
const isMain = port === "3000" && inngestPort === "8288";
const hasInngest = existsSync("src/app/api/inngest/route.ts") || existsSync("src/inngest/serve.ts");

const procs = [["next", ["npx", "next", "dev", "-p", port]]];
if (hasInngest) procs.push(["inngest", ["npx", "inngest-cli@latest", "dev",
  ...(isMain ? [] : ["--port", inngestPort, "--no-discovery", "-u", `http://localhost:${port}/api/inngest`])]]);

console.log(`dev:all  next:${port}  ${hasInngest ? `inngest:${inngestPort}` : "(no inngest)"}`);
const children = procs.map(([name, [cmd, ...args]]) => {
  const p = spawn(cmd, args, { env: { ...process.env, PORT: port }, shell: process.platform === "win32" });
  const tag = (d) => d.toString().split("\n").filter(Boolean).forEach((l) => console.log(`[${name}] ${l}`));
  p.stdout.on("data", tag);
  p.stderr.on("data", tag);
  p.on("exit", (code) => { console.log(`[${name}] exited ${code}`); children.forEach((c) => c.kill()); process.exit(code ?? 0); });
  return p;
});
process.on("SIGINT", () => children.forEach((c) => c.kill()));
