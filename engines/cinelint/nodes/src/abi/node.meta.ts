export interface NodeMeta {
  id: string
  description: string
  cost: "cheap" | "medium" | "expensive"
  deterministic: boolean
}
