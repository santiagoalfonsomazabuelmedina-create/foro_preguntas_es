// Historia H4.3 · Benchmark de ordenamiento.  Ejecuta:  npm run bench
//
// Mide cuánto tarda cada algoritmo con 1.000, 10.000 y 100.000 números al azar.
// Cuando termines mergeSort y quickSort aparecerán sus tiempos; mientras tanto
// verás "pendiente". Copia la tabla a docs/benchmark.md, grafícala y explica los
// resultados con notación Big-O.
import { performance } from 'node:perf_hooks';
import { bubbleSort, mergeSort, quickSort, type Compare } from './sort.ts';

type Sorter = (items: readonly number[], compare: Compare<number>) => number[];

const byNumber: Compare<number> = (a, b) => a - b;
const sizes = [1_000, 10_000, 100_000];

const algorithms: Record<string, Sorter> = {
  'Burbuja (O(n²))': bubbleSort,
  'Mergesort': mergeSort,
  'Quicksort': quickSort,
  'Array.prototype.sort': (items, compare) => [...items].sort(compare),
};

function randomNumbers(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 1_000_000));
}

function measure(sort: Sorter, data: readonly number[]): string {
  try {
    const start = performance.now();
    sort(data, byNumber);
    return `${(performance.now() - start).toFixed(1)} ms`;
  } catch {
    return 'pendiente';
  }
}

const table: Record<string, Record<string, string>> = {};
for (const size of sizes) {
  const data = randomNumbers(size);
  const row: Record<string, string> = {};
  for (const [name, sort] of Object.entries(algorithms)) {
    // Burbuja con 100.000 elementos tarda demasiado: lo saltamos a propósito.
    row[name] = name.startsWith('Burbuja') && size > 10_000 ? 'omitido' : measure(sort, data);
  }
  table[`${size.toLocaleString('es-VE')} elementos`] = row;
}

console.table(table);
