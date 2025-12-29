import { WorkerIdentity } from "../worker/identity";

export const registry = new Map<string, WorkerIdentity>();

export const registerWorker = (w: WorkerIdentity) => {
  registry.set(w.id, w);
};

