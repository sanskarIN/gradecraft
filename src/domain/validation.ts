import type { Assignment, Category, Course, GradeScaleProfile } from "./types";

export type ValidationIssueCode=
  |"categories.required"
  |"categories.nameRequired"
  |"categories.nameUnique"
  |"categories.weightRange"
  |"categories.idUnique"
  |"categories.total100"
  |"assignment.nameRequired"
  |"assignment.maxScorePositive"
  |"assignment.scoreNonNegative"
  |"assignment.scoreWithinMaximum"
  |"assignment.categoryValid"
  |"scale.nameRequired"
  |"scale.bandsRequired"
  |"scale.bandLabelRequired"
  |"scale.bandLabelUnique"
  |"scale.bandIdUnique"
  |"scale.minimumPercentRange"
  |"scale.minimumPercentUnique"
  |"scale.gpaPointsRange"
  |"scale.zeroFloorRequired";

export interface ValidationIssue{field:string;code:ValidationIssueCode;message:string;values?:Readonly<Record<string,number|string>>;}

function issue(field:string,code:ValidationIssueCode,message:string,values?:ValidationIssue["values"]):ValidationIssue{return{field,code,message,...(values?{values}:{})};}

export function validateCategories(categories:Category[],mode:Course["mode"]):ValidationIssue[]{const issues:ValidationIssue[]=[];if(categories.length===0){issues.push(issue("categories","categories.required","At least one category is required."));return issues;}const ids=new Set<string>(),names=new Set<string>();for(const [index,c] of categories.entries()){const normalizedName=c.name.trim().toLowerCase();if(!normalizedName)issues.push(issue(`categories.${index}.name`,"categories.nameRequired","Category name is required."));else if(names.has(normalizedName))issues.push(issue(`categories.${index}.name`,"categories.nameUnique","Category names must be unique."));names.add(normalizedName);if(!Number.isFinite(c.weight)||c.weight<0||c.weight>100)issues.push(issue(`categories.${index}.weight`,"categories.weightRange","Category weight must be between 0 and 100."));if(ids.has(c.id))issues.push(issue(`categories.${index}.id`,"categories.idUnique","Category IDs must be unique."));ids.add(c.id);}if(mode==="weighted"){const total=categories.reduce((s,c)=>s+c.weight,0);if(Math.abs(total-100)>0.01)issues.push(issue("categories","categories.total100",`Weighted categories must total 100%. Current total: ${total.toFixed(2)}%.`,{total}));}return issues;}

export function validateAssignment(assignment:Pick<Assignment,"name"|"score"|"maxScore"|"categoryId">,course:Pick<Course,"categories">):ValidationIssue[]{const issues:ValidationIssue[]=[];if(!assignment.name.trim())issues.push(issue("name","assignment.nameRequired","Assignment name is required."));if(!Number.isFinite(assignment.maxScore)||assignment.maxScore<=0)issues.push(issue("maxScore","assignment.maxScorePositive","Maximum score must be greater than zero."));if(!Number.isFinite(assignment.score)||assignment.score<0)issues.push(issue("score","assignment.scoreNonNegative","Score cannot be negative."));if(Number.isFinite(assignment.score)&&Number.isFinite(assignment.maxScore)&&assignment.score>assignment.maxScore)issues.push(issue("score","assignment.scoreWithinMaximum","Score cannot exceed the maximum score."));if(!course.categories.some((c)=>c.id===assignment.categoryId))issues.push(issue("categoryId","assignment.categoryValid","Choose a valid category."));return issues;}

export function validateGradeScale(scale:GradeScaleProfile):ValidationIssue[]{const issues:ValidationIssue[]=[];if(!scale.name.trim())issues.push(issue("name","scale.nameRequired","Scale name is required."));if(scale.bands.length===0){issues.push(issue("bands","scale.bandsRequired","At least one grade band is required."));return issues;}const ids=new Set<string>(),labels=new Set<string>(),thresholds=new Set<number>();for(const [index,b] of scale.bands.entries()){const normalizedLabel=b.label.trim().toLowerCase();if(!normalizedLabel)issues.push(issue(`bands.${index}.label`,"scale.bandLabelRequired","Band label is required."));else if(labels.has(normalizedLabel))issues.push(issue(`bands.${index}.label`,"scale.bandLabelUnique","Band labels must be unique."));labels.add(normalizedLabel);if(ids.has(b.id))issues.push(issue(`bands.${index}.id`,"scale.bandIdUnique","Band IDs must be unique."));ids.add(b.id);if(!Number.isFinite(b.minPercent)||b.minPercent<0||b.minPercent>100)issues.push(issue(`bands.${index}.minPercent`,"scale.minimumPercentRange","Minimum percent must be between 0 and 100."));else if(thresholds.has(b.minPercent))issues.push(issue(`bands.${index}.minPercent`,"scale.minimumPercentUnique","Minimum percentages must be unique."));thresholds.add(b.minPercent);if(!Number.isFinite(b.gpaPoints)||b.gpaPoints<0||b.gpaPoints>10)issues.push(issue(`bands.${index}.gpaPoints`,"scale.gpaPointsRange","GPA points must be between 0 and 10."));}if(!scale.bands.some((band)=>band.minPercent===0))issues.push(issue("bands","scale.zeroFloorRequired","A grade scale must include a band starting at 0%."));return issues;}
