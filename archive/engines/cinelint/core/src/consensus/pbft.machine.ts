import { BftPhase } from "./bft.round"

const allowed: Record<BftPhase, BftPhase[]> = {
  PREPARE: ["PRECOMMIT"],
  PRECOMMIT: ["COMMIT"],
  COMMIT: []
}

export function assertPbftTransition(from: BftPhase, to: BftPhase) {
  if (!allowed[from].includes(to)) {
    throw new Error(`Illegal PBFT transition ${from} → ${to}`)
  }
}
