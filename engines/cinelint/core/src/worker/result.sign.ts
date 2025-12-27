import crypto from "crypto"

export const signResult = (r: unknown, key: string) =>
  crypto.createHmac("sha256", key).update(JSON.stringify(r)).digest("hex")
