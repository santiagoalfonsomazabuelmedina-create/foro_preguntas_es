// Punto de entrada del servidor.
// Node.js ejecuta este archivo TypeScript directamente (borra los tipos al cargar),
// por eso no hace falta compilar el backend.
import { loadConfig } from '../shared/config.ts';
import { createPool } from '../shared/db.ts';
import { createApp } from './create-app.ts';
import { logger } from '../shared/logger.ts';

const config = loadConfig();
const pool = createPool(config.databaseUrl);
const app = createApp({ pool });

const server = app.listen(config.port, () => {
  logger.info(`API escuchando en http://localhost:${config.port}`);
});

// ── Unidad 4: manejo de señales ────────────────────────────────────────────────
// Ctrl+C en la terminal envía SIGINT. Docker y los servidores en la nube envían
// SIGTERM antes de apagar el contenedor. Si no las atendemos, el proceso muere
// a mitad de una petición y se pueden perder datos.
let closing = false;

function shutdown(signal: NodeJS.Signals): void {
  if (closing) return;
  closing = true;
  logger.info(`Recibida ${signal}: cerrando de forma ordenada…`);

  // TODO H6.1: guarda aquí lo pendiente y cierra tus descriptores de archivo
  // (por ejemplo, el log de operaciones de H5.2) antes de terminar.

  server.close(async (error) => {
    await pool.end();
    logger.info('Cierre limpio: conexiones y servidor cerrados.');
    process.exit(error ? 1 : 0);
  });

  // Si algo se queda colgado, salimos a la fuerza a los 10 segundos.
  setTimeout(() => {
    logger.error('El cierre tardó demasiado; forzando la salida.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
