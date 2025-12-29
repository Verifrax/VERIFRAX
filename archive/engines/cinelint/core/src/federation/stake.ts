export interface EngineStake {
  engineId: string;
  weight: number;
}

export const totalStake = (s: EngineStake[]) =>
  s.reduce((a, b) => a + b.weight, 0);

