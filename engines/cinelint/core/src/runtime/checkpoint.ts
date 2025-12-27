export const checkpoint = (state: unknown) =>
  crypto.createHash("sha256").update(JSON.stringify(state)).digest("hex");

