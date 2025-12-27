import { Profile } from "./profile.schema"
import fs from "fs"

export function loadProfile(path: string): Profile {
  return JSON.parse(fs.readFileSync(path, "utf-8"))
}
