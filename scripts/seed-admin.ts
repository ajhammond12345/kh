import Database from 'better-sqlite3'
import argon2 from 'argon2'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '../packages/backend/data/kh.db')

async function main() {
  const username = process.argv[2] || 'admin'
  const password = process.argv[3] || 'admin'

  const sqlite = new Database(DB_PATH)
  sqlite.pragma('journal_mode = WAL')

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
  `)

  const hash = await argon2.hash(password)

  sqlite.prepare(`
    INSERT OR REPLACE INTO users (username, password_hash) VALUES (?, ?)
  `).run(username, hash)

  console.log(`Admin user '${username}' created/updated.`)
  console.log(`Login at /admin/login`)
  sqlite.close()
}

main().catch(console.error)
