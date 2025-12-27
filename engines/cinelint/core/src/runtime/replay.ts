import * as crypto from "node:crypto";

export const replayHash = (inputs: unknown[]) =>
  crypto.createHash("sha256").update(JSON.stringify(inputs)).digest("hex");

