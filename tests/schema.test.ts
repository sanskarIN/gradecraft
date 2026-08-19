import { describe, expect, it } from "vitest";
import { createDefaultData } from "../src/domain/defaults";
import { migrateData } from "../src/data/migrations";
import { isAppData } from "../src/data/schema";

function validCourse(scaleId: string) {
  return {
    id: "c",
    name: "Valid",
    code: "",
    color: "#4f46e5",
    creditHours: 3,
    mode: "points" as const,
    scaleId,
    categories: [{ id: "a", name: "All", weight: 100 }],
    assignments: [],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("data schema", () => {
  it("accepts the default schema", () => {
    expect(isAppData(createDefaultData())).toBe(true);
  });

  it("rejects weighted courses with inconsistent totals", () => {
    const data = createDefaultData();
    const invalid = {
      ...data,
      courses: [{
        ...validCourse(data.gradeScales[0]?.id ?? "standard-4"),
        mode: "weighted" as const,
        categories: [{ id: "a", name: "Only", weight: 80 }],
      }],
    };
    expect(isAppData(invalid)).toBe(false);
  });

  it("rejects unsafe imported course colors", () => {
    const data = createDefaultData();
    const invalid = {
      ...data,
      courses: [{ ...validCourse(data.gradeScales[0]!.id), color: "url(https://example.test/tracker)" }],
    };
    expect(isAppData(invalid)).toBe(false);
  });

  it("rejects duplicate course ids", () => {
    const data = createDefaultData();
    const course = validCourse(data.gradeScales[0]!.id);
    expect(isAppData({ ...data, courses: [course, { ...course }] })).toBe(false);
  });

  it("rejects unknown schema versions", () => {
    expect(() => migrateData({ schemaVersion: 99 })).toThrow(/unsupported/i);
  });
});
