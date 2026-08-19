export const dataTransferEn={
  readingBackup:"Reading and validating backup…",
  readingCsv:"Reading and validating CSV…",
  categoryWeightConflict:(name:string,current:number,imported:number)=>`CSV category “${name}” uses ${imported}% weight, but the current course uses ${current}%. Update the course or CSV so they match before importing.`,
  unexpectedBackup:"This backup could not be read safely. Verify that it is a GradeCraft JSON backup and try again.",
  unexpectedCsv:"This CSV file could not be read safely. Verify the file contents and try again.",
} as const;
