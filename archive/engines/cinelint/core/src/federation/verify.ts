import { verifyThresholdSignature } from "../crypto/threshold.verify";
import { verifyFederatedConsensus } from "../consensus/verify";
import { aggregateFederatedReceipt } from "./aggregate";
import { FederatedResult } from "./result";
import { totalStake } from "./stake";
import { snapshotStake } from "./stake.snapshot";

export const verifyFederated = (
  results: FederatedResult[],
  sig: any,
  pubkeys: Record<string, string>
) => {
  const engines = results.map(r => r.engineId);

  if (!verifyFederatedConsensus(engines, sig.signers))
    throw new Error("NO_FEDERATED_QUORUM");

  const payload =
    "CINELINT_FEDERATED_CONSENSUS_V1::" +
    aggregateFederatedReceipt(
      results.sort((a, b) => a.engineId.localeCompare(b.engineId))
    );

  if (!verifyThresholdSignature(payload, sig, pubkeys))
    throw new Error("INVALID_FEDERATED_SIGNATURE");

  return payload;
};

export const verifyWeightedFederation = (
  stakes: { engineId: string; weight: number }[],
  signers: string[]
) => {
  const snapshot = snapshotStake(stakes);
  const signed = stakes.filter(s => signers.includes(s.engineId));
  if (totalStake(signed) < (2 / 3) * totalStake(stakes)) return false;
  return snapshot;
};

