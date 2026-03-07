import initSqlJs from 'sql.js';
import fs from 'fs';

const SQL = await initSqlJs();
const dbFile = 'wedding.db';

let db;

// Load hoặc tạo database
if (fs.existsSync(dbFile)) {
  const buffer = fs.readFileSync(dbFile);
  db = new SQL.Database(buffer);
} else {
  db = new SQL.Database();
}

// Tạo bảng
db.run(`
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

// Tạo index để check duplicate
db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_name_phone 
  ON rsvp(name, COALESCE(phone, ''))
`);

// Helper để save database
export function saveDatabase() {
  const data = db.export();
  fs.writeFileSync(dbFile, data);
}

// Helper để execute query
export function prepare(sql) {
  return {
    run: (...params) => {
      try {
        db.run(sql, params);
        saveDatabase();
        return { lastInsertRowid: db.exec('SELECT last_insert_rowid()')[0].values[0][0] };
      } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
          const err = new Error('UNIQUE constraint failed');
          err.code = 'SQLITE_CONSTRAINT_UNIQUE';
          throw err;
        }
        throw error;
      }
    },
    all: (...params) => {
      const result = db.exec(sql, params);
      if (result.length === 0) return [];
      
      const columns = result[0].columns;
      const values = result[0].values;
      
      return values.map(row => {
        const obj = {};
        columns.forEach((col, idx) => {
          obj[col] = row[idx];
        });
        return obj;
      });
    }
  };
}

export default db;
