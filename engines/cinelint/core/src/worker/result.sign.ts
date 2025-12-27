import * as crypto from "node:crypto"

export const signResult = (r: unknown, key: string) =>
  crypto.createHmac("sha256", key).update(JSON.stringify(r)).digest("hex")
