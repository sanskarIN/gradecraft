import { describe, expect, it } from "vitest";
import { sanitizeDownloadFilename } from "../src/utils/download";

describe("download filename safety", () => {
  it("replaces filesystem separators, control characters, and reserved punctuation", () => {
    const filename = sanitizeDownloadFilename('Math/Algebra: Fall?*\u0001-grades.csv');
    expect(Array.from(filename).every((character) => character.charCodeAt(0) > 0x1f)).toBe(true);
    expect(filename).not.toMatch(/[<>:"/\\|?*]/);
    expect(filename).toMatch(/\.csv$/);
  });

  it("avoids Windows device names", () => {
    expect(sanitizeDownloadFilename("CON.csv")).toBe("_CON.csv");
    expect(sanitizeDownloadFilename("lpt1.txt")).toBe("_lpt1.txt");
  });

  it("falls back when a requested filename has no usable characters", () => {
    expect(sanitizeDownloadFilename("...   ")).toBe("gradecraft-export.txt");
  });

  it("limits very long filenames while preserving the extension", () => {
    const filename = sanitizeDownloadFilename(`${"a".repeat(300)}.csv`);
    expect(filename.length).toBeLessThanOrEqual(180);
    expect(filename).toMatch(/\.csv$/);
  });
});
