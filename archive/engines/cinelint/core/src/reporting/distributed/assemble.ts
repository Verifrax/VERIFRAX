import { aggregate } from "./aggregate";
import { WorkerResult } from "../../worker/result";

export const assembleReceipt = (results: WorkerResult[], engineId: string) => ({
  version: "v1" as const,
  root: aggregate([engineId, ...results.map(r => r.receipt)]),
  workers: results.map(r => r.workerId),
  signature: ""
});

