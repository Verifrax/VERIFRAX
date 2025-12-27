export function assertDeadline(start: number, maxMs: number) {
  if (Date.now() - start > maxMs) {
    throw new Error("Execution SLA exceeded")
  }
}
