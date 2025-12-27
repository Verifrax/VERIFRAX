import fs from "fs"
import crypto from "crypto"

export function generateSBOM(files: string[]) {
  return files.map(f => ({
    file: f,
    hash: crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex")
  }))
}
