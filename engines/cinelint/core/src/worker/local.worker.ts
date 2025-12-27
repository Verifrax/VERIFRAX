import { WorkerJob, WorkerResult } from "./worker.contract"

export async function runWorker(job: WorkerJob): Promise<WorkerResult> {
  return {
    planId: job.plan.planId,
    status: "PASS",
    findings: []
  }
}
