export interface ConsensusResult<T> {
  quorum: number
  agreed: boolean
  result?: T
}
