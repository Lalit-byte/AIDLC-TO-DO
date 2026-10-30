import { app } from './app.js';

const PORT = process.env.PORT || 3001;

export const server = app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
