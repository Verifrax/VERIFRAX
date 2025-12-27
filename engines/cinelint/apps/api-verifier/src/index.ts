import express from "express";
import multer from "multer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const app = express();
app.use(express.json({ limit: "10mb" }));
const upload = multer({ dest: path.join(os.tmpdir(), "verifrax-upload") });

function verifyDir(dir: string) {
  const out = execFileSync("node", ["tools/bundle-verify.mjs", dir], { encoding: "utf8" }).trim();
  return { ok: out.includes("VERIFIED"), output: out };
}

app.post("/verify", upload.single("bundle"), (req, res) => {
  try {
    const bundlePath = (req.body?.path as string | undefined) || "";
    if (bundlePath) {
      const r = verifyDir(bundlePath);
      return res.status(r.ok ? 200 : 422).json(r);
    }
    if (!req.file) return res.status(400).json({ ok: false, error: "missing: path or bundle file" });

    // expect folder upload unpack handled externally; for now accept directory path only
    return res.status(400).json({ ok: false, error: "file upload not supported in this minimal shell; pass {path}" });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  } finally {
    if (req.file?.path) fs.rmSync(req.file.path, { force: true });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`api-verifier listening :${port}`));
