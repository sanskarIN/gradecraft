import { describe, expect, it } from "vitest";
import { exportCourseCsv, importAssignmentsCsv, parseCsv } from "../src/data/csv";
import type { Course } from "../src/domain/types";

const course: Course = {
  id: "c",
  name: "=SUM(A1)",
  code: "C",
  color: "#000000",
  creditHours: 3,
  mode: "points",
  scaleId: "s",
  categories: [{ id: "x", name: "@Tests", weight: 100 }],
  assignments: [{
    id: "a",
    name: "@calc",
    categoryId: "x",
    score: 10,
    maxScore: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("CSV", () => {
  it("parses quoted commas and escaped quotes", () => {
    expect(parseCsv('a,b\n"hello, world","say ""hi"""')).toEqual([["a", "b"], ["hello, world", 'say "hi"']]);
  });

  it("rejects unterminated quotes", () => {
    expect(() => parseCsv('"oops')).toThrow(/unterminated/i);
  });

  it("imports required columns", () => {
    const rows = importAssignmentsCsv("category,assignment,score,maxScore\nTests,Midterm,42,50");
    expect(rows[0]?.assignment.score).toBe(42);
  });

  it("escapes spreadsheet formula cells on export", () => {
    const csv = exportCourseCsv(course);
    expect(csv).toContain("'=SUM(A1)");
    expect(csv).toContain("'@calc");
    expect(csv).toContain("'@Tests");
  });

  it("restores formula-neutralized category and assignment names on import", () => {
    const rows = importAssignmentsCsv(exportCourseCsv(course));
    expect(rows[0]?.categoryName).toBe("@Tests");
    expect(rows[0]?.assignment.name).toBe("@calc");
  });
});

describe("CSV validation", () => {
  it("rejects missing required headers", () => {
    expect(() => importAssignmentsCsv("category,score\nTests,10")).toThrow(/missing required column/i);
  });

  it("rejects impossible imported scores", () => {
    expect(() => importAssignmentsCsv("category,assignment,score,maxScore\nTests,Exam,12,10")).toThrow(/invalid/i);
  });

  it("rejects invalid due dates", () => {
    expect(() => importAssignmentsCsv("category,assignment,score,maxScore,dueDate\nTests,Exam,8,10,2026-99-99")).toThrow(/YYYY-MM-DD/i);
  });
});
