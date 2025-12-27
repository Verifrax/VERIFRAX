import crypto from "crypto";

export const aggregate = (hashes: string[]) =>
  crypto.createHash("sha256").update(hashes.sort().join("")).digest("hex");

