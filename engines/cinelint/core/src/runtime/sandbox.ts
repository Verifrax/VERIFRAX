export async function safeExecute<T>(
  fn: () => Promise<T>,
  nodeId: string
): Promise<T | { error: string; node: string }> {
  try {
    return await fn()
  } catch (e: any) {
    return {
      error: e?.message ?? String(e),
      node: nodeId
    }
  }
}
