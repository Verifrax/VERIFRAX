import { ConsensusResult } from "./result.consensus"

export function quorumAgree<T>(
  results: T[],
  min: number
): ConsensusResult<T> {
  const counts = new Map<string, number>()
  for (const r of results) {
    const k = JSON.stringify(r)
    counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  for (const [k, v] of counts) {
    if (v >= min) {
      return { quorum: v, agreed: true, result: JSON.parse(k) }
    }
  }
  return { quorum: results.length, agreed: false }
}

export function assertUniqueWorkers(ids: string[]) {
  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate worker identities detected")
  }
}

export function emitSlashing(worker: string, round: number) {
  return { worker, reason: "INVALID_SIGNATURE", round }
}
