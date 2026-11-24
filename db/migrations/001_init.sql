-- Migración 001 · Tabla de EJEMPLO de la plantilla.
--
-- Cómo funcionan las migraciones (historia H10.2):
--   * Cada archivo .sql de esta carpeta es un cambio a la base de datos.
--   * Se ejecutan en orden alfabético: 001, 002, 003…
--   * `npm run migrate` aplica solo las que faltan y anota cada una en la tabla
--     schema_migrations. Así todos (tú, CI y el servidor) tienen la misma estructura.
--   * NUNCA edites una migración que ya se aplicó en otro lugar: crea una nueva.
--
-- Cuando tengas tu modelo entidad-relación (H10.1), crea 002_<tu-modelo>.sql con tus
-- tablas. Puedes borrar la tabla tasks con una migración nueva cuando ya no la uses.

CREATE TABLE tasks (
  id          integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title       text        NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  done        boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
