import { MisbehaviorReceipt } from "./misbehavior";
import { audit } from "./audit";

let slashes = 0;
export const slash = (r: MisbehaviorReceipt) => {
  slashes++;
  if (slashes > 1) process.exit(1);
  audit({ type: "MISBEHAVIOR", ...r });
  return {
    ...r,
    slashedAt: new Date().toISOString()
  };
};

