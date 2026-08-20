import { describe,expect,it } from "vitest";
import { sanitizeDownloadFilename } from "../src/utils/download";

describe("download filename portability",()=>{
  it("removes path traversal and cross-platform forbidden characters",()=>{
    const filename=sanitizeDownloadFilename("../Math: Algebra\\Final?*.csv");
    expect(filename).toBe("-Math- Algebra-Final-.csv");
    expect(filename).not.toMatch(/[\\/:*?"<>|]/);
  });

  it("neutralizes Windows reserved device names",()=>{
    expect(sanitizeDownloadFilename("CON.csv")).toBe("_CON.csv");
    expect(sanitizeDownloadFilename("lpt1.txt")).toBe("_lpt1.txt");
  });

  it("preserves a useful extension while bounding filename length",()=>{
    const filename=sanitizeDownloadFilename(`${"a".repeat(250)}.json`);
    expect(filename.length).toBeLessThanOrEqual(180);
    expect(filename.endsWith(".json")).toBe(true);
  });

  it("falls back when the proposed name contains only invalid characters",()=>{
    expect(sanitizeDownloadFilename("...   ")).toBe("gradecraft-export");
  });
});
