// Prueba de extremo a extremo (E2E): un navegador real usa la aplicación como lo haría una persona.
// Ejecuta:  npm run test:e2e   (la primera vez: npx playwright install chromium)
import { expect, test } from '@playwright/test';

test('una persona agrega una tarea y la marca como hecha', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  const title = `Tarea E2E ${Date.now()}`;
  await page.getByLabel('Título').fill(title);
  await page.getByRole('button', { name: 'Agregar' }).click();

  const checkbox = page.getByRole('checkbox', { name: title });
  await expect(checkbox).toBeVisible();
  await checkbox.check();
  await expect(checkbox).toBeChecked();
});

test('muestra un error si el título está vacío', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Agregar' }).click();
  await expect(page.getByRole('alert')).toHaveText('El título es obligatorio');
});
