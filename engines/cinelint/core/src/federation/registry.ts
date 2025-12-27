import { FederatedEngine } from "./engine";

const engines = new Map<string, FederatedEngine>();

export const registerEngine = (e: FederatedEngine) => {
  if (engines.has(e.engineId)) throw new Error("DUPLICATE_ENGINE_ID");
  engines.set(e.engineId, Object.freeze(e));
};

export const listEngines = () => [...engines.values()];

