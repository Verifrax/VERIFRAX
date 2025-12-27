import fs from "fs";
import path from "path";

export function loadProfile(profilePath: string) {
  const raw = fs.readFileSync(profilePath, "utf-8");
  return JSON.parse(raw);
}





