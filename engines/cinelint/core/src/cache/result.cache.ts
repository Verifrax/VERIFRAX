const cache = new Map<string, any>()

export function getCached(key: string) {
  return cache.get(key)
}

export function setCached(key: string, value: any) {
  cache.set(key, value)
}
