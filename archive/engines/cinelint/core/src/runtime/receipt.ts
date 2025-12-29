import { checkpoint } from "./checkpoint";
import { prove } from "../zk/prove";

export const receipt = (state: unknown) => {
  const hash = checkpoint(state);
  return prove(hash);
};

