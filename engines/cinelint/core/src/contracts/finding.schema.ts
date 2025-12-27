export type Severity = "INFO" | "WARN" | "ERROR"

export interface Finding {
  node: string
  severity: Severity
  code: string
  message: string
  evidence?: Record<string, unknown>
}
