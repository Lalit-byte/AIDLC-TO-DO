import { Router } from 'express';
import * as defaultTaskService from '../services/taskService.js';
import { validateTitle } from '../validators/titleValidator.js';

/**
 * Creates and configures Express router for /api/tasks.
 * Supports dependency injection of taskService for flexible testing.
 *
 * @param {typeof defaultTaskService} [taskService]
 * @returns {import('express').Router}
 */
export function createTaskRouter(taskService = defaultTaskService) {
  const router = Router();

  /**
   * GET /api/tasks
   * Lists all tasks ordered by createdAt DESC.
   */
  router.get('/', (req, res, next) => {
    try {
      const tasks = taskService.getAllTasks();
      return res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /api/tasks/:id
   * Retrieves a single task by its unique ID.
   */
  router.get('/:id', (req, res, next) => {
    try {
      const task = taskService.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  });

  /**
   * POST /api/tasks
   * Creates a new task.
   * Validates title (1-200 chars, trimmed) - BR-3.
   */
  router.post('/', (req, res, next) => {
    try {
      const { title } = req.body || {};
      const validation = validateTitle(title);
      if (!validation.valid) {
        return res.status(400).json({
          error: validation.error,
          reason: validation.reason,
        });
      }

      const task = taskService.createTask(validation.title);
      return res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  /**
   * PATCH /api/tasks/:id
   * Updates task title and/or completed status.
   */
  router.patch('/:id', (req, res, next) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
        return res.status(400).json({
          error: 'Updates must be a valid object',
          reason: 'invalid-payload',
        });
      }

      const { title, completed } = updates;

      if (title === undefined && completed === undefined) {
        return res.status(400).json({
          error: 'At least one field (title or completed) must be provided for update',
          reason: 'empty-updates',
        });
      }

      if (title !== undefined) {
        const validation = validateTitle(title);
        if (!validation.valid) {
          return res.status(400).json({
            error: validation.error,
            reason: validation.reason,
          });
        }
      }

      if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({
          error: "Field 'completed' must be a boolean",
          reason: 'invalid-type',
        });
      }

      const updatedTask = taskService.updateTask(id, { title, completed });
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.status(200).json(updatedTask);
    } catch (err) {
      next(err);
    }
  });

  /**
   * DELETE /api/tasks/:id
   * Removes a task from storage by ID.
   */
  router.delete('/:id', (req, res, next) => {
    try {
      const { id } = req.params;
      const deleted = taskService.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(200).json({
        message: 'Task deleted successfully',
        id,
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}

export const taskRouter = createTaskRouter();
export default taskRouter;
