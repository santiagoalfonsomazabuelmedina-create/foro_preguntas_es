// Configuración por entorno (Unidad 1).
// Equivale a la "compilación condicional" de C: el mismo código se comporta
// distinto según las variables de entorno, sin cambiar una línea.

export type Config = {
  port: number;
  databaseUrl: string;
  debug: boolean;
  isProduction: boolean;
};

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Copia .env.example a .env y revisa sus valores.`);
  }
  return value;
}

export function loadConfig(): Config {
  return {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: required('DATABASE_URL'),
    debug: process.env.DEBUG === 'true',
    isProduction: process.env.NODE_ENV === 'production',
  };
}
