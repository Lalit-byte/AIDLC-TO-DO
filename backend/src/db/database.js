import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_DB_PATH = path.resolve(__dirname, '../../data/todo.db');

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tasks_createdAt ON tasks(createdAt DESC);
`;

let activeDb = null;

/**
 * Initializes the SQLite database, executes migrations/schema, and configures pragmas.
 * @param {string} [customPath] - Path to SQLite database file or ':memory:'.
 * @returns {import('better-sqlite3').Database}
 */
export function initDatabase(customPath) {
  if (activeDb && activeDb.open) {
    activeDb.close();
    activeDb = null;
  }

  const dbPath = customPath || process.env.DB_PATH || DEFAULT_DB_PATH;

  if (dbPath !== ':memory:') {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  const db = new Database(dbPath);

  // Enable WAL mode for persistent databases to improve write concurrency
  if (dbPath !== ':memory:') {
    db.pragma('journal_mode = WAL');
  }

  // Enforce foreign key constraints
  db.pragma('foreign_keys = ON');

  // Initialize schema
  db.exec(SCHEMA_SQL);

  activeDb = db;
  return db;
}

/**
 * Retrieves the current active database connection, initializing default if needed.
 * @returns {import('better-sqlite3').Database}
 */
export function getDatabase() {
  if (!activeDb || !activeDb.open) {
    return initDatabase();
  }
  return activeDb;
}

/**
 * Closes the active database connection if open.
 */
export function closeDatabase() {
  if (activeDb && activeDb.open) {
    activeDb.close();
  }
  activeDb = null;
}
