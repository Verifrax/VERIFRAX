import * as crypto from "node:crypto"
import { ExecutionPlan } from "./execution.plan"

export function hashPlan(plan: ExecutionPlan): string {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(plan))
    .digest("hex")
}
