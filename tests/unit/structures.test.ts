// Pruebas pendientes de tus estructuras de datos (épica E3).
// Cuando implementes cada una, reemplaza `it.todo` por pruebas reales.
// Criterio de H8.1: al menos 20 pruebas unitarias en verde al final del semestre.
import { describe, it } from 'vitest';

describe('DoublyLinkedList (H3.1)', () => {
  it.todo('append y prepend agregan al final y al inicio');
  it.todo('removeAt elimina por posición y reconecta los vecinos');
  it.todo('toArray recorre de inicio a fin');
});

describe('Queue (H3.3)', () => {
  it.todo('dequeue devuelve en el mismo orden en que entraron (FIFO)');
  it.todo('dequeue es O(1) con 100.000 elementos');
});

describe('HashTable (H3.4)', () => {
  it.todo('set y get guardan y recuperan por clave');
  it.todo('resuelve colisiones sin perder datos');
  it.todo('crece (rehash) al superar el factor de carga');
  it.todo('busca en tiempo constante promedio con 10.000 claves');
});
