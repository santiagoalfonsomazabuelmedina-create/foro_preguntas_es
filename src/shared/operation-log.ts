// Historia H5.2 · Log de operaciones con descriptores de archivo (Unidad 3).
//
// Tu tarea: implementar un log "append-only" (solo se agrega al final) donde cada
// operación de escritura de la API (crear, editar, borrar) deja una línea JSON.
// Guárdalo en la carpeta data/ (por ejemplo data/operaciones.log): está en .gitignore y,
// dentro de Docker, es la carpeta donde la aplicación tiene permiso de escritura.
//
// Reglas de la historia:
//   1. Abre el archivo UNA vez con `open` de 'node:fs/promises' en modo 'a' (append).
//      Eso te devuelve un FileHandle: el descriptor de archivo que el sistema operativo
//      te prestó. Imprime `handle.fd` para ver su número.
//   2. Escribe cada operación con `handle.write(...)`.
//   3. Ciérralo con `handle.close()` cuando el servidor se apague (ver H6.1 en src/app/server.ts).
//      Un descriptor que no se cierra es un recurso que el sistema no recupera.
//
// En la defensa te preguntarán: ¿qué es un descriptor?, ¿por qué hay que cerrarlo?,
// ¿qué pasa si el proceso muere sin cerrarlo?

export type OperationLog = {
  write(entry: { action: string; entity: string; id?: number }): Promise<void>;
  close(): Promise<void>;
};

export async function openOperationLog(_path: string): Promise<OperationLog> {
  throw new Error('Pendiente: historia H5.2');
}
