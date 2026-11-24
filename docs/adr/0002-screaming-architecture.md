# ADR 0002 · Screaming architecture

- **Estado:** aceptada

## Contexto

El código de un producto crece por funcionalidades: ventas, inventario, citas. Si se organiza por
capas técnicas (`controllers/`, `models/`, `services/`), cada funcionalidad queda repartida en varias
carpetas, cuesta encontrar todo lo que toca un cambio y la estructura no dice de qué trata el producto.

## Decisión

`src/` se organiza con **screaming architecture**: una carpeta por funcionalidad del negocio, que
contiene su modelo, su SQL, sus endpoints y su pantalla. Lo técnico y reutilizable va en `src/shared/`
y el arranque en `src/app/`. Las reglas están en [docs/arquitectura.md](../arquitectura.md) y las
comprueba `tests/unit/architecture.test.ts`.

## Alternativas consideradas

| Alternativa | A favor | En contra |
| --- | --- | --- |
| Capas técnicas (MVC clásico) | Conocida, muchos tutoriales la usan | Una funcionalidad queda en 4 o 5 carpetas; la estructura no dice qué hace el producto |
| Separar `server/` y `web/` | Clara para quien empieza | Los tipos y la lógica de una funcionalidad quedan lejos de su pantalla |
| **Por funcionalidad (elegida)** | Todo lo de una funcionalidad junto; la estructura documenta el producto | Hay que decidir qué es una funcionalidad y qué va en `shared/` |

## Consecuencias

- Un cambio en "ventas" se hace casi siempre dentro de `src/sales/`.
- Una funcionalidad se puede borrar o mover borrando su carpeta.
- Cada alumno debe nombrar sus funcionalidades en el PRD antes de programar.
