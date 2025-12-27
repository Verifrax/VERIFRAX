import { GraphNode } from "./graph"

export async function executeDAG(
  graph: GraphNode[],
  exec: (g: GraphNode) => Promise<any>
) {
  const completed = new Set<string>()
  const results: any[] = []

  while (completed.size < graph.length) {
    const ready = graph.filter(
      g =>
        !completed.has(g.node.id) &&
        (g.dependsOn ?? []).every(d => completed.has(d))
    )

    if (!ready.length) throw new Error("Cyclic dependency detected")

    const batch = await Promise.all(ready.map(exec))
    ready.forEach(g => completed.add(g.node.id))
    results.push(...batch)
  }

  return results
}
