import type { AppData, GradeScaleProfile } from "./types";
export const DEFAULT_SCALE: GradeScaleProfile = {id:"standard-4",name:"Standard 4.0",bands:[
{id:"a",label:"A",minPercent:90,gpaPoints:4},{id:"b",label:"B",minPercent:80,gpaPoints:3},
{id:"c",label:"C",minPercent:70,gpaPoints:2},{id:"d",label:"D",minPercent:60,gpaPoints:1},
{id:"f",label:"F",minPercent:0,gpaPoints:0}]};
export function createDefaultData(now=new Date().toISOString()):AppData{return{schemaVersion:1,courses:[],gradeScales:[structuredClone(DEFAULT_SCALE)],settings:{theme:"system",reducedMotion:false,compactMode:false,onboardingComplete:false},lastUpdatedAt:now};}
