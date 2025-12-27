import Database from "better-sqlite3"

const db = new Database(".verifrax-cache.db")
db.exec(`
  CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    value TEXT,
    createdAt TEXT
  )
`)

export function getCache(key: string) {
  return db.prepare("SELECT value FROM cache WHERE key=?").get(key)
}

export function setCache(key: string, value: string) {
  db.prepare(
    "INSERT OR REPLACE INTO cache (key,value,createdAt) VALUES (?,?,?)"
  ).run(key, value, new Date().toISOString())
}
