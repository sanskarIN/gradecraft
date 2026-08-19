import type { AppData } from "../domain/types";
import { isAppData } from "./schema";
export function migrateData(value:unknown):AppData{if(!value||typeof value!=="object")throw new Error("Stored data is not an object.");const schemaVersion=(value as {schemaVersion?:unknown}).schemaVersion;if(schemaVersion!==1)throw new Error(`Unsupported GradeCraft schema version: ${String(schemaVersion)}.`);if(!isAppData(value))throw new Error("GradeCraft data failed schema validation.");return value;}
