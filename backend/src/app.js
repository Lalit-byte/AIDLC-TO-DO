import express from 'express';
import cors from 'cors';
import { createTaskRouter, taskRouter as defaultTaskRouter } from './routes/taskRoutes.js';

export function createApp(options = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Task API endpoints (BR-1)
  const router = options.taskService
    ? createTaskRouter(options.taskService)
    : defaultTaskRouter;
  app.use('/api/tasks', router);

  // 404 handler for unknown routes (BR-4)
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Standardized error handler (BR-4)
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        error: 'Malformed JSON payload',
        reason: 'malformed-json',
      });
    }
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(status).json({
      error: message,
      ...(err.reason ? { reason: err.reason } : {}),
    });
  });

  return app;
}

export const app = createApp();
