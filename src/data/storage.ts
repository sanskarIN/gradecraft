import { createDefaultData } from "../domain/defaults";
import type { AppData } from "../domain/types";
import { log } from "./logger";
import { migrateData } from "./migrations";
const STORAGE_KEY="gradecraft:data:v1",BACKUP_KEY="gradecraft:data:recovery:v1";
function parseStoredData(raw:string):AppData{return migrateData(JSON.parse(raw) as unknown);}
export function loadData(storage:Storage=localStorage):AppData{try{const raw=storage.getItem(STORAGE_KEY);if(!raw)return createDefaultData();return parseStoredData(raw);}catch(error){log("error","storage_load_failed",{error:String(error)});try{const recovery=storage.getItem(BACKUP_KEY);if(recovery){const recovered=parseStoredData(recovery);try{storage.setItem(STORAGE_KEY,JSON.stringify(recovered));}catch(repairError){log("warn","storage_primary_repair_failed",{error:String(repairError)});}return recovered;}}catch(recoveryError){log("error","storage_recovery_failed",{error:String(recoveryError)});}return createDefaultData();}}
export function saveData(data:AppData,storage:Storage=localStorage):boolean{try{const current=storage.getItem(STORAGE_KEY);if(current){try{parseStoredData(current);storage.setItem(BACKUP_KEY,current);}catch{log("warn","storage_backup_skipped_invalid_primary");}}storage.setItem(STORAGE_KEY,JSON.stringify(data));return true;}catch(error){log("error","storage_save_failed",{error:String(error)});return false;}}
export function clearData(storage:Storage=localStorage):boolean{try{storage.removeItem(STORAGE_KEY);storage.removeItem(BACKUP_KEY);return true;}catch(error){log("error","storage_clear_failed",{error:String(error)});return false;}}
export function storageKeys(){return{primary:STORAGE_KEY,recovery:BACKUP_KEY};}
