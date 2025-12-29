import { isTrusted } from "../../trust/trust.root"
export const verifyFederated = (issuer: string) => isTrusted(issuer)
