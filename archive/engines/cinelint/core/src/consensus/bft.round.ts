export type BftPhase = "PREPARE" | "PRECOMMIT" | "COMMIT"

export interface BftRound<T> {
  round: number
  phase: BftPhase
  proposal: T
  votes: Record<string, string>
}
