// Repositorio: el ÚNICO lugar donde se escribe SQL para la entidad "tasks".
// Regla de seguridad (H10.4 y H11.3): toda consulta es parametrizada ($1, $2...).
// Nunca concatenes texto del usuario dentro del SQL: eso abre la puerta a la inyección SQL.
import type { Pool } from '../shared/db.ts';
import type { Task, TaskInput } from './task.model.ts';

type TaskRow = {
  id: number;
  title: string;
  done: boolean;
  created_at: Date;
};

const COLUMNS = 'id, title, done, created_at';

function toTask(row: TaskRow): Task {
  return { id: row.id, title: row.title, done: row.done, createdAt: row.created_at.toISOString() };
}

export function createTaskRepository(pool: Pool) {
  return {
    async list(): Promise<Task[]> {
      const { rows } = await pool.query<TaskRow>(
        `SELECT ${COLUMNS} FROM tasks ORDER BY created_at DESC, id DESC LIMIT 500`,
      );
      return rows.map(toTask);
    },

    async findById(id: number): Promise<Task | null> {
      const { rows } = await pool.query<TaskRow>(`SELECT ${COLUMNS} FROM tasks WHERE id = $1`, [id]);
      const row = rows[0];
      return row ? toTask(row) : null;
    },

    async create(input: TaskInput): Promise<Task> {
      const { rows } = await pool.query<TaskRow>(
        `INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING ${COLUMNS}`,
        [input.title, input.done],
      );
      return toTask(rows[0]!);
    },

    async update(id: number, input: TaskInput): Promise<Task | null> {
      const { rows } = await pool.query<TaskRow>(
        `UPDATE tasks SET title = $2, done = $3 WHERE id = $1 RETURNING ${COLUMNS}`,
        [id, input.title, input.done],
      );
      const row = rows[0];
      return row ? toTask(row) : null;
    },

    async remove(id: number): Promise<boolean> {
      const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  };
}

export type TaskRepository = ReturnType<typeof createTaskRepository>;
