import { createHash } from "node:crypto";
import * as fs from "node:fs";

export function sha256File(p: string) {
  return createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

