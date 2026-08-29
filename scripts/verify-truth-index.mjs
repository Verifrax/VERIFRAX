import crypto from "crypto";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function loadJson(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing truth-index artifact: ${relativePath}`);
  }

  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function sha256(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(absolutePath))
    .digest("hex");
}

function assertSafePath(relativePath) {
  if (
    typeof relativePath !== "string" ||
    relativePath.length === 0 ||
    path.isAbsolute(relativePath) ||
    relativePath.split("/").includes("..")
  ) {
    throw new Error(`Unsafe manifest path: ${relativePath}`);
  }
}

function verifyReleaseManifest() {
  const manifest = loadJson(
    "release-integrity/release-sha256-manifest.json",
  );

  let verified = 0;

  for (const [surface, entries] of Object.entries(manifest)) {
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
      throw new Error(`Invalid manifest group: ${surface}`);
    }

    for (const [relativePath, expectedHash] of Object.entries(entries)) {
      assertSafePath(relativePath);

      const absolutePath = path.join(ROOT, relativePath);

      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Manifest path missing: ${relativePath}`);
      }

      if (!/^[a-f0-9]{64}$/.test(String(expectedHash))) {
        throw new Error(`Invalid SHA-256 for ${relativePath}`);
      }

      const actualHash = sha256(relativePath);

      if (actualHash !== expectedHash) {
        throw new Error(
          `SHA-256 mismatch for ${relativePath}: expected=${expectedHash} actual=${actualHash}`,
        );
      }

      verified += 1;
    }
  }

  if (verified === 0) {
    throw new Error("Release integrity manifest contains no entries");
  }

  return verified;
}

function verifyFreezeSurfaces() {
  const freeze = loadJson("release-integrity/freeze-surfaces.json");

  if (!Array.isArray(freeze.frozen_surfaces)) {
    throw new Error("freeze-surfaces.json lacks frozen_surfaces");
  }

  for (const relativePath of freeze.frozen_surfaces) {
    assertSafePath(relativePath);

    if (!fs.existsSync(path.join(ROOT, relativePath))) {
      throw new Error(`Frozen surface missing: ${relativePath}`);
    }
  }

  return freeze.frozen_surfaces.length;
}

loadJson("release-integrity/reference-verifier-hashes.json");
loadJson("release-integrity/genesis-lineage.json");

const manifestEntries = verifyReleaseManifest();
const frozenSurfaces = verifyFreezeSurfaces();

console.log(
  `Truth index verified: ${manifestEntries} hashes, ${frozenSurfaces} frozen surfaces`,
);
