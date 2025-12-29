export const HARDWARE_VERDICT = ["HARDWARE_TRUSTED"] as const;
export type HardwareVerdict = typeof HARDWARE_VERDICT[number];

export const verifyHardware = (): HardwareVerdict => {
  throw new Error("NO_TRUSTED_HARDWARE_ATTESTATION");
};
