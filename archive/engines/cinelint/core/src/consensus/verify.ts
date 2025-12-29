export const verifyConsensus = (agree: number, total: number) =>
  agree >= Math.floor((2 * total) / 3) + 1;

export const verifyFederatedConsensus = (
  engines: string[],
  signers: string[]
) => verifyConsensus(signers.length, engines.length);

export const verifyWorkerSet = (ids: string[]) =>
  new Set(ids).size === ids.length;
