import crypto from "node:crypto";
import { getDatabase } from "../db/database.js";
import { validateTitle } from "../validators/titleValidator.js";

/**
 * Maps a SQLite database row to the application Task data shape.
 * Converts integer `completed` (0 or 1) to a JavaScript boolean.
 *
 * @param {object | null | undefined} row
 * @returns {{ id: string, title: string, completed: boolean, createdAt: string, updatedAt: string } | null}
 */
function formatTask(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * Retrieves all tasks from the database, ordered by createdAt DESC.
 *
 * @returns {Array<{ id: string, title: string, completed: boolean, createdAt: string, updatedAt: string }>}
 */
export function getAllTasks() {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT id, title, completed, createdAt, updatedAt
    FROM tasks
    ORDER BY createdAt DESC
  `);
  const rows = stmt.all();
  return rows.map(formatTask);
}

/**
 * Retrieves a single task by its unique ID.
 * Returns null if the task does not exist or if the ID is invalid.
 *
 * @param {string} id
 * @returns {{ id: string, title: string, completed: boolean, createdAt: string, updatedAt: string } | null}
 */
export function getTaskById(id) {
  if (!id || typeof id !== "string") {
    return null;
  }
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT id, title, completed, createdAt, updatedAt
    FROM tasks
    WHERE id = ?
  `);
  const row = stmt.get(id);
  return formatTask(row);
}

/**
 * Creates a new task with the given title.
 * Validates the title using validateTitle (BR-3: trimmed, 1-200 chars).
 * Generates an id via crypto.randomUUID() and initializes completed to false.
 *
 * @param {string} title
 * @returns {{ id: string, title: string, completed: boolean, createdAt: string, updatedAt: string }}
 */
export function createTask(title) {
  const validation = validateTitle(title);
  if (!validation.valid) {
    const error = new Error(validation.error);
    error.reason = validation.reason;
    error.status = 400;
    throw error;
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO tasks (id, title, completed, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(id, validation.title, 0, now, now);

  return {
    id,
    title: validation.title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Updates a task by ID.
 * Supports updating title (validated if provided) and/or completed (boolean).
 * Sets updatedAt to the current ISO 8601 timestamp.
 * Returns the updated task object, or null if the task id does not exist.
 *
 * @param {string} id
 * @param {{ title?: string, completed?: boolean }} updates
 * @returns {{ id: string, title: string, completed: boolean, createdAt: string, updatedAt: string } | null}
 */
export function updateTask(id, updates = {}) {
  const existing = getTaskById(id);
  if (!existing) {
    return null;
  }

  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    const error = new Error("Updates must be a valid object");
    error.status = 400;
    error.reason = "invalid-payload";
    throw error;
  }

  const { title, completed } = updates;

  let newTitle = existing.title;
  if (title !== undefined) {
    const validation = validateTitle(title);
    if (!validation.valid) {
      const error = new Error(validation.error);
      error.reason = validation.reason;
      error.status = 400;
      throw error;
    }
    newTitle = validation.title;
  }

  let newCompleted = existing.completed;
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      const error = new Error("Field 'completed' must be a boolean");
      error.reason = "invalid-type";
      error.status = 400;
      throw error;
    }
    newCompleted = completed;
  }

  const updatedAt = new Date().toISOString();
  const db = getDatabase();
  const stmt = db.prepare(`
    UPDATE tasks
    SET title = ?, completed = ?, updatedAt = ?
    WHERE id = ?
  `);
  stmt.run(newTitle, newCompleted ? 1 : 0, updatedAt, existing.id);

  return {
    id: existing.id,
    title: newTitle,
    completed: newCompleted,
    createdAt: existing.createdAt,
    updatedAt,
  };
}

/**
 * Deletes a task by ID from the database.
 * Returns true if the task was found and deleted, false otherwise.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function deleteTask(id) {
  if (!id || typeof id !== "string") {
    return false;
  }
  const db = getDatabase();
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ?");
  const result = stmt.run(id);
  return result.changes > 0;
}

export default {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
