import { createHash } from "crypto";
import fs from "fs";

export function sha256File(p: string) {
  return createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

