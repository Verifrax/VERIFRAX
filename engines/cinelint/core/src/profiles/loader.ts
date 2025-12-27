import { Profile } from "./profile.schema"
import * as fs from "node:fs"

export function loadProfile(path: string): Profile {
  return JSON.parse(fs.readFileSync(path, "utf-8"))
}
