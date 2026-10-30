import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  initDatabase,
  getDatabase,
  closeDatabase,
  SCHEMA_SQL,
} from '../src/db/database.js';

describe('SQLite Database Initialization & Schema', () => {
  let tempDir = null;

  beforeEach(() => {
    closeDatabase();
  });

  afterEach(() => {
    closeDatabase();
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it('initializes an in-memory database and establishes schema', () => {
    const db = initDatabase(':memory:');
    expect(db.open).toBe(true);

    // Verify tasks table existence
    const tableInfo = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'tasks'"
      )
      .get();
    expect(tableInfo).toBeDefined();
    expect(tableInfo.name).toBe('tasks');

    // Verify index existence
    const indexInfo = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'index' AND name = 'idx_tasks_createdAt'"
      )
      .get();
    expect(indexInfo).toBeDefined();
    expect(indexInfo.name).toBe('idx_tasks_createdAt');
  });

  it('tasks table has the correct column specifications', () => {
    const db = initDatabase(':memory:');
    const columns = db.prepare('PRAGMA table_info(tasks)').all();

    const columnNames = columns.map((col) => col.name);
    expect(columnNames).toEqual([
      'id',
      'title',
      'completed',
      'createdAt',
      'updatedAt',
    ]);

    const idCol = columns.find((c) => c.name === 'id');
    expect(idCol.pk).toBe(1);

    const titleCol = columns.find((c) => c.name === 'title');
    expect(titleCol.notnull).toBe(1);

    const completedCol = columns.find((c) => c.name === 'completed');
    expect(completedCol.dflt_value).toBe('0');
    expect(completedCol.notnull).toBe(1);
  });

  it('supports inserting and retrieving tasks conforming to the Task shape', () => {
    const db = initDatabase(':memory:');
    const now = new Date().toISOString();
    const task = {
      id: 'test-uuid-1',
      title: 'Test task',
      completed: 0,
      createdAt: now,
      updatedAt: now,
    };

    const insertStmt = db.prepare(`
      INSERT INTO tasks (id, title, completed, createdAt, updatedAt)
      VALUES (@id, @title, @completed, @createdAt, @updatedAt)
    `);
    insertStmt.run(task);

    const retrieved = db
      .prepare('SELECT * FROM tasks WHERE id = ?')
      .get('test-uuid-1');
    expect(retrieved).toEqual(task);
  });

  it('enforces primary key uniqueness on id', () => {
    const db = initDatabase(':memory:');
    const now = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO tasks (id, title, completed, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertStmt.run('duplicate-id', 'Task 1', 0, now, now);

    expect(() => {
      insertStmt.run('duplicate-id', 'Task 2', 0, now, now);
    }).toThrow(/UNIQUE constraint failed: tasks\.id/);
  });

  it('enforces NOT NULL constraint on required columns', () => {
    const db = initDatabase(':memory:');
    const now = new Date().toISOString();

    // title cannot be null
    expect(() => {
      db.prepare(
        'INSERT INTO tasks (id, title, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
      ).run('id-1', null, 0, now, now);
    }).toThrow(/NOT NULL constraint failed/);

    // createdAt cannot be null
    expect(() => {
      db.prepare(
        'INSERT INTO tasks (id, title, completed, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
      ).run('id-2', 'Valid Title', 0, null, now);
    }).toThrow(/NOT NULL constraint failed/);
  });

  it('creates directory and enables WAL mode on disk-based database', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-db-test-'));
    const dbPath = path.join(tempDir, 'subfolder', 'test.db');

    const db = initDatabase(dbPath);
    expect(fs.existsSync(dbPath)).toBe(true);

    const journalMode = db.pragma('journal_mode', { simple: true });
    expect(journalMode.toLowerCase()).toBe('wal');
  });

  it('getDatabase returns active connection or initializes default', () => {
    const db1 = initDatabase(':memory:');
    const db2 = getDatabase();
    expect(db2).toBe(db1);

    closeDatabase();
    // After closing, getDatabase should reinitialize
    const db3 = getDatabase();
    expect(db3).toBeDefined();
    expect(db3.open).toBe(true);
    closeDatabase();
  });

  it('re-initialization closes previous open database', () => {
    const db1 = initDatabase(':memory:');
    expect(db1.open).toBe(true);

    const db2 = initDatabase(':memory:');
    expect(db1.open).toBe(false);
    expect(db2.open).toBe(true);
  });

  it('closeDatabase safely closes active db and handles multiple calls', () => {
    const db = initDatabase(':memory:');
    expect(db.open).toBe(true);

    closeDatabase();
    expect(db.open).toBe(false);

    // Subsequent call should be a no-op without error
    expect(() => closeDatabase()).not.toThrow();
  });

  it('exports SCHEMA_SQL containing valid SQL statements', () => {
    expect(SCHEMA_SQL).toContain('CREATE TABLE IF NOT EXISTS tasks');
    expect(SCHEMA_SQL).toContain('CREATE INDEX IF NOT EXISTS idx_tasks_createdAt');
  });
});
