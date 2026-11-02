import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createApp } from '../src/app.js';
import { initDatabase, closeDatabase, getDatabase } from '../src/db/database.js';

describe('End-to-End Verification (B7: all BR & FR)', () => {
  let app;
  let tempDbDir;
  let dbFilePath;

  beforeEach(() => {
    closeDatabase();
    tempDbDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-e2e-'));
    dbFilePath = path.join(tempDbDir, 'e2e-tasks.db');
    initDatabase(dbFilePath);
    app = createApp();
  });

  afterEach(() => {
    closeDatabase();
    if (tempDbDir && fs.existsSync(tempDbDir)) {
      fs.rmSync(tempDbDir, { recursive: true, force: true });
    }
  });

  describe('BR-1 & BR-2: Complete CRUD Lifecycle & Database Persistence', () => {
    it('executes full task lifecycle and verifies persistence across restarts', async () => {
      // 1. Initial list should be empty
      const listRes1 = await request(app).get('/api/tasks');
      expect(listRes1.status).toBe(200);
      expect(listRes1.body).toEqual([]);

      // 2. Create Task 1
      const createRes1 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task One' });
      expect(createRes1.status).toBe(201);
      const task1 = createRes1.body;
      expect(task1.id).toBeDefined();
      expect(task1.title).toBe('Task One');
      expect(task1.completed).toBe(false);

      // 3. Create Task 2
      const createRes2 = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task Two' });
      expect(createRes2.status).toBe(201);
      const task2 = createRes2.body;

      // 4. Verify ordered list (newest first: Task 2, then Task 1)
      const listRes2 = await request(app).get('/api/tasks');
      expect(listRes2.status).toBe(200);
      expect(listRes2.body).toHaveLength(2);
      expect(listRes2.body[0].id).toBe(task2.id);
      expect(listRes2.body[1].id).toBe(task1.id);

      // 5. Update Task 1: mark completed and change title
      const patchRes = await request(app)
        .patch(`/api/tasks/${task1.id}`)
        .send({ title: 'Task One Finished', completed: true });
      expect(patchRes.status).toBe(200);
      expect(patchRes.body.title).toBe('Task One Finished');
      expect(patchRes.body.completed).toBe(true);

      // 6. Simulate Server / Database Restart (BR-2: Persistent SQLite)
      closeDatabase();
      const restartedDb = initDatabase(dbFilePath);
      expect(restartedDb.open).toBe(true);

      const restartedApp = createApp();

      // Verify tasks persisted across the restart
      const listAfterRestart = await request(restartedApp).get('/api/tasks');
      expect(listAfterRestart.status).toBe(200);
      expect(listAfterRestart.body).toHaveLength(2);
      expect(listAfterRestart.body[1].title).toBe('Task One Finished');
      expect(listAfterRestart.body[1].completed).toBe(true);

      // 7. Delete Task 2
      const deleteRes = await request(restartedApp).delete(`/api/tasks/${task2.id}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.id).toBe(task2.id);

      // Verify Task 2 is gone, only Task 1 remains
      const finalListRes = await request(restartedApp).get('/api/tasks');
      expect(finalListRes.status).toBe(200);
      expect(finalListRes.body).toHaveLength(1);
      expect(finalListRes.body[0].id).toBe(task1.id);
    });
  });

  describe('BR-3: Boundary Input Validation Verification', () => {
    it('accepts valid 1-char and 200-char titles and rejects invalid bounds', async () => {
      // Minimum bound: 1 char
      const minRes = await request(app).post('/api/tasks').send({ title: 'A' });
      expect(minRes.status).toBe(201);
      expect(minRes.body.title).toBe('A');

      // Maximum bound: 200 chars
      const max200 = 'x'.repeat(200);
      const maxRes = await request(app).post('/api/tasks').send({ title: max200 });
      expect(maxRes.status).toBe(201);
      expect(maxRes.body.title).toBe(max200);

      // Exceeding bound: 201 chars -> 400
      const over201 = 'x'.repeat(201);
      const overRes = await request(app).post('/api/tasks').send({ title: over201 });
      expect(overRes.status).toBe(400);
      expect(overRes.body.reason).toBe('too-long');

      // Empty title -> 400
      const emptyRes = await request(app).post('/api/tasks').send({ title: '' });
      expect(emptyRes.status).toBe(400);
      expect(emptyRes.body.reason).toBe('empty');

      // Whitespace only -> 400
      const spaceRes = await request(app).post('/api/tasks').send({ title: '   ' });
      expect(spaceRes.status).toBe(400);
      expect(spaceRes.body.reason).toBe('empty');
    });
  });

  describe('BR-4: Standardized Error Handling Verification', () => {
    it('returns 400 for bad request, 404 for missing resource, and 404 for unknown route', async () => {
      // 400 Bad Request
      const badReq = await request(app).post('/api/tasks').send({ title: '' });
      expect(badReq.status).toBe(400);
      expect(badReq.body.error).toBeDefined();

      // 404 Not Found on resource
      const notFoundResource = await request(app).get('/api/tasks/unknown-uuid');
      expect(notFoundResource.status).toBe(404);
      expect(notFoundResource.body.error).toBe('Task not found');

      // 404 Not Found on route
      const notFoundRoute = await request(app).get('/api/invalid-endpoint');
      expect(notFoundRoute.status).toBe(404);
      expect(notFoundRoute.body.error).toBe('Not found');
    });
  });
});
