import { MediaCapabilities } from "../artifacts/capabilities/media.cap"
import { NodeMeta } from "@verifrax/nodes/src/abi/node.meta"

export function matchCapabilities(
  artifact: MediaCapabilities,
  meta: NodeMeta
): boolean {
  if (!(meta as any).requires) return true
  return Object.entries((meta as any).requires).every(
    ([k, v]) => (artifact as any)[k] === v
  )
}
