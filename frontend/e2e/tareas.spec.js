import { expect, test } from '@playwright/test';

test.describe('Suite E2E - Gestor de Tareas', () => {
  test.beforeEach(async ({ page }) => {
    // Aceptar automáticamente los diálogos confirm() del navegador al eliminar
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });
  });

  test('1. crear una tarea la muestra en la lista y eliminarla la saca', async ({ page }) => {
    await page.goto('/');

    const titulo = `e2e ${Date.now()}`;
    await page.getByLabel('Título:').fill(titulo);
    await page.getByRole('button', { name: 'Agregar Tarea' }).click();

    // Comprobar que la tarea creada aparece en pantalla
    await expect(page.getByText(titulo)).toBeVisible();

    // Eliminar la tarea usando su botón accesible
    await page.getByRole('button', { name: `Eliminar ${titulo}` }).click();

    // Verificar que ya no está en la lista
    await expect(page.getByText(titulo)).toHaveCount(0);
  });

  test('2. un título de más de 100 caracteres muestra el error y no crea nada', async ({ page }) => {
    await page.goto('/');

    const tituloInvalido = `e2e ${Date.now()} ${'x'.repeat(105)}`;
    await page.getByLabel('Título:').fill(tituloInvalido);
    await page.getByRole('button', { name: 'Agregar Tarea' }).click();

    // El usuario debe ver el mensaje de error con role="alert"
    await expect(page.getByRole('alert')).toBeVisible();

    // Y en la lista no debe haberse agregado nada con ese título
    await expect(page.getByText(tituloInvalido)).toHaveCount(0);
  });

  test('3. marcar una tarea como completada cambia su estado visualmente', async ({ page }) => {
    await page.goto('/');

    const titulo = `e2e complete ${Date.now()}`;
    await page.getByLabel('Título:').fill(titulo);
    await page.getByRole('button', { name: 'Agregar Tarea' }).click();

    // Esperar a que aparezca
    await expect(page.getByText(titulo)).toBeVisible();

    // Encontrar el item de la tarea y presionar 'Completar'
    const taskItem = page.locator('li.task-item', { hasText: titulo });
    await taskItem.getByRole('button', { name: 'Completar' }).click();

    // Al completarse, el botón cambia a 'Deshacer'
    await expect(taskItem.getByRole('button', { name: 'Deshacer' })).toBeVisible();

    // Limpiar: eliminar la tarea
    await taskItem.getByRole('button', { name: `Eliminar ${titulo}` }).click();
    await expect(page.getByText(titulo)).toHaveCount(0);
  });
});
