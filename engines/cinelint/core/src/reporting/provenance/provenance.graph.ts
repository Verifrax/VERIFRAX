export interface ProvenanceEdge {
  from: string
  to: string
  timestamp: string
}

export interface ProvenanceGraph {
  runId: string
  edges: ProvenanceEdge[]
}
