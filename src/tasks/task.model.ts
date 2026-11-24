// Modelo de la funcionalidad "tareas": tipos y validaciones que usan tanto la API como el frontend.
// "tasks" es solo la funcionalidad de EJEMPLO de la plantilla: crea una carpeta por cada
// funcionalidad de tu producto (src/sales, src/products…) y borra esta cuando ya no la necesites.
import { z } from 'zod';

/** Lo que el cliente envía para crear o editar una tarea. Zod valida en tiempo de ejecución. */
export const TaskInput = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio').max(120, 'Máximo 120 caracteres'),
  done: z.boolean().default(false),
});

/** El tipo TypeScript se deduce del esquema: una sola fuente de verdad. */
export type TaskInput = z.infer<typeof TaskInput>;

/** Lo que la API devuelve. */
export type Task = {
  id: number;
  title: string;
  done: boolean;
  createdAt: string;
};
