// EJEMPLO RESUELTO · Pila (LIFO: el último en entrar es el primero en salir).
//
// Está hecha con nodos enlazados, no con un arreglo: cada `push` crea un nodo nuevo
// en memoria (asignación dinámica) y cada `pop` lo suelta para que el recolector de
// basura lo libere. Es el equivalente en JavaScript de malloc/free en C (Unidad 5).
//
// Úsala como modelo para tus estructuras de la épica E3. Esas las escribes TÚ, a mano.

type StackNode<T> = {
  value: T;
  next: StackNode<T> | null;
};

export class Stack<T> {
  #top: StackNode<T> | null = null;
  #size = 0;

  /** Agrega un elemento arriba. O(1). */
  push(value: T): void {
    this.#top = { value, next: this.#top };
    this.#size++;
  }

  /** Quita y devuelve el elemento de arriba, o undefined si está vacía. O(1). */
  pop(): T | undefined {
    if (this.#top === null) return undefined;
    const { value, next } = this.#top;
    this.#top = next;
    this.#size--;
    return value;
  }

  /** Mira el elemento de arriba sin quitarlo. O(1). */
  peek(): T | undefined {
    return this.#top?.value;
  }

  get size(): number {
    return this.#size;
  }

  isEmpty(): boolean {
    return this.#size === 0;
  }

  /** Vacía la pila. */
  clear(): void {
    this.#top = null;
    this.#size = 0;
  }
}
