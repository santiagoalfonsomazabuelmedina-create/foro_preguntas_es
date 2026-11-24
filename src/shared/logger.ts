// Registro mínimo. `debug` solo escribe cuando DEBUG=true (historia H2.2).
// En producción no debe aparecer ningún mensaje de depuración.

const debugEnabled = process.env.DEBUG === 'true';

function stamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info(message: string): void {
    console.log(`${stamp()} INFO  ${message}`);
  },
  error(message: string, error?: unknown): void {
    console.error(`${stamp()} ERROR ${message}`, error ?? '');
  },
  debug(message: string): void {
    if (debugEnabled) console.log(`${stamp()} DEBUG ${message}`);
  },
};
