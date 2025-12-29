import { isTrusted } from "../../trust/trust.root"
export function verifyCert(cert: any) {
  if (!isTrusted(cert.issuer)) throw new Error("Untrusted issuer")
  return true
}
