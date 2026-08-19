import type { AppData } from "./types";
export type ScaleDeletionBlockReason="missing"|"last-scale"|"in-use"|null;
export function scaleDeletionBlockReason(data:Pick<AppData,"courses"|"gradeScales">,scaleId:string):ScaleDeletionBlockReason{if(!data.gradeScales.some((scale)=>scale.id===scaleId))return"missing";if(data.gradeScales.length<=1)return"last-scale";if(data.courses.some((course)=>course.scaleId===scaleId))return"in-use";return null;}
export function canDeleteScale(data:Pick<AppData,"courses"|"gradeScales">,scaleId:string):boolean{return scaleDeletionBlockReason(data,scaleId)===null;}
