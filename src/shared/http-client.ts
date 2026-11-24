// Cliente HTTP genérico del frontend. Cada funcionalidad (por ejemplo src/tasks/task.api.ts)
// lo usa para hablar con la API; aquí no hay nada de ninguna funcionalidad en particular.

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      error?: string;
      issues?: { message: string }[];
    };
    // Si Zod rechazó los datos, mostramos su mensaje concreto (ej.: "El título es obligatorio").
    throw new Error(body.issues?.[0]?.message ?? body.error ?? `Error ${response.status}`);
  }
  return (response.status === 204 ? undefined : await response.json()) as T;
}
