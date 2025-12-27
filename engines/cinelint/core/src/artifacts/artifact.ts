export interface Artifact {
  id: string
  path: string
  type: "file" | "directory"
  size?: number
  checksum?: string
}
