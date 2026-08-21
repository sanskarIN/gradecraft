import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { completeOnboarding, createWeightedCourse } from "./helpers";

const outputDir = path.resolve("test-results/publication-screenshots");

async function capture(page: Page, name: string) {
  await mkdir(outputDir, { recursive: true });
  await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: true });
}

test("captures deterministic publication screenshot candidates", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  await capture(page, "01-onboarding");

  await completeOnboarding(page);
  await createWeightedCourse(page);

  await page.getByRole("button", { name: "Add assignment" }).click();
  const assignmentDialog = page.getByRole("dialog");
  await assignmentDialog.getByLabel("Assignment name").fill("Midterm exam");
  await assignmentDialog.getByLabel("Score").fill("88");
  await assignmentDialog.getByLabel("Maximum score").fill("100");
  await assignmentDialog.getByRole("button", { name: "Add assignment" }).click();
  await expect(page.getByRole("cell", { name: "Midterm exam" })).toBeVisible();
  await capture(page, "03-course-detail");

  await page.goto("/#/dashboard");
  await expect(page.getByRole("button", { name: "New course" })).toBeVisible();
  await expect(page.getByText("Algebra", { exact: true })).toBeVisible();
  await capture(page, "02-course-dashboard");

  await page.getByText("Algebra", { exact: true }).click();
  await expect(page.getByRole("heading", { name: "Algebra" })).toBeVisible();
  await page.getByRole("button", { name: "Open what-if" }).click();
  await expect(page.getByRole("heading", { name: "What-if scores" })).toBeVisible();
  await capture(page, "04-what-if-planner");

  await page.goto("/#/gpa");
  await expect(page.getByRole("heading", { name: "GPA calculator" })).toBeVisible();
  await capture(page, "05-gpa-view");

  await page.goto("/#/settings");
  const theme = page.getByLabel("Theme");
  await expect(theme).toBeVisible();
  await theme.selectOption("light");
  await capture(page, "06-settings-light");
  await theme.selectOption("dark");
  await capture(page, "07-settings-dark");

  await page.goto("/#/data");
  await expect(page.getByRole("heading", { name: "Import & export" })).toBeVisible();
  await capture(page, "08-import-export");
});
