import crypto from "crypto";
import { canonicalStringify } from "./canonical-json.mjs";

export function sha256Cert(certObj){
  return crypto.createHash("sha256").update(canonicalStringify(certObj)).digest("hex");
}
