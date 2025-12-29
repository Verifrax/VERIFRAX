export type EngineState =
  | "IDLE"
  | "PLANNED"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED"

export function assertTransition(from: EngineState, to: EngineState) {
  const allowed: Record<EngineState, EngineState[]> = {
    IDLE: ["PLANNED"],
    PLANNED: ["RUNNING"],
    RUNNING: ["COMPLETED", "FAILED"],
    COMPLETED: [],
    FAILED: []
  }
  if (!allowed[from].includes(to)) {
    throw new Error(`Illegal transition ${from} → ${to}`)
  }
}

export function assertQuorum(ok: boolean) {
  if (!ok) throw new Error("Quorum not reached")
}

export function fatal(reason: string): never {
  throw new Error(`ENGINE_FATAL: ${reason}`)
}
