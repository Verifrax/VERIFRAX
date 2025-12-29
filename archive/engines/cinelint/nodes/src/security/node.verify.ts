import crypto from "crypto"

export function verifyNode(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return expected === signature
}
