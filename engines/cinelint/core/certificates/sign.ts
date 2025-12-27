import crypto from "crypto";

export function generateKeyPair() {
  return crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" }
  });
}

export function signReport(report: any, privateKey: string) {
  const payload = JSON.stringify(report);
  const signature = crypto.sign(null, Buffer.from(payload), privateKey);
  return signature.toString("base64");
}

export function verifyReport(report: any, signature: string, publicKey: string) {
  const payload = JSON.stringify(report);
  return crypto.verify(
    null,
    Buffer.from(payload),
    publicKey,
    Buffer.from(signature, "base64")
  );
}





