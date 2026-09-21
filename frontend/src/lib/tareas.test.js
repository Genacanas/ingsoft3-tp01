import { describe, expect, it, vi } from 'vitest';
import { validarTitulo, pendientesDe } from './tareas.js';

describe('validarTitulo', () => {
  // TEST PARAMETRIZADO y de CASO DE ERROR
  it.each([
    ['vacío', ''],
    ['sólo espacios', '   '],
    ['un tabulador', '\t'],
    ['nulo', null],
  ])('rechaza un título %s', (_caso, entrada) => {
    const resultado = validarTitulo(entrada);
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toBe('El título es obligatorio.');
  });

  // OTRO CASO DE ERROR
  it('rechaza títulos que superan el largo máximo', () => {
    const resultado = validarTitulo('a'.repeat(101));
    expect(resultado.valido).toBe(false);
    expect(resultado.error).toContain('100');
  });
});

describe('pendientesDe', () => {
  // TEST CON MOCK
  it('devuelve sólo las tareas que no están completadas', async () => {
    const traer = vi.fn().mockResolvedValue({
      json: async () => [
        { id: 1, titulo: 'hecha', completada: true },
        { id: 2, titulo: 'una', completada: false },
      ]
    });
    
    const pendientes = await pendientesDe('alta', traer);
    
    expect(pendientes.length).toBe(1);
    expect(pendientes[0].titulo).toBe('una');
  });

  // TEST MOCK: Verificando la interacción
  it('le pide a la API la ruta con la prioridad correcta', async () => {
    const traer = vi.fn().mockResolvedValue({
      json: async () => []
    });
    
    await pendientesDe('alta', traer);
    
    expect(traer).toHaveBeenCalledWith('/api/tareas?prioridad=alta');
  });
});
