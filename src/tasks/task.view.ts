// Pantalla de la funcionalidad "tareas": TypeScript + DOM, sin framework.
// src/app/web/main.ts la arranca con startTaskView().
import { taskApi } from './task.api.ts';
import type { Task } from './task.model.ts';

function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`No existe el elemento #${id}`);
  return element as T;
}

export function startTaskView(): void {
  const form = byId<HTMLFormElement>('task-form');
  const titleInput = byId<HTMLInputElement>('task-title');
  const formError = byId<HTMLParagraphElement>('form-error');
  const list = byId<HTMLUListElement>('task-list');
  const count = byId<HTMLSpanElement>('task-count');
  const emptyState = byId<HTMLParagraphElement>('empty-state');

  let tasks: Task[] = [];

  function render(): void {
    list.replaceChildren(
      ...tasks.map((task) => {
        const item = document.createElement('li');
        item.className = task.done ? 'task done' : 'task';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.id = `task-${task.id}`;
        checkbox.addEventListener('change', () => void toggle(task));

        const label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = task.title; // textContent, nunca innerHTML: evita XSS (H11.3)

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'link';
        remove.textContent = 'Eliminar';
        remove.setAttribute('aria-label', `Eliminar ${task.title}`);
        remove.addEventListener('click', () => void removeTask(task));

        item.append(checkbox, label, remove);
        return item;
      }),
    );
    count.textContent = `(${tasks.length})`;
    emptyState.hidden = tasks.length > 0;
  }

  async function load(): Promise<void> {
    tasks = await taskApi.list();
    render();
  }

  async function toggle(task: Task): Promise<void> {
    const updated = await taskApi.update(task.id, { title: task.title, done: !task.done });
    tasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    render();
  }

  async function removeTask(task: Task): Promise<void> {
    await taskApi.remove(task.id);
    tasks = tasks.filter((t) => t.id !== task.id);
    render();
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    formError.textContent = '';
    try {
      const created = await taskApi.create({ title: titleInput.value, done: false });
      tasks = [created, ...tasks];
      titleInput.value = '';
      render();
    } catch (error) {
      formError.textContent = error instanceof Error ? error.message : 'No se pudo guardar';
    }
  });

  load().catch(() => {
    formError.textContent = 'No se pudo conectar con la API. ¿Está corriendo `npm run dev`?';
  });
}
