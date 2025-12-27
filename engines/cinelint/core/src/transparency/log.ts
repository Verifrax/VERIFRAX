const log: any[] = []

export function append(entry: any) {
  log.push({ entry, ts: new Date().toISOString() })
}

export function read() {
  return log
}
