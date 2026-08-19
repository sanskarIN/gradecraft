import { createDefaultData } from "../domain/defaults";
import type { AppData } from "../domain/types";
import { log } from "./logger";
import { migrateData } from "./migrations";
const STORAGE_KEY="gradecraft:data:v1",BACKUP_KEY="gradecraft:data:recovery:v1";
function errorKind(error:unknown):string{return error instanceof Error?error.name:"unknown";}
function clearCorruptRecords(storage:Storage):void{try{storage.removeItem(STORAGE_KEY);storage.removeItem(BACKUP_KEY);}catch(error){log("error","storage_corrupt_clear_failed",{kind:errorKind(error)});}}
function repairPrimary(storage:Storage,recovery:string):void{try{storage.setItem(STORAGE_KEY,recovery);}catch(error){log("error","storage_primary_repair_failed",{kind:errorKind(error)});}}
export function loadData(storage:Storage=localStorage):AppData{const raw=storage.getItem(STORAGE_KEY);if(!raw)return createDefaultData();try{return migrateData(JSON.parse(raw) as unknown);}catch(error){log("error","storage_load_failed",{kind:errorKind(error)});const recovery=storage.getItem(BACKUP_KEY);if(recovery){try{const recovered=migrateData(JSON.parse(recovery) as unknown);repairPrimary(storage,recovery);return recovered;}catch(recoveryError){log("error","storage_recovery_failed",{kind:errorKind(recoveryError)});}}clearCorruptRecords(storage);return createDefaultData();}}
export function saveData(data:AppData,storage:Storage=localStorage):boolean{try{const current=storage.getItem(STORAGE_KEY);if(current)storage.setItem(BACKUP_KEY,current);storage.setItem(STORAGE_KEY,JSON.stringify(data));return true;}catch(error){log("error","storage_save_failed",{kind:errorKind(error)});return false;}}
export function clearData(storage:Storage=localStorage):void{storage.removeItem(STORAGE_KEY);storage.removeItem(BACKUP_KEY);}
export function storageKeys(){return{primary:STORAGE_KEY,recovery:BACKUP_KEY};}
