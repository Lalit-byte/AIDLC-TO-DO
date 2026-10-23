// Test helpers: build valid tasks (five fields, fixed ISO time).

export const FIXED_TIME = '2026-01-01T10:00:00.000Z';

export function makeTask(overrides = {}) {
  return {
    id: 'id-1',
    title: 'Buy milk',
    completed: false,
    createdAt: FIXED_TIME,
    updatedAt: FIXED_TIME,
    ...overrides,
  };
}

export function makeTasks(count) {
  return Array.from({ length: count }, (_, index) =>
    makeTask({ id: `id-${index + 1}`, title: `Task number ${index + 1}` }),
  );
}

export function savedText(tasks) {
  return JSON.stringify({ version: 1, tasks });
}
