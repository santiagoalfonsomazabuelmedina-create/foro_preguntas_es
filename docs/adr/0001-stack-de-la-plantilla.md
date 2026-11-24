# ADR 0001 · Stack de la plantilla

- **Estado:** aceptada

## Contexto

El proyecto debe cubrir las seis unidades de Lenguaje de Programación y, a la vez,
preparar para el trabajo profesional en 2026.

## Decisión

- **TypeScript** en modo `strict`, ejecutado directamente por Node.js (sin paso de compilación en el backend).
- **Express** para la API y **Zod** para validar entradas.
- **PostgreSQL** con SQL escrito a mano y migraciones versionadas, sin ORM.
- **Vite** para el frontend, sin framework.
- **Vitest** y **Playwright** para pruebas; **GitHub Actions** para integración continua.
- **Docker Compose** para que la base de datos sea igual en todas las máquinas.

## Alternativas consideradas

| Alternativa | Por qué no, por ahora |
| --- | --- |
| ORM (Prisma, Drizzle) | Oculta el SQL; primero hay que dominarlo |
| React o Vue desde el inicio | Oculta el DOM; se puede adoptar desde el Sprint 5 |
| SQLite | Menos usado en empresas que PostgreSQL |

## Consecuencias

Más configuración inicial, que ya viene resuelta en la plantilla, y una base cercana a la de un equipo profesional.
