import { createHash } from "node:crypto";

export const checkpoint = (state: unknown) =>
  createHash("sha256").update(JSON.stringify(state)).digest("hex");

