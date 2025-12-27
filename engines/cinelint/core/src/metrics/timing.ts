export function timed<T>(label: string, fn: () => Promise<T>) {
  const start = performance.now()
  return fn().then(res => {
    const end = performance.now()
    return { result: res, ms: Math.round(end - start), label }
  })
}
