import * as crypto from "node:crypto"
import * as fs from "node:fs"

export function attestEngine(binaryPath: string) {
  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(binaryPath))
    .digest("hex")
  return { hash, algorithm: "sha256" }
}
