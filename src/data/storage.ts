import { createDefaultData } from "../domain/defaults";
import type { AppData } from "../domain/types";
import { log } from "./logger";
import { migrateData } from "./migrations";

const STORAGE_KEY = "gradecraft:data:v1";
const BACKUP_KEY = "gradecraft:data:recovery:v1";

type StorageRead = { ok: true; value: string | null } | { ok: false };

function errorKind(error: unknown): string {
  return error instanceof Error ? error.name : "unknown";
}

function readRecord(storage: Storage, key: string, event: string): StorageRead {
  try {
    return { ok: true, value: storage.getItem(key) };
  } catch (error) {
    log("error", event, { kind: errorKind(error) });
    return { ok: false };
  }
}

function clearCorruptRecords(storage: Storage): void {
  try {
    storage.removeItem(STORAGE_KEY);
    storage.removeItem(BACKUP_KEY);
  } catch (error) {
    log("error", "storage_corrupt_clear_failed", { kind: errorKind(error) });
  }
}

function repairPrimary(storage: Storage, recovery: string): void {
  try {
    storage.setItem(STORAGE_KEY, recovery);
  } catch (error) {
    log("error", "storage_primary_repair_failed", { kind: errorKind(error) });
  }
}

export function loadData(storage: Storage = localStorage): AppData {
  const primary = readRecord(storage, STORAGE_KEY, "storage_primary_read_failed");
  if (!primary.ok || !primary.value) return createDefaultData();

  try {
    return migrateData(JSON.parse(primary.value) as unknown);
  } catch (error) {
    log("error", "storage_load_failed", { kind: errorKind(error) });
  }

  const recovery = readRecord(storage, BACKUP_KEY, "storage_recovery_read_failed");
  if (!recovery.ok) return createDefaultData();

  if (recovery.value) {
    try {
      const recovered = migrateData(JSON.parse(recovery.value) as unknown);
      repairPrimary(storage, recovery.value);
      return recovered;
    } catch (recoveryError) {
      log("error", "storage_recovery_failed", { kind: errorKind(recoveryError) });
    }
  }

  clearCorruptRecords(storage);
  return createDefaultData();
}

export function saveData(data: AppData, storage: Storage = localStorage): boolean {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current) storage.setItem(BACKUP_KEY, current);
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    log("error", "storage_save_failed", { kind: errorKind(error) });
    return false;
  }
}

export function clearData(storage: Storage = localStorage): boolean {
  try {
    storage.removeItem(STORAGE_KEY);
    storage.removeItem(BACKUP_KEY);
    return true;
  } catch (error) {
    log("error", "storage_clear_failed", { kind: errorKind(error) });
    return false;
  }
}

export function storageKeys() {
  return { primary: STORAGE_KEY, recovery: BACKUP_KEY };
}
