import crypto from "crypto"
import fs from "fs"

export function attestEngine(binaryPath: string) {
  const hash = crypto
    .createHash("sha256")
    .update(fs.readFileSync(binaryPath))
    .digest("hex")
  return { hash, algorithm: "sha256" }
}
