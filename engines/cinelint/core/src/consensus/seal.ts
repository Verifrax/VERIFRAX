import crypto from "crypto";

export const seal = (event: unknown) =>
  crypto.createHash("sha256").update(JSON.stringify(event)).digest("hex");

