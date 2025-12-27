import * as fs from "node:fs"
import * as crypto from "node:crypto"

export function generateSBOM(files: string[]) {
  return files.map(f => ({
    file: f,
    hash: crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex")
  }))
}
