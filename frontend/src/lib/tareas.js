export function validarTitulo(titulo) {
  const LARGO_MAXIMO = 100;
  if (!titulo || !titulo.trim()) return { valido: false, error: 'El título es obligatorio.' };
  if (titulo.length > LARGO_MAXIMO) return { valido: false, error: `Largo máximo ${LARGO_MAXIMO}` };
  return { valido: true, error: null };
}

export async function pendientesDe(prioridad, traer) {
  // Función mockeable pasandole "traer" (fetch)
  const response = await traer(`/api/tareas?prioridad=${prioridad}`);
  const tareas = await response.json();
  return tareas.filter((t) => !t.completada);
}
