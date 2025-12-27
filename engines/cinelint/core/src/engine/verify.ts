import { selfVerify } from "./self.verify";
import { verifyWorkerSet, verifyConsensus } from "../consensus/verify";
import { assembleReceipt } from "../reporting/distributed/assemble";
import { WorkerResult } from "../worker/result";
import { verifyThresholdSignature } from "../crypto/threshold.verify";
import { slash } from "../consensus/slash";
import { audit } from "../consensus/audit";
import { ENGINE_ID } from "./engine.id";
import { canonicalize } from "../consensus/canonicalize";

export const verifyDistributed = (
  results: WorkerResult[],
  engineId: string,
  sig: any,
  pubkeys: Record<string, string>
) => {
  const workers = results.map(r => r.workerId);
  if (!verifyWorkerSet(workers)) throw new Error("DUPLICATE_WORKERS");
  if (!verifyConsensus(sig.signers.length, workers.length)) throw new Error("NO_QUORUM");
  const payload =
    "CINELINT_CONSENSUS_V1::" + canonicalize(results);
  if (!verifyThresholdSignature(payload, sig, pubkeys)) {
    const offender = sig?.signers?.[0] ?? "UNKNOWN";
    audit({ type: "SLASH", offender, reason: "INVALID_SIGNATURE" });
    slash({ workerId: offender, reason: "INVALID_SIGNATURE", evidence: payload });
    throw new Error("INVALID_THRESHOLD_SIGNATURE");
  }
  if (!selfVerify()) throw new Error("ENGINE_VERIFY_FAIL");
  return assembleReceipt(results, ENGINE_ID);
};
// NOTE: NO generic "verify" export allowed — consensus only

