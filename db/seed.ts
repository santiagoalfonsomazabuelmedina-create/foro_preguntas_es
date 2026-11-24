// Datos de prueba (historia H10.3).  Ejecuta:  npm run seed
//
// Genera 10.000 tareas de ejemplo con una sola consulta usando generate_series,
// una función de PostgreSQL que produce una serie de números. Adáptalo a tus tablas.
// El script es reproducible: borra lo anterior y siempre deja los mismos datos.
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('Falta DATABASE_URL. Copia .env.example a .env.');
  process.exit(1);
}

const TOTAL = 10_000;
const client = new pg.Client({ connectionString: url });
await client.connect();

try {
  await client.query('BEGIN');
  await client.query('TRUNCATE tasks RESTART IDENTITY');
  await client.query(
    `INSERT INTO tasks (title, done, created_at)
     SELECT 'Tarea de prueba ' || n,
            n % 3 = 0,
            now() - (n || ' minutes')::interval
     FROM generate_series(1, $1::int) AS n`,
    [TOTAL],
  );
  await client.query('COMMIT');
  console.log(`Listo: ${TOTAL.toLocaleString('es-VE')} tareas de prueba insertadas.`);
} catch (error) {
  await client.query('ROLLBACK');
  console.error('No se pudieron cargar los datos:', (error as Error).message);
  process.exitCode = 1;
} finally {
  await client.end();
}
