import { signReport } from "./sign.js";

export function issueCertificate(report: any, privateKey: string) {
  return {
    issuedAt: new Date().toISOString(),
    signature: signReport(report, privateKey)
  };
}





