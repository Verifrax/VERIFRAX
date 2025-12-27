import crypto from "crypto"
export const hashReport = (r: any) =>
  crypto.createHash("sha256").update(JSON.stringify(r)).digest("hex")
