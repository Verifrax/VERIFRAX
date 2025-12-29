export interface ConsensusAuditEvent {
  round: number
  worker: string
  action: string
  ts: number
}

const audit: ConsensusAuditEvent[] = []

export function record(e: ConsensusAuditEvent) {
  audit.push(e)
}
