import { createHash } from "node:crypto";
import * as fs from "node:fs";

export type Entry = { path: string; sha256: string };

export function sha256(x: Buffer|string) {
  return createHash("sha256").update(x).digest("hex");
}

export function manifestHash(entries: Entry[]) {
  return sha256(JSON.stringify(entries));
}

// simple merkle (pairwise hash)
export function merkleRoot(leaves: string[]) {
  if (leaves.length === 0) return sha256("");
  let level = leaves.slice().map(x => sha256(x));
  while (level.length > 1) {
    const next: string[] = [];
    for (let i=0; i<level.length; i+=2) {
      const a = level[i];
      const b = level[i+1] ?? level[i];
      next.push(sha256(a + b));
    }
    level = next;
  }
  return level[0];
}

export function readManifest(p: string): Entry[] {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

