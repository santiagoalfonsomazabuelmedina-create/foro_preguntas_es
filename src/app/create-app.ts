// Arma la aplicación Express: conecta las rutas de cada funcionalidad del producto.
// Recibe sus dependencias (el pool de la base de datos) en lugar de crearlas: así las
// pruebas de integración pueden pasar la base de pruebas.
import { existsSync } from 'node:fs';
import path from 'node:path';
import express, { type ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import type { Pool } from '../shared/db.ts';
import { logger } from '../shared/logger.ts';
import { createTaskRepository } from '../tasks/task.repository.ts';
import { createTaskRouter } from '../tasks/task.routes.ts';

const webDist = path.resolve(import.meta.dirname, '../../dist/web');

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Datos no válidos', issues: error.issues });
    return;
  }
  logger.error('Error no controlado', error);
  res.status(500).json({ error: 'Error interno del servidor' });
};

export function createApp({ pool }: { pool: Pool }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));

  app.use((req, _res, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  app.get('/api/health', async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  });

  // Una línea por funcionalidad. Cuando agregues src/sales, aquí va /api/sales.
  app.use('/api/tasks', createTaskRouter(createTaskRepository(pool)));

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // En producción el mismo servidor entrega el frontend ya construido (npm run build).
  if (existsSync(webDist)) {
    app.use(express.static(webDist));
    app.get(/^\/(?!api\/).*/, (_req, res) => {
      res.sendFile(path.join(webDist, 'index.html'));
    });
  }

  app.use(errorHandler);
  return app;
}
