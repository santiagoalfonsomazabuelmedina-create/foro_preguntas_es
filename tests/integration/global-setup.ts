// Antes de las pruebas de integración: apunta a la base de PRUEBAS y la deja limpia.
// Así las pruebas nunca tocan tus datos de desarrollo.
import { migrate } from '../../db/migrate.ts';

export default async function setup(): Promise<void> {
  try {
    process.loadEnvFile('.env');
  } catch {
    // En CI no hay .env: las variables llegan desde el workflow.
  }
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error('Falta TEST_DATABASE_URL. Revisa tu .env (cópialo de .env.example).');
  }
  await migrate(url, { reset: true });
}
