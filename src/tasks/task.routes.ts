// Rutas HTTP de la entidad de ejemplo. Cada ruta: valida la entrada con Zod,
// llama al repositorio y responde con el código HTTP correcto.
//
//   GET    /api/tasks       200 lista
//   GET    /api/tasks/:id   200 una tarea · 404 si no existe
//   POST   /api/tasks       201 creada    · 400 si los datos no son válidos
//   PUT    /api/tasks/:id   200 editada   · 400 · 404
//   DELETE /api/tasks/:id   204 sin contenido · 404
import { Router } from 'express';
import { z } from 'zod';
import { TaskInput } from './task.model.ts';
import type { TaskRepository } from './task.repository.ts';

const IdParam = z.coerce.number().int().positive();

export function createTaskRouter(tasks: TaskRepository): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await tasks.list());
  });

  router.get('/:id', async (req, res) => {
    const task = await tasks.findById(IdParam.parse(req.params.id));
    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.json(task);
  });

  router.post('/', async (req, res) => {
    const input = TaskInput.parse(req.body);
    res.status(201).json(await tasks.create(input));
  });

  router.put('/:id', async (req, res) => {
    const task = await tasks.update(IdParam.parse(req.params.id), TaskInput.parse(req.body));
    if (!task) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.json(task);
  });

  router.delete('/:id', async (req, res) => {
    const removed = await tasks.remove(IdParam.parse(req.params.id));
    res.status(removed ? 204 : 404).end();
  });

  return router;
}
