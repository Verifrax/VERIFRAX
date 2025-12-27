import { Artifact } from "../../artifacts/artifact"

export interface RunContext {
  artifact: Artifact
  profileId: string
  startedAt: string
}
