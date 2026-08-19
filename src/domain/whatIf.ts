import { calculateCourseGrade } from "./gradeMath";
import type { Assignment, Course } from "./types";
export type ScoreOverrides=Record<string,number>;
export function applyScoreOverrides(course:Course,overrides:ScoreOverrides):Course{return{...course,assignments:course.assignments.map((a)=>Object.hasOwn(overrides,a.id)?{...a,score:overrides[a.id]??a.score}:a)};}
export function calculateWhatIf(course:Course,overrides:ScoreOverrides){return calculateCourseGrade(applyScoreOverrides(course,overrides));}
export function requiredPointsScore(course:Course,targetPercent:number,futureMaxScore:number):number|null{if(course.mode!=="points"||!Number.isFinite(targetPercent)||!Number.isFinite(futureMaxScore)||futureMaxScore<=0)return null;const earned=course.assignments.reduce((s,a)=>s+a.score,0);const possible=course.assignments.reduce((s,a)=>s+a.maxScore,0);return(targetPercent/100)*(possible+futureMaxScore)-earned;}
export function createHypotheticalAssignment(categoryId:string,score:number,maxScore:number,now=new Date().toISOString()):Assignment{return{id:`whatif-${crypto.randomUUID()}`,name:"Hypothetical assignment",categoryId,score,maxScore,createdAt:now,updatedAt:now};}
