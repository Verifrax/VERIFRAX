#!/usr/bin/env node
import { startServer } from "@verifrax/core/src/runtime/server";
import { issueCert } from "./commands/cert.issue";

const cmd = process.argv[2];

if (cmd === "cert" && process.argv[3] === "issue") {
  const inPath = process.argv[4];
  const outDir = process.argv[5] || "out/cert";
  issueCert(inPath, outDir).catch((e)=>{ console.error(e); process.exit(1); });
}
if (cmd === "serve") startServer({ port: Number(process.env.PORT) || 3333 });
if (cmd === "verify") {
  fetch("http://localhost:3333/verify")
    .then(r => r.text())
    .then(console.log);
}
if (cmd === "run") {
  fetch("http://localhost:3333/run", {
    method: "POST",
    body: JSON.stringify({ input: process.argv.slice(3) }),
  })
    .then(async r => ({
      receipt: r.headers.get("x-verifrax-receipt"),
      body: await r.json()
    }))
    .then(console.log);
}
