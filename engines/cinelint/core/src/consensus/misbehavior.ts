export interface MisbehaviorReceipt {
  workerId: string;
  reason: "DOUBLE_VOTE" | "INVALID_SIGNATURE" | "TIMEOUT";
  evidence: string;
}

