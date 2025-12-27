export const deriveSeed = (nonce: string, plan: string) =>
  `${nonce}:${plan}`
