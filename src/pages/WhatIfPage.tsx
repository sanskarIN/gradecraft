import { useEffect, useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { EmptyState } from "../components/EmptyState";
import { GradeRing } from "../components/GradeRing";
import {
  calculateWhatIf,
  requiredPointsScore,
  requiredWeightedScore,
  type ScoreOverrides,
} from "../domain/whatIf";
import { navigate } from "../hooks/useHashRoute";
import { useMessages } from "../i18n/useMessages";
import { useApp } from "../state/AppContext";

export function WhatIfPage({ id }: { id?: string }) {
  const { data } = useApp();
  const messages = useMessages();
  const initialCourse = data.courses.find((item) => item.id === id) ?? data.courses[0];
  const [courseId, setCourseId] = useState(initialCourse?.id ?? "");
  const [overrides, setOverrides] = useState<ScoreOverrides>({});
  const [target, setTarget] = useState(90);
  const [futureMax, setFutureMax] = useState(100);
  const [targetCategoryId, setTargetCategoryId] = useState(
    initialCourse?.categories.find((item) => item.weight > 0)?.id ?? "",
  );

  useEffect(() => {
    if (data.courses.length === 0 || data.courses.some((item) => item.id === courseId)) return;
    const fallback = data.courses[0]!;
    setCourseId(fallback.id);
    setOverrides({});
    setTargetCategoryId(fallback.categories.find((item) => item.weight > 0)?.id ?? "");
  }, [courseId, data.courses]);

  const course = data.courses.find((item) => item.id === courseId);
  const result = useMemo(() => (course ? calculateWhatIf(course, overrides) : null), [course, overrides]);
  const weightedCategoryId = course?.categories.some(
    (item) => item.id === targetCategoryId && item.weight > 0,
  )
    ? targetCategoryId
    : (course?.categories.find((item) => item.weight > 0)?.id ?? "");
  const required = course
    ? course.mode === "points"
      ? requiredPointsScore(course, target, futureMax)
      : requiredWeightedScore(course, target, weightedCategoryId, futureMax)
    : null;

  if (data.courses.length === 0) {
    return (
      <EmptyState
        title={messages.whatIfEmptyTitle}
        description={messages.whatIfEmptyHint}
        action={<Button onClick={() => navigate("/dashboard")}>{messages.emptyCoursesAction}</Button>}
      />
    );
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{messages.whatIfEyebrow}</p>
          <h1>{messages.whatIfTitle}</h1>
          <p>{messages.whatIfIntro}</p>
        </div>
      </div>
      <label className="select-course">
        {messages.whatIfCourse}
        <select
          value={courseId}
          onChange={(event) => {
            const nextId = event.target.value;
            const nextCourse = data.courses.find((item) => item.id === nextId);
            setCourseId(nextId);
            setOverrides({});
            setTargetCategoryId(nextCourse?.categories.find((item) => item.weight > 0)?.id ?? "");
          }}
        >
          {data.courses.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {course && result && (
        <>
          <div className="hero-grid">
            <Card>
              <GradeRing value={result.percent} label={messages.whatIfScenarioGrade} />
            </Card>
            <Card title={messages.whatIfHowTitle}>
              <p>{messages.whatIfHowBody}</p>
              <Button variant="secondary" onClick={() => setOverrides({})}>
                {messages.whatIfReset}
              </Button>
            </Card>
          </div>
          <Card title={messages.whatIfScoresTitle}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{messages.whatIfAssignment}</th>
                    <th>{messages.whatIfActual}</th>
                    <th>{messages.whatIfScore}</th>
                    <th>{messages.whatIfMaximum}</th>
                  </tr>
                </thead>
                <tbody>
                  {course.assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.name}</td>
                      <td>{assignment.score}</td>
                      <td>
                        <input
                          aria-label={`${messages.whatIfScore} ${assignment.name}`}
                          type="number"
                          min="0"
                          max={assignment.maxScore}
                          step="0.01"
                          value={overrides[assignment.id] ?? assignment.score}
                          onChange={(event) =>
                            setOverrides((current) => ({
                              ...current,
                              [assignment.id]: Math.min(
                                assignment.maxScore,
                                Math.max(0, Number(event.target.value)),
                              ),
                            }))
                          }
                        />
                      </td>
                      <td>{assignment.maxScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card title={messages.whatIfTargetTitle}>
            <div className="form-grid">
              <label>
                {messages.whatIfTargetPercent}
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={target}
                  onChange={(event) => setTarget(Number(event.target.value))}
                />
              </label>
              {course.mode === "weighted" && (
                <label>
                  {messages.whatIfTargetCategory}
                  <select
                    value={weightedCategoryId}
                    onChange={(event) => setTargetCategoryId(event.target.value)}
                  >
                    {course.categories
                      .filter((item) => item.weight > 0)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} ({item.weight}%)
                        </option>
                      ))}
                  </select>
                </label>
              )}
              <label>
                {messages.whatIfFutureMaximum}
                <input
                  type="number"
                  min="0.01"
                  value={futureMax}
                  onChange={(event) => setFutureMax(Number(event.target.value))}
                />
              </label>
            </div>
            <p className="callout">
              {required === null
                ? messages.whatIfInvalid
                : required <= 0
                  ? messages.whatIfAlreadyMet
                  : required > futureMax
                    ? messages.whatIfNeededAbove(required, futureMax)
                    : messages.whatIfNeeded(required, futureMax, target)}
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
