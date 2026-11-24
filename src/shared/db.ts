// Conexión a PostgreSQL con el driver `pg`, sin ORM.
// Un Pool reutiliza conexiones abiertas en vez de abrir una por cada consulta.
import pg from 'pg';

export type { Pool } from 'pg';

export function createPool(connectionString: string): pg.Pool {
  return new pg.Pool({ connectionString, max: 10 });
}
