export interface ThresholdSignature {
  signer: string
  signature: string
}

export interface ThresholdResult<T> {
  result: T
  signatures: ThresholdSignature[]
}
