import * as crypto from "node:crypto"
export const generateNonce = () => crypto.randomBytes(32).toString("hex")
