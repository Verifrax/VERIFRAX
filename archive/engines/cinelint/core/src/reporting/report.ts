import { RunResult } from "../contracts/run.contract"

export function normalize(result: RunResult) {
  return {
    ...result,
    findings: result.findings.sort(
      (a: any, b: any) => a.severity.localeCompare(b.severity)
    )
  }
}
