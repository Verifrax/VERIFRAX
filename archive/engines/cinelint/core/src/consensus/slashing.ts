export interface SlashingEvidence {
  worker: string
  reason: "DOUBLE_VOTE" | "INVALID_SIGNATURE" | "TIMEOUT"
  round: number
}
