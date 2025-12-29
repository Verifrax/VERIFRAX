export function enforceZeroTrust(signed: boolean) {
  if (!signed) {
    throw new Error("Zero-trust violation: unsigned node blocked")
  }
}
