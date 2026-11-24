// Llamadas del frontend a la API de tareas. Comparte los tipos con el servidor
// (task.model.ts): si cambias un campo, TypeScript te avisa en ambos lados.
import { request } from '../shared/http-client.ts';
import type { Task, TaskInput } from './task.model.ts';

export const taskApi = {
  list: () => request<Task[]>('/tasks'),
  create: (input: TaskInput) => request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) }),
  update: (id: number, input: TaskInput) =>
    request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(input) }),
  remove: (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
};
