import { seal } from "./seal";

let lastSeal: string | null = null;
const log: unknown[] = [];

export const audit = (entry: unknown) => {
  const chained = {
    domain: entry.domain ?? "LOCAL",
    ...entry,
    prev: lastSeal
  };
  const sealed = Object.freeze({ ...chained, seal: seal(chained) });
  lastSeal = sealed.seal;
  log.push(sealed);
  return log.length;
};

