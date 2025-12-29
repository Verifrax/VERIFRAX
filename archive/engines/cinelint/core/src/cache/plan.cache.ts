const planCache = new Set<string>()
export const hasPlan = (h: string) => planCache.has(h)
export const storePlan = (h: string) => planCache.add(h)
