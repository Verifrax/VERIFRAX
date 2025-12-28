import express from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { verify } from "../../../../core/engine/verifier";

const app = express();
app.use(express.json({ limit: "10mb" }));
const upload = multer({ dest: path.join(os.tmpdir(), "verifrax-upload") });

function verifyDir(dir: string, profileId?: string): { verdict: any; ok: boolean } {
  try {
    const verdict = verify({
      bundlePath: dir,
      profileId: profileId || "public@1.0.0"
    });
    
    // Write verdict to bundle
    const verdictPath = path.join(dir, "verdict.json");
    fs.writeFileSync(verdictPath, JSON.stringify(verdict, null, 2));
    
    const ok = verdict.verdict === "VALID";
    return { verdict, ok };
  } catch (e: any) {
    return {
      verdict: {
        verdict: "INVALID",
        reason_codes: ["VFX-EXEC-0001"],
        reason_graph: { claims: [], evidence: [], rules: [], failure_points: [] },
        counterfactuals: [],
        profile_id: profileId || "public@1.0.0",
        contract_hash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        schema_hashes: [],
        bundle_hash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        verifier_build_hash: "sha256:0000000000000000000000000000000000000000000000000000000000000000",
        timestamp_utc: new Date().toISOString()
      },
      ok: false
    };
  }
}

// POST /verify - Finalize bundle and return verdict-only output
app.post("/verify", upload.single("bundle"), (req, res) => {
  try {
    const bundlePath = (req.body?.path as string | undefined) || "";
    const profileId = (req.body?.profile_id as string | undefined);
    if (bundlePath) {
      const { verdict, ok } = verifyDir(bundlePath, profileId);
      
      // VERDICT-ONLY OUTPUT (hardened)
      // Output only: verdict_id, bundle_hash
      const verdictOnly = {
        verdict_id: verdict.verdict_id,
        bundle_hash: verdict.bundle_hash
      };
      
      return res.status(ok ? 200 : 422).json(verdictOnly);
    }
    if (!req.file) return res.status(400).json({ error: "missing: path or bundle file" });

    // expect folder upload unpack handled externally; for now accept directory path only
    return res.status(400).json({ error: "file upload not supported in this minimal shell; pass {path}" });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  } finally {
    if (req.file?.path) fs.rmSync(req.file.path, { force: true });
  }
});

// GET /claim/:id - Get claim and verdict
app.get("/claim/:id", (req, res) => {
  try {
    const claimId = req.params.id;
    // TODO: Load claim from truth index or bundle
    return res.status(404).json({ error: "Claim not found" });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

// GET /bundle/:hash - Get verdict and graph for bundle
app.get("/bundle/:hash", (req, res) => {
  try {
    const bundleHash = req.params.hash;
    // TODO: Load bundle and verdict from truth index
    return res.status(404).json({ error: "Bundle not found" });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

// POST /invalidate - Create invalidation (signed)
app.post("/invalidate", (req, res) => {
  try {
    const invalidation = req.body;
    // TODO: Verify signature and create invalidation
    return res.status(201).json({ invalidation_id: "generated-id" });
  } catch (e: any) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

const port = Number(process.env.PORT || 8080);
app.listen(port, () => console.log(`api-verifier listening :${port}`));
