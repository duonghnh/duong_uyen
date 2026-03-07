import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = process.cwd();
const dbPath = path.join(dbDir, 'wedding.db');

let db = null;

function getDb() {
  if (db) return db;
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS rsvp (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      attending TEXT NOT NULL,
      transport TEXT,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_name_phone
    ON rsvp(name, COALESCE(phone, ''))
  `);

  return db;
}

export function prepare(sql) {
  const database = getDb();
  return {
    run: (...params) => {
      try {
        const stmt = database.prepare(sql);
        const info = stmt.run(...params);
        return { lastInsertRowid: info.lastInsertRowid };
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          const err = new Error('UNIQUE constraint failed');
          err.code = 'SQLITE_CONSTRAINT_UNIQUE';
          throw err;
        }
        throw error;
      }
    },
    all: (...params) => {
      const stmt = database.prepare(sql);
      return params.length ? stmt.all(...params) : stmt.all();
    },
  };
}

export default getDb;
