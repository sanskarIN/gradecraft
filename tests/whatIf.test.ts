import { describe, expect, it } from "vitest";
import {
  applyScoreOverrides,
  calculateWhatIf,
  createHypotheticalAssignment,
  requiredPointsScore,
  requiredWeightedScore,
} from "../src/domain/whatIf";
import type { Course } from "../src/domain/types";

const pointsCourse: Course = {
  id: "c",
  name: "Course",
  code: "",
  color: "#000000",
  creditHours: 3,
  mode: "points",
  scaleId: "s",
  categories: [{ id: "all", name: "All", weight: 100 }],
  assignments: [{ id: "a", name: "A", categoryId: "all", score: 80, maxScore: 100, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const weightedCourse: Course = {
  ...pointsCourse,
  id: "weighted",
  mode: "weighted",
  categories: [
    { id: "home", name: "Homework", weight: 40 },
    { id: "tests", name: "Tests", weight: 60 },
  ],
  assignments: [
    { id: "h1", name: "HW 1", categoryId: "home", score: 80, maxScore: 100, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
    { id: "t1", name: "Test 1", categoryId: "tests", score: 90, maxScore: 100, createdAt: "2026-01-01T00:00:00.000Z", updatedAt: "2026-01-01T00:00:00.000Z" },
  ],
};

describe("what-if", () => {
  it("applies temporary overrides without mutating source", () => {
    const changed = applyScoreOverrides(pointsCourse, { a: 95 });
    expect(changed.assignments[0]?.score).toBe(95);
    expect(pointsCourse.assignments[0]?.score).toBe(80);
  });

  it("finds required score for future points assignment", () => {
    expect(requiredPointsScore(pointsCourse, 90, 100)).toBeCloseTo(100);
  });

  it("rejects out-of-range points targets", () => {
    expect(requiredPointsScore(pointsCourse, 101, 100)).toBeNull();
    expect(requiredPointsScore(pointsCourse, -1, 100)).toBeNull();
  });

  it("solves a weighted-category future score", () => {
    expect(requiredWeightedScore(weightedCourse, "tests", 88, 100)).toBeCloseTo(96.6667, 3);
  });

  it("rejects invalid weighted target inputs", () => {
    expect(requiredWeightedScore(weightedCourse, "missing", 90, 100)).toBeNull();
    expect(requiredWeightedScore(weightedCourse, "tests", 101, 100)).toBeNull();
    expect(requiredWeightedScore(pointsCourse, "all", 90, 100)).toBeNull();
  });
});

describe("what-if scenario helpers", () => {
  it("calculates an overridden course grade", () => {
    expect(calculateWhatIf(pointsCourse, { a: 100 }).percent).toBeCloseTo(100);
    const item = createHypotheticalAssignment("all", 8, 10, "2026-01-01T00:00:00.000Z");
    expect(item.categoryId).toBe("all");
    expect(item.createdAt).toBe("2026-01-01T00:00:00.000Z");
  });
});
