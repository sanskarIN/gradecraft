export const settingsEn={
  scaleDelete:"Delete profile",
  scaleDeleteBlockedUsed:"This grading scale is used by at least one course. Move those courses to another scale before deleting it.",
  scaleDeleteBlockedLast:"GradeCraft must keep at least one grading scale profile.",
  scaleDeleteConfirm:(name:string)=>`Delete the grading scale “${name}”? This cannot be undone.`,
  scaleDeleted:(name:string)=>`Deleted grading scale “${name}”.`,
} as const;
