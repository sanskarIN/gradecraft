import type { AppData } from "../domain/types";
import { migrateData } from "./migrations";
interface BackupEnvelope{format:"gradecraft-backup";formatVersion:1;exportedAt:string;data:AppData;}
export function createBackup(data:AppData,now=new Date().toISOString()):string{const envelope:BackupEnvelope={format:"gradecraft-backup",formatVersion:1,exportedAt:now,data};return JSON.stringify(envelope,null,2);}
export function parseBackup(raw:string):AppData{const parsed:unknown=JSON.parse(raw);if(!parsed||typeof parsed!=="object")throw new Error("Backup is not a JSON object.");const envelope=parsed as Partial<BackupEnvelope>;if(envelope.format!=="gradecraft-backup"||envelope.formatVersion!==1||!envelope.data)throw new Error("Unsupported GradeCraft backup format.");return migrateData(envelope.data);}
