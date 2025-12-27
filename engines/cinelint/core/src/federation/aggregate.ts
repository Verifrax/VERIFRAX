import crypto from "crypto";
import { FederatedResult } from "./result";

export const aggregateFederatedReceipt = (results: FederatedResult[]) =>
  crypto
    .createHash("sha256")
    .update(
      results
        .sort((a, b) => a.engineId.localeCompare(b.engineId))
        .map(r => r.engineId + ":" + r.receiptRoot)
        .join("|")
    )
    .digest("hex");

