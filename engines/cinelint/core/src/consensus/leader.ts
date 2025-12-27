export function selectLeader(workers: string[], round: number): string {
  return workers[round % workers.length]
}
