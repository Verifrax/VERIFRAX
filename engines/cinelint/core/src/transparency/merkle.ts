import crypto from "crypto"
export function merkle(entries: string[]) {
  return crypto.createHash("sha256").update(entries.join("")).digest("hex")
}
