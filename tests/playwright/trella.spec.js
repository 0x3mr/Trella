import { test, expect } from "@playwright/test";

test("user can move card between lists", async ({ page }) => {
  await page.goto("http://localhost:5173");

  await page.getByText("Add List").click();
  await page.keyboard.type("Todo");
  await page.keyboard.press("Enter");

  await page.getByText("Add Card").click();
  await page.keyboard.type("Task 1");
  await page.keyboard.press("Enter");

  const card = page.getByText("Task 1");
  await card.dragTo(page.getByText("Doing"));

  await expect(page.getByText("Task 1")).toBeVisible();
});
  