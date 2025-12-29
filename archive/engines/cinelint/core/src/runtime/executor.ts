import { NodeRegistry } from "./registry"
import { RunInput, RunResult } from "../contracts/run.contract"
import { loadProfile } from "../profiles/loader"
import { buildExecutionGraph } from "./graph"
import { safeExecute } from "./sandbox"

export class Executor {
  constructor(private registry: NodeRegistry) {}

  async execute(input: RunInput): Promise<RunResult> {
    if (!input.profilePath) {
      throw new Error("profilePath is required")
    }
    const profile = loadProfile(input.profilePath)
    const graph = buildExecutionGraph(this.registry.list(), profile)

    const findings: any[] = []

    if (profile.strictness === "fail-fast") {
      for (const g of graph) {
        const result = await safeExecute(
          async () => {
            const res = await g.node.execute({
              artifactPath: input.artifactPath,
              metadata: {}
            })
            if (g.severityOverride) {
              res.forEach((r: any) => (r.severity = g.severityOverride))
            }
            return res
          },
          g.node.id
        )

        if (Array.isArray(result)) {
          findings.push(...result)
          if (result.some((f: any) => f.severity === "ERROR")) {
            break
          }
        } else {
          findings.push({
            node: (result as any).node,
            severity: "ERROR",
            code: "NODE_CRASH",
            message: (result as any).error
          })
          break
        }
      }
    } else {
      const results = await Promise.all(
        graph.map(g =>
          safeExecute(
            async () => {
              const res = await g.node.execute({
                artifactPath: input.artifactPath,
                metadata: {}
              })
              if (g.severityOverride) {
                res.forEach((r: any) => (r.severity = g.severityOverride))
              }
              return res
            },
            g.node.id
          )
        )
      )

      findings.push(
        ...results.flatMap((r: any) =>
          Array.isArray(r)
            ? r
            : [
                {
                  node: r.node,
                  severity: "ERROR",
                  code: "NODE_CRASH",
                  message: r.error
                }
              ]
        )
      )
    }

    return {
      runId: crypto.randomUUID ? crypto.randomUUID() : "stub-uuid",
      status: findings.some(f => f.severity === "ERROR") ? "FAIL" : "PASS",
      findings,
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString()
    }
  }
}
