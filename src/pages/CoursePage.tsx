import { useState } from "react";
import { AssignmentForm } from "../components/AssignmentForm";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ContributionChart } from "../components/ContributionChart";
import { CourseForm } from "../components/CourseForm";
import { EmptyState } from "../components/EmptyState";
import { GradeRing } from "../components/GradeRing";
import { Modal } from "../components/Modal";
import { TrendChart } from "../components/TrendChart";
import { calculateCourseGrade, gradeBandForPercent } from "../domain/gradeMath";
import type { Assignment } from "../domain/types";
import { navigate } from "../hooks/useHashRoute";
import { useMessages } from "../i18n/useMessages";
import { useApp } from "../state/AppContext";

export function CoursePage({ id }: { id: string }) {
  const { data, dispatch } = useApp();
  const messages = useMessages();
  const course = data.courses.find((item) => item.id === id);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [lastDeleted, setLastDeleted] = useState<Assignment | null>(null);

  if (!course) {
    return (
      <EmptyState
        title={messages.courseNotFound}
        description={messages.courseNotFoundHint}
        action={<Button onClick={() => navigate("/dashboard")}>{messages.backCourses}</Button>}
      />
    );
  }

  const currentCourse = course;
  const result = calculateCourseGrade(currentCourse);
  const scale = data.gradeScales.find((item) => item.id === currentCourse.scaleId);
  const band = scale ? gradeBandForPercent(result.percent, scale) : null;
  const categoryNames = Object.fromEntries(
    currentCourse.categories.map((category) => [category.id, category.name]),
  );

  function saveAssignment(assignment: Assignment) {
    const exists = currentCourse.assignments.some((item) => item.id === assignment.id);
    const assignments = exists
      ? currentCourse.assignments.map((item) => (item.id === assignment.id ? assignment : item))
      : [...currentCourse.assignments, assignment];
    dispatch({
      type: "course/update",
      course: { ...currentCourse, assignments, updatedAt: new Date().toISOString() },
    });
    setAssignmentOpen(false);
    setEditingAssignment(null);
  }

  function deleteAssignment(assignment: Assignment) {
    dispatch({
      type: "course/update",
      course: {
        ...currentCourse,
        assignments: currentCourse.assignments.filter((item) => item.id !== assignment.id),
        updatedAt: new Date().toISOString(),
      },
    });
    setLastDeleted(assignment);
  }

  function undoDelete() {
    if (!lastDeleted) return;
    dispatch({
      type: "course/update",
      course: {
        ...currentCourse,
        assignments: [...currentCourse.assignments, lastDeleted],
        updatedAt: new Date().toISOString(),
      },
    });
    setLastDeleted(null);
  }

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <button className="back-link" onClick={() => navigate("/dashboard")}>
            ← {messages.backCourses}
          </button>
          <p className="eyebrow">{currentCourse.code || messages.courseFallback}</p>
          <h1>{currentCourse.name}</h1>
          <p>
            {currentCourse.mode === "weighted" ? messages.weightedGrading : messages.pointsGrading}
            {currentCourse.semester ? ` · ${currentCourse.semester}` : ""}
          </p>
        </div>
        <div className="button-row">
          <Button variant="secondary" onClick={() => setEditOpen(true)}>
            {messages.editCourse}
          </Button>
          <Button onClick={() => setAssignmentOpen(true)}>{messages.addAssignment}</Button>
        </div>
      </div>
      {lastDeleted && (
        <div className="notice undo-notice" role="status">
          <span>{messages.deletedAssignment(lastDeleted.name)}</span>
          <Button variant="secondary" onClick={undoDelete}>
            {messages.undo}
          </Button>
        </div>
      )}
      <div className="hero-grid">
        <Card>
          <GradeRing
            value={result.percent}
            label={band ? messages.gradeWithLabel(band.label) : messages.currentGrade}
          />
        </Card>
        <Card title={messages.gradeSummary}>
          <dl className="stats">
            <div>
              <dt>{messages.earnedPoints}</dt>
              <dd>{result.earned.toFixed(1)}</dd>
            </div>
            <div>
              <dt>{messages.possiblePoints}</dt>
              <dd>{result.possible.toFixed(1)}</dd>
            </div>
            <div>
              <dt>{messages.activeWeight}</dt>
              <dd>{currentCourse.mode === "weighted" ? `${result.activeWeight.toFixed(1)}%` : "N/A"}</dd>
            </div>
            <div>
              <dt>{messages.scale}</dt>
              <dd>{scale?.name ?? messages.unknown}</dd>
            </div>
          </dl>
        </Card>
      </div>
      <Card
        title={messages.assignmentsTitle}
        actions={
          <Button variant="secondary" onClick={() => navigate(`/what-if/${currentCourse.id}`)}>
            {messages.openWhatIf}
          </Button>
        }
      >
        {currentCourse.assignments.length === 0 ? (
          <EmptyState title={messages.noAssignments} description={messages.noAssignmentsHint} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{messages.whatIfAssignment}</th>
                  <th>{messages.category}</th>
                  <th>{messages.score}</th>
                  <th>{messages.percent}</th>
                  <th>{messages.due}</th>
                  <th>{messages.actions}</th>
                </tr>
              </thead>
              <tbody>
                {currentCourse.assignments.map((assignment) => {
                  const percent = (assignment.score / assignment.maxScore) * 100;
                  return (
                    <tr key={assignment.id}>
                      <td>{assignment.name}</td>
                      <td>{categoryNames[assignment.categoryId]}</td>
                      <td>
                        {assignment.score} / {assignment.maxScore}
                      </td>
                      <td>{percent.toFixed(1)}%</td>
                      <td>{assignment.dueDate ?? "—"}</td>
                      <td>
                        <div className="button-row">
                          <Button variant="ghost" onClick={() => setEditingAssignment(assignment)}>
                            {messages.edit}
                          </Button>
                          <Button variant="ghost" onClick={() => deleteAssignment(assignment)}>
                            {messages.delete}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <div className="two-column">
        <Card title={messages.scoreTrend}>
          <TrendChart assignments={currentCourse.assignments} />
        </Card>
        <Card title={messages.categoryContribution}>
          <ContributionChart results={result.categoryResults} names={categoryNames} />
        </Card>
      </div>
      <Card title={messages.dangerZone}>
        <p>{messages.deleteCourseHelp}</p>
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm(messages.deleteCourseConfirm(currentCourse.name))) {
              dispatch({ type: "course/delete", id: currentCourse.id });
              navigate("/dashboard");
            }
          }}
        >
          {messages.deleteCourse}
        </Button>
      </Card>
      <Modal
        title={messages.addAssignment}
        open={assignmentOpen}
        onClose={() => setAssignmentOpen(false)}
        closeLabel={messages.cancel}
      >
        <AssignmentForm
          course={currentCourse}
          onSave={saveAssignment}
          onCancel={() => setAssignmentOpen(false)}
        />
      </Modal>
      <Modal
        title={messages.editAssignmentTitle}
        open={editingAssignment !== null}
        onClose={() => setEditingAssignment(null)}
        closeLabel={messages.cancel}
      >
        {editingAssignment && (
          <AssignmentForm
            course={currentCourse}
            initial={editingAssignment}
            onSave={saveAssignment}
            onCancel={() => setEditingAssignment(null)}
          />
        )}
      </Modal>
      <Modal
        title={messages.editCourseTitle}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        closeLabel={messages.cancel}
      >
        <CourseForm
          scales={data.gradeScales}
          initial={currentCourse}
          onCancel={() => setEditOpen(false)}
          onSave={(updated) => {
            dispatch({ type: "course/update", course: updated });
            setEditOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
