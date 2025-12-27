import { Finding } from "@verifrax/core/src/contracts/finding.schema"

export interface CineLintNode {
  id: string
  execute(ctx: {
    artifactPath: string
    metadata: Record<string, unknown>
  }): Promise<Finding[]>
}
