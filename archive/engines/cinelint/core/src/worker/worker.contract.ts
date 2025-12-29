import { ExecutionPlan } from "../runtime/plan/execution.plan"

export interface WorkerJob {
  plan: ExecutionPlan
  artifactPath: string
}

export interface WorkerResult {
  planId: string
  status: "PASS" | "FAIL"
  findings: unknown[]
}
