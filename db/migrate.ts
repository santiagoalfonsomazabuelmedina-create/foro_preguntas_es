// Ejecutor de migraciones SQL, escrito a mano para que veas que no hay magia.
//
//   npm run migrate    aplica las migraciones pendientes
//   npm run db:reset   BORRA todo y vuelve a aplicar todas (solo en desarrollo)
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const migrationsDir = path.resolve(import.meta.dirname, 'migrations');

export async function migrate(databaseUrl: string, { reset = false } = {}): Promise<string[]> {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  const applied: string[] = [];
  try {
    if (reset) {
      await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    }
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       text        PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )`);

    const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();
    const { rows } = await client.query<{ name: string }>('SELECT name FROM schema_migrations');
    const done = new Set(rows.map((row) => row.name));

    for (const file of files) {
      if (done.has(file)) continue;
      const sql = await readFile(path.join(migrationsDir, file), 'utf8');
      // Cada migración corre dentro de una transacción: o se aplica completa o no se aplica.
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        applied.push(file);
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`Falló la migración ${file}: ${(error as Error).message}`, { cause: error });
      }
    }
  } finally {
    await client.end();
  }
  return applied;
}

// Se ejecuta solo cuando llamas a este archivo directamente (no cuando lo importan las pruebas).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('Falta DATABASE_URL. Copia .env.example a .env.');
    process.exit(1);
  }
  const reset = process.argv.includes('--reset');
  try {
    const applied = await migrate(url, { reset });
    if (reset) console.log('Base de datos reiniciada.');
    console.log(applied.length ? `Migraciones aplicadas: ${applied.join(', ')}` : 'La base ya estaba al día.');
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}
