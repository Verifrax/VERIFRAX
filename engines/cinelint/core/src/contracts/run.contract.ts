export type RunInput = {
  artifactPath: string
  profileId?: string
  profilePath?: string
  strict: boolean
}

export type RunResult = {
  runId: string
  status: "PASS" | "FAIL"
  findings: unknown[]
  startedAt: string
  finishedAt: string
}

export interface Engine {
  run(input: RunInput): Promise<RunResult>
}
