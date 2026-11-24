// Pruebas de ordenamiento y búsqueda.
// Las marcadas con `it.todo` son tuyas: cuando implementes el algoritmo, cambia
// `it.todo('…')` por `it('…', () => { … })` y escribe la prueba.
import { describe, expect, it } from 'vitest';
import { bubbleSort } from '../../src/shared/algorithms/sort.ts';

const byNumber = (a: number, b: number) => a - b;

describe('bubbleSort (ejemplo resuelto)', () => {
  it('ordena números de menor a mayor', () => {
    expect(bubbleSort([5, 3, 8, 1, 9, 2], byNumber)).toEqual([1, 2, 3, 5, 8, 9]);
  });

  it('no modifica el arreglo original', () => {
    const original = [3, 1, 2];
    bubbleSort(original, byNumber);
    expect(original).toEqual([3, 1, 2]);
  });

  it('maneja arreglos vacíos, de un elemento y con repetidos', () => {
    expect(bubbleSort([], byNumber)).toEqual([]);
    expect(bubbleSort([7], byNumber)).toEqual([7]);
    expect(bubbleSort([2, 1, 2, 1], byNumber)).toEqual([1, 1, 2, 2]);
  });

  it('ordena objetos por cualquier criterio', () => {
    const people = [{ name: 'Ana', age: 30 }, { name: 'Luis', age: 21 }];
    expect(bubbleSort(people, (a, b) => a.age - b.age).map((p) => p.name)).toEqual(['Luis', 'Ana']);
  });
});

describe('mergeSort (H4.1)', () => {
  it.todo('ordena números de menor a mayor');
  it.todo('es estable: los elementos iguales conservan su orden original');
  it.todo('da el mismo resultado que Array.prototype.sort con 10.000 números al azar');
});

describe('quickSort (H4.1)', () => {
  it.todo('ordena números de menor a mayor');
  it.todo('no se degrada con un arreglo ya ordenado de 10.000 elementos');
});

describe('binarySearch (H4.2)', () => {
  it.todo('encuentra el índice de un elemento existente');
  it.todo('devuelve -1 si el elemento no está');
});
