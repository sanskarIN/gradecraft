import { calculateCourseGrade } from "./gradeMath";
import type { Assignment, Course } from "./types";

export type ScoreOverrides = Record<string, number>;

export function applyScoreOverrides(course: Course, overrides: ScoreOverrides): Course {
  return {
    ...course,
    assignments: course.assignments.map((assignment) => Object.hasOwn(overrides, assignment.id)
      ? { ...assignment, score: overrides[assignment.id] ?? assignment.score }
      : assignment),
  };
}

export function calculateWhatIf(course: Course, overrides: ScoreOverrides) {
  return calculateCourseGrade(applyScoreOverrides(course, overrides));
}

export function requiredPointsScore(
  course: Course,
  targetPercent: number,
  futureMaxScore: number,
): number | null {
  if (
    course.mode !== "points" ||
    !Number.isFinite(targetPercent) || targetPercent < 0 || targetPercent > 100 ||
    !Number.isFinite(futureMaxScore) || futureMaxScore <= 0
  ) return null;

  const earned = course.assignments.reduce((sum, assignment) => sum + assignment.score, 0);
  const possible = course.assignments.reduce((sum, assignment) => sum + assignment.maxScore, 0);
  return (targetPercent / 100) * (possible + futureMaxScore) - earned;
}

export function requiredWeightedScore(
  course: Course,
  categoryId: string,
  targetPercent: number,
  futureMaxScore: number,
): number | null {
  if (
    course.mode !== "weighted" ||
    !Number.isFinite(targetPercent) || targetPercent < 0 || targetPercent > 100 ||
    !Number.isFinite(futureMaxScore) || futureMaxScore <= 0
  ) return null;

  const category = course.categories.find((item) => item.id === categoryId);
  if (!category || category.weight <= 0) return null;

  const categoryAssignments = course.assignments.filter((item) => item.categoryId === categoryId);
  const categoryEarned = categoryAssignments.reduce((sum, item) => sum + item.score, 0);
  const categoryPossible = categoryAssignments.reduce((sum, item) => sum + item.maxScore, 0);

  let otherContribution = 0;
  let activeWeight = category.weight;

  for (const other of course.categories) {
    if (other.id === categoryId || other.weight <= 0) continue;
    const assignments = course.assignments.filter((item) => item.categoryId === other.id);
    const earned = assignments.reduce((sum, item) => sum + item.score, 0);
    const possible = assignments.reduce((sum, item) => sum + item.maxScore, 0);
    if (possible <= 0) continue;
    activeWeight += other.weight;
    otherContribution += (earned / possible) * other.weight;
  }

  const requiredContribution = (targetPercent / 100) * activeWeight - otherContribution;
  const requiredCategoryRatio = requiredContribution / category.weight;
  return requiredCategoryRatio * (categoryPossible + futureMaxScore) - categoryEarned;
}

export function createHypotheticalAssignment(
  categoryId: string,
  score: number,
  maxScore: number,
  now = new Date().toISOString(),
): Assignment {
  return {
    id: `whatif-${crypto.randomUUID()}`,
    name: "Hypothetical assignment",
    categoryId,
    score,
    maxScore,
    createdAt: now,
    updatedAt: now,
  };
}
