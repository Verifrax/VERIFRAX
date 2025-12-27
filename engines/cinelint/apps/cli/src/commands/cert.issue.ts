import fs from "fs";
import path from "path";
import { emitCertificateV1, certificateHashV1 } from "../../../core/src/certificates/emit.v1";

type Input = any;

export async function issueCert(inPath: string, outDir: string) {
  const input: Input = JSON.parse(fs.readFileSync(inPath, "utf8"));
  const cert = emitCertificateV1(input);
  const certHash = certificateHashV1(cert);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "certificate.v1.json"), JSON.stringify(cert, null, 2));
  fs.writeFileSync(path.join(outDir, "certificate.v1.sha256"), certHash + "\n");
  process.stdout.write(certHash + "\n");
}

