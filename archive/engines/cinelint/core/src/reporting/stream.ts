export type StreamEvent =
  | { type: "node:start"; node: string }
  | { type: "node:end"; node: string }
  | { type: "finding"; payload: any }

export function emit(e: StreamEvent) {
  process.stdout.write(JSON.stringify(e) + "\n")
}

export type LifecycleEvent =
  | { type: "run:start"; plan: string }
  | { type: "run:end"; status: "PASS" | "FAIL" }
