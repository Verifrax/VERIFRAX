import { seal } from "./seal";

let lastSeal: string | null = null;
const log: unknown[] = [];

export const audit = (entry: unknown) => {
  const entryObj = entry as Record<string, any>;
  const chained = {
    domain: entryObj.domain ?? "LOCAL",
    ...entryObj,
    prev: lastSeal
  };
  const sealed = Object.freeze({ ...chained, seal: seal(chained) });
  lastSeal = sealed.seal;
  log.push(sealed);
  return log.length;
};

