import { CineLintNode } from "../engine/node.interface.js";

const registry = new Map<string, CineLintNode>();

export function registerNode(node: CineLintNode) {
  registry.set(node.id, node);
}

export function getNode(id: string): CineLintNode | undefined {
  return registry.get(id);
}

export function listNodes(): CineLintNode[] {
  return Array.from(registry.values());
}


