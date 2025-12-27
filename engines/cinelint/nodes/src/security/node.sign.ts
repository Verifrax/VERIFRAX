import crypto from "crypto"

export function signNode(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex")
}
