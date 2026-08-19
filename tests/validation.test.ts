import { describe, expect, it } from "vitest";
import { validateAssignment, validateCategories, validateGradeScale } from "../src/domain/validation";
import { DEFAULT_SCALE } from "../src/domain/defaults";

describe("validation", () => {
  it("requires weighted category totals to equal 100", () => {
    expect(validateCategories([{ id: "a", name: "A", weight: 50 }], "weighted")[0]?.message).toContain("100%");
  });

  it("rejects impossible scores", () => {
    const issues = validateAssignment(
      { name: "Exam", categoryId: "x", score: 110, maxScore: 100 },
      { categories: [{ id: "x", name: "Exams", weight: 100 }] },
    );
    expect(issues.some((issue) => issue.field === "score")).toBe(true);
  });

  it("accepts default scale", () => {
    expect(validateGradeScale(DEFAULT_SCALE)).toEqual([]);
  });

  it("requires unique thresholds and a zero-percent fallback", () => {
    const invalid = {
      id: "bad",
      name: "Bad scale",
      bands: [
        { id: "a", label: "A", minPercent: 90, gpaPoints: 4 },
        { id: "b", label: "B", minPercent: 90, gpaPoints: 3 },
      ],
    };
    const issues = validateGradeScale(invalid);
    expect(issues.some((issue) => issue.message.includes("percentages"))).toBe(true);
    expect(issues.some((issue) => issue.message.includes("0%"))).toBe(true);
  });
});
