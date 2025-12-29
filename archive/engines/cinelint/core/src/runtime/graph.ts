import { CineLintNode } from "@verifrax/nodes"

export interface GraphNode {
  node: CineLintNode
  dependsOn?: string[]
  severityOverride?: "INFO" | "WARN" | "ERROR"
}

export function buildGraph(
  nodes: CineLintNode[],
  profile: any
): GraphNode[] {
  return profile.nodes.map((p: any) => {
    const node = nodes.find(n => n.id === p.id)
    if (!node) throw new Error(`Node not found: ${p.id}`)
    return {
      node,
      dependsOn: p.dependsOn,
      severityOverride: p.severityOverride
    }
  })
}

export const buildExecutionGraph = buildGraph;
