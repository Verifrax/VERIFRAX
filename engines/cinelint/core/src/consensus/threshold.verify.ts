import * as crypto from "node:crypto"
import { ThresholdSignature } from "./threshold"

export function verifyThreshold(
  payload: string,
  sigs: ThresholdSignature[],
  publicKeys: Record<string, string>,
  threshold: number
): boolean {
  let valid = 0
  for (const s of sigs) {
    const key = publicKeys[s.signer]
    if (!key) continue
    const ok = crypto.verify(
      "sha256",
      Buffer.from(payload),
      key,
      Buffer.from(s.signature, "hex")
    )
    if (ok) valid++
  }
  return valid >= threshold
}
