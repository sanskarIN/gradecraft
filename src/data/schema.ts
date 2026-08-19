import type {
  AppData,
  Assignment,
  Category,
  Course,
  GradeBand,
  GradeScaleProfile,
  Settings,
} from "../domain/types";
import { validateGradeScale } from "../domain/validation";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isDateString(value: unknown): value is string {
  return isString(value) && Number.isFinite(Date.parse(value));
}

function isOptionalDueDate(value: unknown): boolean {
  return value === undefined || (
    isString(value) &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(`${value}T00:00:00Z`))
  );
}

function isCategory(value: unknown): value is Category {
  if (!isRecord(value)) return false;
  return isString(value.id) && value.id.length > 0 &&
    isString(value.name) && value.name.trim().length > 0 && value.name.length <= 100 &&
    isFiniteNumber(value.weight) && value.weight >= 0 && value.weight <= 100;
}

function isAssignment(value: unknown): value is Assignment {
  if (!isRecord(value)) return false;
  return isString(value.id) && value.id.length > 0 &&
    isString(value.name) && value.name.trim().length > 0 && value.name.length <= 100 &&
    isString(value.categoryId) && value.categoryId.length > 0 &&
    isFiniteNumber(value.score) && value.score >= 0 &&
    isFiniteNumber(value.maxScore) && value.maxScore > 0 && value.score <= value.maxScore &&
    isOptionalDueDate(value.dueDate) &&
    isDateString(value.createdAt) && isDateString(value.updatedAt);
}

function isGradeBand(value: unknown): value is GradeBand {
  if (!isRecord(value)) return false;
  return isString(value.id) && value.id.length > 0 &&
    isString(value.label) && value.label.trim().length > 0 && value.label.length <= 24 &&
    isFiniteNumber(value.minPercent) && value.minPercent >= 0 && value.minPercent <= 100 &&
    isFiniteNumber(value.gpaPoints) && value.gpaPoints >= 0 && value.gpaPoints <= 10;
}

function isGradeScale(value: unknown): value is GradeScaleProfile {
  if (!isRecord(value) || !isString(value.id) || value.id.length === 0 ||
      !isString(value.name) || !Array.isArray(value.bands)) {
    return false;
  }
  if (value.bands.length === 0 || !value.bands.every(isGradeBand)) return false;
  return validateGradeScale(value as unknown as GradeScaleProfile).length === 0;
}

function isCourse(value: unknown): value is Course {
  if (!isRecord(value)) return false;
  if (
    !isString(value.id) || value.id.length === 0 ||
    !isString(value.name) || !value.name.trim() || value.name.length > 80 ||
    !isString(value.code) || value.code.length > 24 ||
    !isString(value.color) || !/^#[0-9a-fA-F]{6}$/.test(value.color) ||
    !isFiniteNumber(value.creditHours) || value.creditHours < 0 || value.creditHours > 30 ||
    (value.mode !== "weighted" && value.mode !== "points") || !isString(value.scaleId) ||
    !Array.isArray(value.categories) || !value.categories.every(isCategory) ||
    !Array.isArray(value.assignments) || !value.assignments.every(isAssignment) ||
    !isDateString(value.createdAt) || !isDateString(value.updatedAt)
  ) return false;

  const categoryIds = new Set(value.categories.map((category) => category.id));
  const assignmentIds = new Set(value.assignments.map((assignment) => assignment.id));
  if (categoryIds.size !== value.categories.length || assignmentIds.size !== value.assignments.length) return false;
  if (!value.assignments.every((assignment) => categoryIds.has(assignment.categoryId))) return false;

  if (value.mode === "weighted" && value.categories.length > 0) {
    const total = value.categories.reduce((sum, category) => sum + category.weight, 0);
    if (Math.abs(total - 100) > 0.01) return false;
  }
  return true;
}

function isSettings(value: unknown): value is Settings {
  if (!isRecord(value)) return false;
  return (
    (value.theme === "light" || value.theme === "dark" || value.theme === "system") &&
    typeof value.reducedMotion === "boolean" &&
    typeof value.compactMode === "boolean" &&
    typeof value.onboardingComplete === "boolean"
  );
}

export function isAppData(value: unknown): value is AppData {
  if (!isRecord(value)) return false;
  if (
    value.schemaVersion !== 1 ||
    !Array.isArray(value.courses) || !value.courses.every(isCourse) ||
    !Array.isArray(value.gradeScales) || !value.gradeScales.every(isGradeScale) ||
    !isSettings(value.settings) || !isDateString(value.lastUpdatedAt)
  ) return false;

  const scaleIds = new Set(value.gradeScales.map((scale) => scale.id));
  const courseIds = new Set(value.courses.map((course) => course.id));
  return scaleIds.size === value.gradeScales.length &&
    courseIds.size === value.courses.length &&
    value.courses.every((course) => scaleIds.has(course.scaleId));
}
