import { useMemo, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CourseForm } from "../components/CourseForm";
import { EmptyState } from "../components/EmptyState";
import { GradeRing } from "../components/GradeRing";
import { Modal } from "../components/Modal";
import { calculateCourseGrade, gradeBandForPercent } from "../domain/gradeMath";
import type { Course, GradeScaleProfile } from "../domain/types";
import { navigate } from "../hooks/useHashRoute";
import { useMessages } from "../i18n/useMessages";
import { useApp } from "../state/AppContext";

function CourseCard({ course, scales }: { course: Course; scales: GradeScaleProfile[] }) {
  const messages = useMessages();
  const result = calculateCourseGrade(course);
  const scale = scales.find((item) => item.id === course.scaleId);
  const band = scale ? gradeBandForPercent(result.percent, scale) : null;

  return (
    <Card className="course-card">
      <button className="course-card__open" onClick={() => navigate(`/course/${course.id}`)}>
        <div className="course-card__top">
          <span className="course-dot" style={{ background: course.color }} />
          <span>{course.code || messages.courseFallback}</span>
          <span>{course.mode === "weighted" ? messages.courseWeighted : messages.coursePoints}</span>
        </div>
        <h2>{course.name}</h2>
        {course.semester && <p className="eyebrow">{course.semester}</p>}
        <div className="course-card__grade">
          <GradeRing value={result.percent} label={band?.label ?? messages.courseCurrent} />
        </div>
        <p>{messages.assignmentCountCredits(course.assignments.length, course.creditHours)}</p>
      </button>
    </Card>
  );
}

export function DashboardPage() {
  const { data, dispatch } = useApp();
  const messages = useMessages();
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const semesterOptions = useMemo(
    () =>
      [
        ...new Set(
          data.courses
            .map((course) => course.semester?.trim())
            .filter((value): value is string => Boolean(value)),
        ),
      ].sort((a, b) => a.localeCompare(b)),
    [data.courses],
  );
  const courses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return data.courses.filter((course) => {
      const matchesQuery =
        !normalized || `${course.name} ${course.code} ${course.semester ?? ""}`.toLowerCase().includes(normalized);
      const matchesSemester =
        !semesterFilter ||
        (semesterFilter === "__none__" ? !course.semester : course.semester === semesterFilter);
      return matchesQuery && matchesSemester;
    });
  }, [data.courses, query, semesterFilter]);
  const groups = useMemo(() => {
    const grouped = new Map<string, Course[]>();
    for (const course of courses) {
      const key = course.semester?.trim() || messages.dashboardUnassignedSemester;
      grouped.set(key, [...(grouped.get(key) ?? []), course]);
    }
    return [...grouped.entries()].sort(([a], [b]) => {
      if (a === messages.dashboardUnassignedSemester) return 1;
      if (b === messages.dashboardUnassignedSemester) return -1;
      return a.localeCompare(b);
    });
  }, [courses, messages.dashboardUnassignedSemester]);

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <p className="eyebrow">{messages.dashboardEyebrow}</p>
          <h1>{messages.dashboardTitle}</h1>
          <p>{messages.dashboardPrivacy}</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>{messages.dashboardNewCourse}</Button>
      </div>
      {data.courses.length > 0 && (
        <div className="form-grid">
          <label className="search-field">
            {messages.dashboardSearch}
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={messages.dashboardSearchPlaceholder}
            />
          </label>
          {(semesterOptions.length > 0 || data.courses.some((course) => !course.semester)) && (
            <label>
              {messages.dashboardSemesterFilter}
              <select value={semesterFilter} onChange={(event) => setSemesterFilter(event.target.value)}>
                <option value="">{messages.dashboardAllSemesters}</option>
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
                {data.courses.some((course) => !course.semester) && (
                  <option value="__none__">{messages.dashboardUnassignedSemester}</option>
                )}
              </select>
            </label>
          )}
        </div>
      )}
      {data.courses.length === 0 ? (
        <EmptyState
          title={messages.emptyCourses}
          description={messages.emptyCoursesHint}
          action={<Button onClick={() => setCreateOpen(true)}>{messages.emptyCoursesAction}</Button>}
        />
      ) : courses.length === 0 ? (
        <EmptyState title={messages.emptySearch} description={messages.emptySearchHint} />
      ) : (
        <div className="page-stack">
          {groups.map(([semester, items]) => {
            const headingId = `semester-${semester.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
            return (
              <section key={semester} aria-labelledby={headingId}>
                <div className="page-heading">
                  <h2 id={headingId}>{semester}</h2>
                  <span className="muted">{messages.courseCount(items.length)}</span>
                </div>
                <div className="course-grid">
                  {items.map((course) => (
                    <CourseCard key={course.id} course={course} scales={data.gradeScales} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
      <Modal
        title={messages.createCourseTitle}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        closeLabel={messages.cancel}
      >
        <CourseForm
          scales={data.gradeScales}
          onCancel={() => setCreateOpen(false)}
          onSave={(course) => {
            dispatch({ type: "course/add", course });
            setCreateOpen(false);
            navigate(`/course/${course.id}`);
          }}
        />
      </Modal>
    </div>
  );
}
