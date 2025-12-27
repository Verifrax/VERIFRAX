type Database = any; // Optional dependency: better-sqlite3
let db: Database | null = null;

async function initDb() {
  if (db) return db;
  try {
    const Database = (await import("better-sqlite3") as any).default;
    db = new Database(".verifrax-cache.db");
    db.exec(`
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY,
        value TEXT,
        createdAt TEXT
      )
    `);
    return db;
  } catch {
    return null;
  }
}

export async function getCache(key: string) {
  const database = await initDb();
  if (!database) return null;
  return database.prepare("SELECT value FROM cache WHERE key=?").get(key);
}

export async function setCache(key: string, value: string) {
  const database = await initDb();
  if (!database) return;
  database.prepare(
    "INSERT OR REPLACE INTO cache (key,value,createdAt) VALUES (?,?,?)"
  ).run(key, value, new Date().toISOString());
}
