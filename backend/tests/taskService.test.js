import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  initDatabase,
  closeDatabase,
  getDatabase,
} from "../src/db/database.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../src/services/taskService.js";
import taskService from "../src/services/taskService.js";

describe("taskService (Data Access Layer CRUD)", () => {
  beforeEach(() => {
    initDatabase(":memory:");
  });

  afterEach(() => {
    closeDatabase();
  });

  describe("module exports", () => {
    it("provides both named exports and default export with identical functions", () => {
      expect(taskService.getAllTasks).toBe(getAllTasks);
      expect(taskService.getTaskById).toBe(getTaskById);
      expect(taskService.createTask).toBe(createTask);
      expect(taskService.updateTask).toBe(updateTask);
      expect(taskService.deleteTask).toBe(deleteTask);
    });
  });

  describe("createTask", () => {
    it("creates a task with valid title and returns correct Task shape", () => {
      const task = createTask("Buy groceries");

      expect(task).toBeDefined();
      expect(typeof task.id).toBe("string");
      expect(task.id.length).toBeGreaterThan(0);
      expect(task.title).toBe("Buy groceries");
      expect(task.completed).toBe(false);
      expect(typeof task.createdAt).toBe("string");
      expect(typeof task.updatedAt).toBe("string");
      expect(Number.isNaN(Date.parse(task.createdAt))).toBe(false);
      expect(task.createdAt).toBe(task.updatedAt);
    });

    it("trims leading and trailing whitespace from title", () => {
      const task = createTask("   Trimmed Task Title   ");
      expect(task.title).toBe("Trimmed Task Title");

      const retrieved = getTaskById(task.id);
      expect(retrieved.title).toBe("Trimmed Task Title");
    });

    it("persists created task in the database", () => {
      const created = createTask("Persisted Task");
      const retrieved = getTaskById(created.id);

      expect(retrieved).toEqual(created);
    });

    it("throws 400 error when title is empty or only whitespace", () => {
      expect(() => createTask("")).toThrowError(/Title cannot be empty/);
      try {
        createTask("");
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("empty");
      }

      expect(() => createTask("   \t\n   ")).toThrowError(
        /Title cannot be empty/,
      );
      try {
        createTask("   \t\n   ");
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("empty");
      }
    });

    it("throws 400 error when title is not a string", () => {
      expect(() => createTask(null)).toThrowError(
        /Title is required and must be a string/,
      );
      try {
        createTask(null);
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("empty");
      }

      expect(() => createTask(undefined)).toThrowError(/Title is required/);
      expect(() => createTask(12345)).toThrowError(/Title is required/);
      expect(() => createTask({ title: "foo" })).toThrowError(
        /Title is required/,
      );
    });

    it("throws 400 error when title exceeds 200 visible characters", () => {
      const longTitle = "a".repeat(201);
      expect(() => createTask(longTitle)).toThrowError(
        /Title cannot exceed 200 characters/,
      );
      try {
        createTask(longTitle);
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("too-long");
      }
    });

    it("accepts title with exactly 200 characters", () => {
      const maxTitle = "x".repeat(200);
      const task = createTask(maxTitle);
      expect(task.title).toBe(maxTitle);
    });
  });

  describe("getTaskById", () => {
    it("returns null when id does not exist", () => {
      const task = getTaskById("non-existent-uuid");
      expect(task).toBeNull();
    });

    it("returns null for invalid id arguments", () => {
      expect(getTaskById(null)).toBeNull();
      expect(getTaskById(undefined)).toBeNull();
      expect(getTaskById("")).toBeNull();
      expect(getTaskById(123)).toBeNull();
      expect(getTaskById({})).toBeNull();
    });

    it("returns existing task with boolean completed = false", () => {
      const created = createTask("Task 1");
      const retrieved = getTaskById(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.title).toBe("Task 1");
      expect(retrieved.completed).toBe(false);
      expect(retrieved.createdAt).toBe(created.createdAt);
      expect(retrieved.updatedAt).toBe(created.updatedAt);
    });

    it("returns existing task with boolean completed = true", () => {
      const created = createTask("Task 2");
      updateTask(created.id, { completed: true });

      const retrieved = getTaskById(created.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved.completed).toBe(true);
    });
  });

  describe("getAllTasks", () => {
    it("returns empty array when database has no tasks", () => {
      const tasks = getAllTasks();
      expect(tasks).toEqual([]);
    });

    it("returns tasks ordered by createdAt DESC", async () => {
      // Insert tasks with explicit distinct createdAt timestamps to verify sorting
      const db = getDatabase();
      const t1 = {
        id: "id-1",
        title: "First Created",
        completed: 0,
        createdAt: "2026-01-01T10:00:00.000Z",
        updatedAt: "2026-01-01T10:00:00.000Z",
      };
      const t2 = {
        id: "id-2",
        title: "Second Created",
        completed: 1,
        createdAt: "2026-01-01T11:00:00.000Z",
        updatedAt: "2026-01-01T11:00:00.000Z",
      };
      const t3 = {
        id: "id-3",
        title: "Third Created",
        completed: 0,
        createdAt: "2026-01-01T12:00:00.000Z",
        updatedAt: "2026-01-01T12:00:00.000Z",
      };

      const insertStmt = db.prepare(`
        INSERT INTO tasks (id, title, completed, createdAt, updatedAt)
        VALUES (@id, @title, @completed, @createdAt, @updatedAt)
      `);
      insertStmt.run(t1);
      insertStmt.run(t2);
      insertStmt.run(t3);

      const tasks = getAllTasks();
      expect(tasks).toHaveLength(3);
      expect(tasks.map((t) => t.id)).toEqual(["id-3", "id-2", "id-1"]);
      expect(tasks[1].completed).toBe(true);
      expect(tasks[0].completed).toBe(false);
      expect(tasks[2].completed).toBe(false);
    });

    it("returns tasks with the exact shape required", () => {
      createTask("Task Shape Check");
      const [task] = getAllTasks();

      expect(Object.keys(task).sort()).toEqual([
        "completed",
        "createdAt",
        "id",
        "title",
        "updatedAt",
      ]);
      expect(typeof task.completed).toBe("boolean");
    });
  });

  describe("updateTask", () => {
    it("returns null if task does not exist", () => {
      const result = updateTask("non-existent-uuid", { title: "Updated" });
      expect(result).toBeNull();
    });

    it("returns null if id is missing or not a string", () => {
      expect(updateTask(null, { title: "Updated" })).toBeNull();
      expect(updateTask(undefined, { title: "Updated" })).toBeNull();
      expect(updateTask("", { title: "Updated" })).toBeNull();
      expect(updateTask(1234, { title: "Updated" })).toBeNull();
    });

    it("throws 400 error if updates argument is not an object or is an array", () => {
      const task = createTask("Base Task");

      expect(() => updateTask(task.id, null)).toThrow(
        /Updates must be a valid object/,
      );
      try {
        updateTask(task.id, null);
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("invalid-payload");
      }

      expect(() => updateTask(task.id, "string")).toThrow(
        /Updates must be a valid object/,
      );
      expect(() => updateTask(task.id, [1, 2, 3])).toThrow(
        /Updates must be a valid object/,
      );
    });

    it("updates only title and leaves completed intact", async () => {
      const task = createTask("Original Title");
      // small delay to guarantee different updatedAt ISO timestamp
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updated = updateTask(task.id, { title: "Updated Title" });

      expect(updated.id).toBe(task.id);
      expect(updated.title).toBe("Updated Title");
      expect(updated.completed).toBe(false);
      expect(updated.createdAt).toBe(task.createdAt);
      expect(updated.updatedAt > task.updatedAt).toBe(true);

      const fromDb = getTaskById(task.id);
      expect(fromDb.title).toBe("Updated Title");
      expect(fromDb.completed).toBe(false);
    });

    it("trims whitespace when updating title", () => {
      const task = createTask("Original Title");
      const updated = updateTask(task.id, { title: "   Spaced New Title   " });

      expect(updated.title).toBe("Spaced New Title");
      const fromDb = getTaskById(task.id);
      expect(fromDb.title).toBe("Spaced New Title");
    });

    it("updates only completed (true) and leaves title intact", () => {
      const task = createTask("Task To Complete");
      const updated = updateTask(task.id, { completed: true });

      expect(updated.id).toBe(task.id);
      expect(updated.title).toBe("Task To Complete");
      expect(updated.completed).toBe(true);

      const fromDb = getTaskById(task.id);
      expect(fromDb.completed).toBe(true);
    });

    it("updates completed back to false", () => {
      const task = createTask("Task To Reopen");
      updateTask(task.id, { completed: true });
      const reopened = updateTask(task.id, { completed: false });

      expect(reopened.completed).toBe(false);
      const fromDb = getTaskById(task.id);
      expect(fromDb.completed).toBe(false);
    });

    it("updates both title and completed simultaneously", () => {
      const task = createTask("Initial");
      const updated = updateTask(task.id, {
        title: "New Combined Title",
        completed: true,
      });

      expect(updated.title).toBe("New Combined Title");
      expect(updated.completed).toBe(true);

      const fromDb = getTaskById(task.id);
      expect(fromDb.title).toBe("New Combined Title");
      expect(fromDb.completed).toBe(true);
    });

    it("handles empty update object by touching updatedAt without altering title or completed", () => {
      const task = createTask("No Change Task");
      const updated = updateTask(task.id, {});

      expect(updated.id).toBe(task.id);
      expect(updated.title).toBe("No Change Task");
      expect(updated.completed).toBe(false);
      expect(updated.createdAt).toBe(task.createdAt);
    });

    it("handles missing updates argument by defaulting to empty object", () => {
      const task = createTask("Default Updates Task");
      const updated = updateTask(task.id);

      expect(updated.id).toBe(task.id);
      expect(updated.title).toBe("Default Updates Task");
      expect(updated.completed).toBe(false);
    });

    it("throws 400 error when updated title is invalid (empty or whitespace)", () => {
      const task = createTask("Valid Task");

      expect(() => updateTask(task.id, { title: "" })).toThrow(
        /Title cannot be empty/,
      );
      try {
        updateTask(task.id, { title: "" });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("empty");
      }

      expect(() => updateTask(task.id, { title: "   " })).toThrow(
        /Title cannot be empty/,
      );
    });

    it("throws 400 error when updated title exceeds 200 characters", () => {
      const task = createTask("Valid Task");
      const tooLong = "z".repeat(201);

      expect(() => updateTask(task.id, { title: tooLong })).toThrow(
        /Title cannot exceed 200 characters/,
      );
      try {
        updateTask(task.id, { title: tooLong });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("too-long");
      }
    });

    it("throws 400 error when completed is provided but not a boolean", () => {
      const task = createTask("Valid Task");

      expect(() => updateTask(task.id, { completed: "true" })).toThrow(
        /Field 'completed' must be a boolean/,
      );
      try {
        updateTask(task.id, { completed: "true" });
      } catch (err) {
        expect(err.status).toBe(400);
        expect(err.reason).toBe("invalid-type");
      }

      expect(() => updateTask(task.id, { completed: 1 })).toThrow(
        /Field 'completed' must be a boolean/,
      );
      expect(() => updateTask(task.id, { completed: null })).toThrow(
        /Field 'completed' must be a boolean/,
      );
    });
  });

  describe("deleteTask", () => {
    it("returns false when task id does not exist", () => {
      const result = deleteTask("non-existent-uuid");
      expect(result).toBe(false);
    });

    it("returns false when id is missing or invalid type", () => {
      expect(deleteTask(null)).toBe(false);
      expect(deleteTask(undefined)).toBe(false);
      expect(deleteTask("")).toBe(false);
      expect(deleteTask(12345)).toBe(false);
      expect(deleteTask({})).toBe(false);
    });

    it("deletes an existing task and returns true", () => {
      const task = createTask("Task to delete");
      expect(getTaskById(task.id)).not.toBeNull();

      const deleted = deleteTask(task.id);
      expect(deleted).toBe(true);

      expect(getTaskById(task.id)).toBeNull();
    });

    it("returns false when trying to delete the same task twice", () => {
      const task = createTask("Task to delete twice");

      expect(deleteTask(task.id)).toBe(true);
      expect(deleteTask(task.id)).toBe(false);
    });
  });
});
