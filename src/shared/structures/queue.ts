// Historia H3.3 · Cola (FIFO) o cola de prioridad. Escríbela a mano.
// Úsala para procesar trabajo en orden: pedidos, turnos, notificaciones.
//
// Reto: que `dequeue` sea O(1). Pista: un arreglo con `shift()` NO es O(1).
// Si tu producto necesita prioridad, implementa un montículo (heap) binario.

export class Queue<T> {
  enqueue(_value: T): void {
    throw new Error('Pendiente: H3.3');
  }

  dequeue(): T | undefined {
    throw new Error('Pendiente: H3.3');
  }

  peek(): T | undefined {
    throw new Error('Pendiente: H3.3');
  }

  get size(): number {
    throw new Error('Pendiente: H3.3');
  }
}
