import { BftRound, BftPhase } from "./bft.round"
import { assertPbftTransition } from "./pbft.machine"

export function advance(round: BftRound, next: BftPhase) {
  assertPbftTransition(round.phase, next)
  round.phase = next
  return round
}
