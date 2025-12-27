export type Strictness = "soft" | "hard" | "fail-fast"

export interface ProfileNode {
  id: string
  severityOverride?: "INFO" | "WARN" | "ERROR"
}

export interface Profile {
  id: string
  strictness: Strictness
  nodes: ProfileNode[]
}
