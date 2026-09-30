import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { saveData } from "../src/data/storage";
import { createDefaultData } from "../src/domain/defaults";
import { WhatIfPage } from "../src/pages/WhatIfPage";
import { AppProvider } from "../src/state/AppContext";

describe("WhatIfPage routing", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("falls back to an available course when a deep-linked course was deleted", () => {
    const now = "2026-08-23T00:00:00.000Z";
    const data = createDefaultData(now);
    data.settings.onboardingComplete = true;
    data.courses = [
      {
        id: "course-available",
        name: "Available Course",
        code: "MATH 101",
        color: "#4f46e5",
        creditHours: 3,
        mode: "points",
        scaleId: data.gradeScales[0]!.id,
        categories: [{ id: "category-all", name: "All work", weight: 100 }],
        assignments: [],
        createdAt: now,
        updatedAt: now,
      },
    ];
    expect(saveData(data)).toBe(true);

    render(
      <AppProvider>
        <WhatIfPage id="course-deleted" />
      </AppProvider>,
    );

    expect(screen.getByRole("combobox", { name: "Course" })).toHaveValue("course-available");
    expect(screen.getByRole("heading", { name: "What-if scores" })).toBeInTheDocument();
    expect(screen.getByText("Available Course")).toBeInTheDocument();
  });
});
