import crypto from "crypto"

export const merkleRoot = (leaves: string[]) =>
  crypto.createHash("sha256").update(leaves.sort().join("")).digest("hex")
