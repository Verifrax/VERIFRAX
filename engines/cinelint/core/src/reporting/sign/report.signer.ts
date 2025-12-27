import * as crypto from "node:crypto"

export function signReport(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}
