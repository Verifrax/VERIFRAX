export const TRUSTED_ISSUERS = new Set<string>()
export const trust = (id: string) => TRUSTED_ISSUERS.add(id)
export const isTrusted = (id: string) => TRUSTED_ISSUERS.has(id)
