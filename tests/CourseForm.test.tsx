import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_SCALE } from "../src/domain/defaults";
import type { Course } from "../src/domain/types";
import { CourseForm } from "../src/components/CourseForm";

const course: Course = {
  id: "course",
  name: "Biology",
  code: "BIO",
  color: "#4f46e5",
  creditHours: 3,
  mode: "weighted",
  scaleId: DEFAULT_SCALE.id,
  categories: [
    { id: "labs", name: "Labs", weight: 40 },
    { id: "tests", name: "Tests", weight: 60 },
  ],
  assignments: [{
    id: "lab-1",
    name: "Lab 1",
    categoryId: "labs",
    score: 9,
    maxScore: 10,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  }],
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("CourseForm integrity", () => {
  it("prevents removing a category that still owns assignments", () => {
    render(<CourseForm scales={[DEFAULT_SCALE]} initial={course} onSave={vi.fn()} />);
    const removeButtons = screen.getAllByRole("button", { name: "Remove" });
    expect(removeButtons[0]).toBeDisabled();
    expect(removeButtons[1]).not.toBeDisabled();
  });
});
