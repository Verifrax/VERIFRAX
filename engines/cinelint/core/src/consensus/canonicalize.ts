export const canonicalize = (obj: unknown): string =>
  JSON.stringify(obj, Object.keys(obj as any).sort());

