import { GraphNode } from "./graph"

export async function runParallel(
  graph: GraphNode[],
  ctx: any,
  timeoutMs = 30000
) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await Promise.all(
      graph.map(async g => {
        const res = await g.node.execute(ctx)
        if (g.severityOverride) {
          res.forEach(r => (r.severity = g.severityOverride))
        }
        return res
      })
    )
  } finally {
    clearTimeout(timer)
  }
}
