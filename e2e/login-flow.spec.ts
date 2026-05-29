import { expect, test } from "@playwright/test";

test.describe("Login flow", () => {
  test("login page renders sign-in form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByText(/connect your wallet/i)).toBeVisible();
  });

  test("demo sign-in button is visible and clickable", async ({ page }) => {
    await page.goto("/login");

    const demoButton = page.getByRole("button", { name: /continue with demo/i });
    await expect(demoButton).toBeVisible();
    await expect(demoButton).toBeEnabled();
  });

  test("demo sign-in navigates to dashboard", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: /continue with demo/i }).click();

    // Should navigate to dashboard after sign-in
    await page.waitForURL("**/dashboard", { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("login page has proper data-qa attributes", async ({ page }) => {
    await page.goto("/login");

    const demoButton = page.locator('[data-qa="login-demo-button"]');
    await expect(demoButton).toBeVisible();
  });
});
