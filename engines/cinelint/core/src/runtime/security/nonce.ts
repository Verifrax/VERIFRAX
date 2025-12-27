import crypto from "crypto"
export const generateNonce = () => crypto.randomBytes(32).toString("hex")
