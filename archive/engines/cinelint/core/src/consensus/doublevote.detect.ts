import { SlashingEvidence } from "./slashing"

export function detectDoubleVote(
  worker: string,
  votes: string[],
  round: number
): SlashingEvidence | null {
  const uniq = new Set(votes)
  if (uniq.size !== votes.length) {
    return { worker, reason: "DOUBLE_VOTE", round }
  }
  return null
}
