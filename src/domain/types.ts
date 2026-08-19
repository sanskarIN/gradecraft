export type ThemePreference = "light" | "dark" | "system";
export type CourseMode = "weighted" | "points";
export type Locale = "en" | "hi";

export interface Category { id:string; name:string; weight:number; }
export interface Assignment { id:string; name:string; categoryId:string; score:number; maxScore:number; dueDate?:string; createdAt:string; updatedAt:string; }
export interface GradeBand { id:string; label:string; minPercent:number; gpaPoints:number; }
export interface GradeScaleProfile { id:string; name:string; bands:GradeBand[]; }
export interface Course { id:string; name:string; code:string; semester?:string; color:string; creditHours:number; mode:CourseMode; scaleId:string; categories:Category[]; assignments:Assignment[]; createdAt:string; updatedAt:string; }
export interface Settings { theme:ThemePreference; language?:Locale; reducedMotion:boolean; compactMode:boolean; onboardingComplete:boolean; }
export interface AppData { schemaVersion:1; courses:Course[]; gradeScales:GradeScaleProfile[]; settings:Settings; lastUpdatedAt:string; }
export interface CategoryResult { categoryId:string; earned:number; possible:number; percent:number|null; weight:number; contribution:number; }
export interface GradeResult { percent:number|null; earned:number; possible:number; contribution:number; activeWeight:number; categoryResults:CategoryResult[]; }
export interface GpaCourseResult { courseId:string; points:number|null; credits:number; }
export interface GpaResult { gpa:number|null; qualityPoints:number; attemptedCredits:number; courses:GpaCourseResult[]; }
