// Algoritmos de ordenamiento (Unidad 2 · épica E4).
// Todos reciben una función de comparación, igual que Array.prototype.sort:
//   compare(a, b) < 0  → a va antes que b
//   compare(a, b) > 0  → b va antes que a
//   compare(a, b) = 0  → da igual
// Y todos devuelven un arreglo NUEVO: no modifican el original.

export type Compare<T> = (a: T, b: T) => number;

/**
 * EJEMPLO RESUELTO · Burbuja. O(n²). Sirve como línea base en el benchmark (H4.3).
 * Recorre el arreglo intercambiando vecinos desordenados; si en una pasada no hubo
 * intercambios, ya está ordenado y se detiene antes.
 */
export function bubbleSort<T>(items: readonly T[], compare: Compare<T>): T[] {
  const result = [...items];
  for (let end = result.length - 1; end > 0; end--) {
    let swapped = false;
    for (let i = 0; i < end; i++) {
      if (compare(result[i] as T, result[i + 1] as T) > 0) {
        [result[i], result[i + 1]] = [result[i + 1] as T, result[i] as T];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return result;
}

/** Historia H4.1 · Mergesort. O(n log n) y estable. Escríbelo a mano. */
export function mergeSort<T>(_items: readonly T[], _compare: Compare<T>): T[] {
  throw new Error('Pendiente: H4.1');
}

/** Historia H4.1 · Quicksort. O(n log n) en promedio. Escríbelo a mano. */
export function quickSort<T>(_items: readonly T[], _compare: Compare<T>): T[] {
  throw new Error('Pendiente: H4.1');
}
