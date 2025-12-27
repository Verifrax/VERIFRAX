import * as crypto from "node:crypto"

export const merkleRoot = (leaves: string[]) =>
  crypto.createHash("sha256").update(leaves.sort().join("")).digest("hex")
