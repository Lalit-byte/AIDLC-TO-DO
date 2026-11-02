import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { createApp } from '../src/app.js';
import { initDatabase, closeDatabase } from '../src/db/database.js';
import { createTaskRouter } from '../src/routes/taskRoutes.js';

describe('Task REST API Routes (/api/tasks)', () => {
  let app;

  beforeEach(() => {
    initDatabase(':memory:');
    app = createApp();
  });

  afterEach(() => {
    closeDatabase();
  });

  describe('GET /api/tasks (BR-1)', () => {
    it('returns an empty array when no tasks exist', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns all tasks ordered by newest first', async () => {
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });

      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Task 2');
      expect(res.body[1].title).toBe('Task 1');
    });
  });

  describe('GET /api/tasks/:id (BR-1, BR-4)', () => {
    it('returns 200 and the task object when task exists', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Buy groceries' });
      const createdTask = createRes.body;

      const res = await request(app).get(`/api/tasks/${createdTask.id}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(createdTask);
    });

    it('returns 404 when task ID is not found', async () => {
      const res = await request(app).get('/api/tasks/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('POST /api/tasks (BR-1, BR-3, BR-4)', () => {
    it('creates a task with valid title and returns 201', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: '  Write documentation  ' });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.title).toBe('Write documentation');
      expect(res.body.completed).toBe(false);
      expect(res.body.createdAt).toBeDefined();
      expect(res.body.updatedAt).toBeDefined();
    });

    it('returns 400 when title is empty', async () => {
      const res = await request(app).post('/api/tasks').send({ title: '' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title cannot be empty');
      expect(res.body.reason).toBe('empty');
    });

    it('returns 400 when title is whitespace only', async () => {
      const res = await request(app).post('/api/tasks').send({ title: '   \t  ' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title cannot be empty');
      expect(res.body.reason).toBe('empty');
    });

    it('returns 400 when title is missing or not a string', async () => {
      const res = await request(app).post('/api/tasks').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title is required and must be a string');
      expect(res.body.reason).toBe('empty');

      const noBodyRes = await request(app).post('/api/tasks');
      expect(noBodyRes.status).toBe(400);
    });

    it('returns 400 when title exceeds 200 characters', async () => {
      const longTitle = 'a'.repeat(201);
      const res = await request(app).post('/api/tasks').send({ title: longTitle });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title cannot exceed 200 characters');
      expect(res.body.reason).toBe('too-long');
    });

    it('accepts title with exactly 200 characters', async () => {
      const title200 = 'a'.repeat(200);
      const res = await request(app).post('/api/tasks').send({ title: title200 });
      expect(res.status).toBe(201);
      expect(res.body.title).toBe(title200);
    });
  });

  describe('PATCH /api/tasks/:id (BR-1, BR-3, BR-4)', () => {
    it('updates title and returns 200', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original title' });
      const taskId = createRes.body.id;

      const patchRes = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ title: '  Updated title  ' });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.title).toBe('Updated title');
      expect(patchRes.body.completed).toBe(false);
      expect(new Date(patchRes.body.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(createRes.body.updatedAt).getTime()
      );
    });

    it('updates completed to true and returns 200', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test complete' });
      const taskId = createRes.body.id;

      const patchRes = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ completed: true });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.completed).toBe(true);
      expect(patchRes.body.title).toBe('Test complete');
    });

    it('updates both title and completed simultaneously', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to update' });
      const taskId = createRes.body.id;

      const patchRes = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ title: 'New Task Title', completed: true });

      expect(patchRes.status).toBe(200);
      expect(patchRes.body.title).toBe('New Task Title');
      expect(patchRes.body.completed).toBe(true);
    });

    it('returns 404 when updating non-existent task', async () => {
      const res = await request(app)
        .patch('/api/tasks/unknown-task-id')
        .send({ completed: true });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });

    it('returns 400 when update payload is not an object', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task' });
      const taskId = createRes.body.id;

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Content-Type', 'application/json')
        .send('["invalid"]');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Updates must be a valid object');
    });

    it('returns 400 when neither title nor completed is provided', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task' });
      const taskId = createRes.body.id;

      const res = await request(app).patch(`/api/tasks/${taskId}`).send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBe(
        'At least one field (title or completed) must be provided for update'
      );
    });

    it('returns 400 when updating title with empty string', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task' });
      const taskId = createRes.body.id;

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ title: '   ' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Title cannot be empty');
      expect(res.body.reason).toBe('empty');
    });

    it('returns 400 when updating completed with non-boolean', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task' });
      const taskId = createRes.body.id;

      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ completed: 'yes' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe("Field 'completed' must be a boolean");
      expect(res.body.reason).toBe('invalid-type');
    });
  });

  describe('DELETE /api/tasks/:id (BR-1, BR-4)', () => {
    it('deletes an existing task and returns 200', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to delete' });
      const taskId = createRes.body.id;

      const deleteRes = await request(app).delete(`/api/tasks/${taskId}`);
      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body).toEqual({
        message: 'Task deleted successfully',
        id: taskId,
      });

      // Confirm task no longer exists
      const getRes = await request(app).get(`/api/tasks/${taskId}`);
      expect(getRes.status).toBe(404);
    });

    it('returns 404 when deleting a non-existent task', async () => {
      const res = await request(app).delete('/api/tasks/unknown-task-id');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('Error Handling Middleware (BR-4)', () => {
    it('returns 400 on malformed JSON payload', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Content-Type', 'application/json')
        .send('{ "title": "bad json');

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Malformed JSON payload');
    });

    it('propagates 500 when service encounters an unexpected failure', async () => {
      const brokenService = {
        getAllTasks: () => {
          throw new Error('Database disk error');
        },
        getTaskById: () => {
          throw new Error('Database disk error');
        },
        createTask: () => {
          throw new Error('Database disk error');
        },
        updateTask: () => {
          throw new Error('Database disk error');
        },
        deleteTask: () => {
          throw new Error('Database disk error');
        },
      };

      const testApp = createApp({ taskService: brokenService });

      const getRes = await request(testApp).get('/api/tasks');
      expect(getRes.status).toBe(500);
      expect(getRes.body.error).toBe('Database disk error');

      const getByIdRes = await request(testApp).get('/api/tasks/123');
      expect(getByIdRes.status).toBe(500);
      expect(getByIdRes.body.error).toBe('Database disk error');

      const postRes = await request(testApp)
        .post('/api/tasks')
        .send({ title: 'Valid title' });
      expect(postRes.status).toBe(500);
      expect(postRes.body.error).toBe('Database disk error');

      const patchRes = await request(testApp)
        .patch('/api/tasks/123')
        .send({ title: 'New title' });
      expect(patchRes.status).toBe(500);
      expect(patchRes.body.error).toBe('Database disk error');

      const deleteRes = await request(testApp).delete('/api/tasks/123');
      expect(deleteRes.status).toBe(500);
      expect(deleteRes.body.error).toBe('Database disk error');
    });
  });
});
