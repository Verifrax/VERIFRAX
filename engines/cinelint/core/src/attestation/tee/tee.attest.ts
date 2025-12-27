export interface TeeAttestation {
  enclaveHash: string
  vendor: "SGX" | "SEV" | "TDX"
}
