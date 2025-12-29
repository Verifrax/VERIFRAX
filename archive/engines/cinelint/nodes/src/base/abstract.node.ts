import { CineLintNode, NodeContext, NodeResult } from "../abi/node.abi"

export abstract class AbstractNode implements CineLintNode {
  abstract id: string
  abstract execute(ctx: NodeContext): Promise<NodeResult[]>
}
