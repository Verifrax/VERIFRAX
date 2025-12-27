import { createHash, randomUUID } from "node:crypto";
import type { CineLintCertificateV1 } from "./schema.v1";

export function sha256(x: string|Buffer) {
  return createHash("sha256").update(x).digest("hex");
}

export function emitCertificateV1(partial: Omit<CineLintCertificateV1,"version"|"certificate_id"|"issued_at">): CineLintCertificateV1 {
  const now = new Date().toISOString();
  const cert: CineLintCertificateV1 = {
    version: "v1",
    certificate_id: randomUUID(),
    issued_at: now,
    ...partial,
  };
  return cert;
}

export function certificateHashV1(cert: CineLintCertificateV1) {
  return sha256(JSON.stringify(cert));
}

