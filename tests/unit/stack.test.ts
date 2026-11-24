// Pruebas unitarias de la pila de ejemplo. Úsalas como modelo para las tuyas.
// Patrón de cada prueba: preparar → actuar → comprobar.
import { describe, expect, it } from 'vitest';
import { Stack } from '../../src/shared/structures/stack.ts';

describe('Stack', () => {
  it('empieza vacía', () => {
    const stack = new Stack<number>();
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size).toBe(0);
    expect(stack.pop()).toBeUndefined();
  });

  it('devuelve los elementos en orden inverso (LIFO)', () => {
    const stack = new Stack<string>();
    stack.push('a');
    stack.push('b');
    stack.push('c');
    expect(stack.pop()).toBe('c');
    expect(stack.pop()).toBe('b');
    expect(stack.pop()).toBe('a');
    expect(stack.isEmpty()).toBe(true);
  });

  it('peek mira el tope sin quitarlo', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    expect(stack.peek()).toBe(2);
    expect(stack.size).toBe(2);
  });

  it('clear la vacía', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.clear();
    expect(stack.size).toBe(0);
    expect(stack.peek()).toBeUndefined();
  });

  it('soporta 100.000 elementos', () => {
    const stack = new Stack<number>();
    for (let i = 0; i < 100_000; i++) stack.push(i);
    expect(stack.size).toBe(100_000);
    expect(stack.pop()).toBe(99_999);
  });
});
