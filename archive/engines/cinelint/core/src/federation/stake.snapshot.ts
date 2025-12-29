import * as crypto from "node:crypto";
import { EngineStake } from "./stake";

export const snapshotStake = (stakes: EngineStake[]) =>
  crypto
    .createHash("sha256")
    .update(
      stakes
        .sort((a, b) => a.engineId.localeCompare(b.engineId))
        .map(s => `${s.engineId}:${s.weight}`)
        .join("|")
    )
    .digest("hex");

