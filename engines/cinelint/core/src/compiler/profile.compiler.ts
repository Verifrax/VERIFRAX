import { buildGraph } from "../runtime/graph"

export function compileProfile(profile: any, nodes: any[]) {
  return buildGraph(nodes, profile)
}
