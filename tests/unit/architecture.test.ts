// Prueba de arquitectura · Screaming architecture.
//
// La estructura de src/ debe "gritar" de qué trata el producto: una carpeta por funcionalidad
// del negocio (src/sales, src/products, src/appointments…), no por capa técnica
// (src/controllers, src/models, src/services…).
//
// Reglas que revisa esta prueba (si falla, la CI queda en rojo):
//   1. En src/ no hay carpetas con nombres de capas técnicas.
//   2. src/shared (lo técnico y reutilizable) no importa nada de ninguna funcionalidad.
//   3. Las funcionalidades no importan nada de src/app (app las conecta, no al revés).
//   4. Cada funcionalidad tiene su archivo .model.ts con sus tipos.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC = path.resolve(import.meta.dirname, '../../src');
const TECHNICAL = new Set([
  'controllers', 'controller', 'models', 'model', 'services', 'service', 'routes', 'views',
  'repositories', 'utils', 'helpers', 'lib', 'server', 'web', 'frontend', 'backend', 'components',
]);
const NOT_FEATURES = new Set(['app', 'shared']);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? files(full) : full.endsWith('.ts') ? [full] : [];
  });
}

/** Imports locales de un archivo, resueltos a rutas absolutas. */
function localImports(file: string): string[] {
  const code = readFileSync(file, 'utf8');
  return [...code.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g)].map((m) => path.resolve(path.dirname(file), m[1]!));
}

const topFolders = readdirSync(SRC).filter((name) => statSync(path.join(SRC, name)).isDirectory());
const features = topFolders.filter((name) => !NOT_FEATURES.has(name));

describe('Screaming architecture', () => {
  it('src/ se organiza por funcionalidades del negocio, no por capas técnicas', () => {
    const technical = topFolders.filter((name) => TECHNICAL.has(name.toLowerCase()));
    expect(technical, `Mueve el código de ${technical.join(', ')} a la carpeta de su funcionalidad`).toEqual([]);
  });

  it('hay al menos una funcionalidad además de app y shared', () => {
    expect(features.length).toBeGreaterThan(0);
  });

  it('src/shared no depende de ninguna funcionalidad', () => {
    const shared = path.join(SRC, 'shared');
    const violations = files(shared).flatMap((file) =>
      localImports(file)
        .filter((target) => !target.startsWith(shared + path.sep))
        .map((target) => `${path.relative(SRC, file)} → ${path.relative(SRC, target)}`),
    );
    expect(violations).toEqual([]);
  });

  it('las funcionalidades no dependen de src/app', () => {
    const app = path.join(SRC, 'app');
    const violations = features.flatMap((feature) =>
      files(path.join(SRC, feature)).flatMap((file) =>
        localImports(file)
          .filter((target) => target.startsWith(app + path.sep))
          .map((target) => `${path.relative(SRC, file)} → ${path.relative(SRC, target)}`),
      ),
    );
    expect(violations).toEqual([]);
  });

  it.each(features)('la funcionalidad "%s" define su modelo (*.model.ts)', (feature) => {
    const models = files(path.join(SRC, feature)).filter((file) => file.endsWith('.model.ts'));
    expect(models.length).toBeGreaterThan(0);
  });
});
