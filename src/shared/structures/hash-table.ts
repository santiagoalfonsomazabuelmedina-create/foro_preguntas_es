// Historia H3.4 · Tabla hash con manejo de colisiones. Escríbela a mano.
// NO uses Map ni objetos como diccionario por dentro: el punto es construir la tuya.
//
// Pasos sugeridos:
//   1. Un arreglo de "cubetas" (buckets) de tamaño fijo, por ejemplo 64.
//   2. Una función hash que convierta la clave (texto) en un índice de ese arreglo.
//   3. Colisiones por encadenamiento: cada cubeta guarda una lista de pares [clave, valor].
//   4. Cuando el factor de carga (elementos / cubetas) pase de 0.75, duplica el arreglo
//      y reubica todo (rehash).
//
// Criterio de aceptación: búsqueda en tiempo constante promedio con 10.000 registros.

export class HashTable<V> {
  set(_key: string, _value: V): void {
    throw new Error('Pendiente: H3.4');
  }

  get(_key: string): V | undefined {
    throw new Error('Pendiente: H3.4');
  }

  has(_key: string): boolean {
    throw new Error('Pendiente: H3.4');
  }

  delete(_key: string): boolean {
    throw new Error('Pendiente: H3.4');
  }

  get size(): number {
    throw new Error('Pendiente: H3.4');
  }
}
