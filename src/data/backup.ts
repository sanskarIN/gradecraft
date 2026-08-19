import type { AppData } from "../domain/types";
import { UserFacingError } from "../errors/UserFacingError";
import { migrateData } from "./migrations";
interface BackupEnvelope{format:"gradecraft-backup";formatVersion:1;exportedAt:string;data:AppData;}
export function createBackup(data:AppData,now=new Date().toISOString()):string{const envelope:BackupEnvelope={format:"gradecraft-backup",formatVersion:1,exportedAt:now,data};return JSON.stringify(envelope,null,2);}
export function parseBackup(raw:string):AppData{let parsed:unknown;try{parsed=JSON.parse(raw);}catch{throw new UserFacingError("Backup is not valid JSON.");}if(!parsed||typeof parsed!=="object")throw new UserFacingError("Backup is not a JSON object.");const envelope=parsed as Partial<BackupEnvelope>;if(envelope.format!=="gradecraft-backup"||envelope.formatVersion!==1||!envelope.data)throw new UserFacingError("Unsupported GradeCraft backup format.");try{return migrateData(envelope.data);}catch{throw new UserFacingError("Backup data is invalid or incompatible with this version of GradeCraft.");}}
