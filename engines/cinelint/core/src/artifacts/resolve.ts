import * as fs from "node:fs"
import * as crypto from "node:crypto"
import { Artifact } from "./artifact"

export function resolveArtifact(path: string): Artifact {
  const stat = fs.statSync(path)
  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(path))
    .digest("hex")

  return {
    id: hash.slice(0, 12),
    path,
    type: stat.isDirectory() ? "directory" : "file",
    size: stat.size,
    checksum: hash
  }
}
