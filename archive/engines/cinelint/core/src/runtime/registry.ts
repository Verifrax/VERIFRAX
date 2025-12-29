import { CineLintNode } from "@verifrax/nodes"

export class NodeRegistry {
  private nodes = new Map<string, CineLintNode>()

  register(node: CineLintNode) {
    if (this.nodes.has(node.id)) {
      throw new Error(`Node already registered: ${node.id}`)
    }
    this.nodes.set(node.id, node)
  }

  list(): CineLintNode[] {
    return [...this.nodes.values()]
  }
}
