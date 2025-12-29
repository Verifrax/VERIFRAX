import * as crypto from "node:crypto";
import { ThresholdSignature } from "./threshold";

export const verifyThresholdSignature = (
  payload: string,
  sig: ThresholdSignature,
  pubkeys: Record<string, string>
) => {
  if (sig.signers.length < 2)
    throw new Error("INSUFFICIENT_THRESHOLD_SIGNERS");
  if (sig.signers.length === 0) return false;
  return sig.signers.every(id =>
    crypto.verify(
      "sha256",
      Buffer.from(payload),
      pubkeys[id],
      Buffer.from(sig.signature, "hex")
    )
  );
};

