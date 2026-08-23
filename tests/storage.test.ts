import { describe, expect, it } from "vitest";
import { createDefaultData } from "../src/domain/defaults";
import { clearData, loadData, saveData, storageKeys } from "../src/data/storage";

function storageDouble(overrides: Partial<Storage> = {}): Storage {
  return {
    length: 0,
    clear: () => undefined,
    getItem: () => null,
    key: () => null,
    removeItem: () => undefined,
    setItem: () => undefined,
    ...overrides,
  };
}

describe("local storage", () => {
  it("saves and loads data", () => {
    const storage = window.localStorage;
    clearData(storage);
    const data = createDefaultData("2026-01-01T00:00:00.000Z");
    saveData(data, storage);
    expect(loadData(storage)).toEqual(data);
  });

  it("keeps the previous primary state as a recovery snapshot", () => {
    const storage = window.localStorage;
    const { primary, recovery } = storageKeys();
    clearData(storage);
    const first = createDefaultData("2026-01-01T00:00:00.000Z");
    const second = createDefaultData("2026-02-01T00:00:00.000Z");
    saveData(first, storage);
    saveData(second, storage);
    expect(storage.getItem(recovery)).toBe(JSON.stringify(first));
    expect(storage.getItem(primary)).toBe(JSON.stringify(second));
  });

  it("repairs a corrupt primary record from a valid recovery snapshot", () => {
    const storage = window.localStorage;
    const { primary, recovery } = storageKeys();
    clearData(storage);
    const recovered = createDefaultData("2026-03-01T00:00:00.000Z");
    const rawRecovery = JSON.stringify(recovered);
    storage.setItem(primary, "{broken");
    storage.setItem(recovery, rawRecovery);
    expect(loadData(storage)).toEqual(recovered);
    expect(storage.getItem(primary)).toBe(rawRecovery);
    expect(storage.getItem(recovery)).toBe(rawRecovery);
  });

  it("clears corrupt records before returning a clean default", () => {
    const storage = window.localStorage;
    const { primary, recovery } = storageKeys();
    clearData(storage);
    storage.setItem(primary, "{broken");
    storage.setItem(recovery, "{also-broken");
    const loaded = loadData(storage);
    expect(loaded.schemaVersion).toBe(1);
    expect(storage.getItem(primary)).toBeNull();
    expect(storage.getItem(recovery)).toBeNull();
  });

  it("clears an unrecoverable corrupt primary when no recovery exists", () => {
    const storage = window.localStorage;
    const { primary, recovery } = storageKeys();
    clearData(storage);
    storage.setItem(primary, "{broken");
    expect(loadData(storage).schemaVersion).toBe(1);
    expect(storage.getItem(primary)).toBeNull();
    expect(storage.getItem(recovery)).toBeNull();
  });

  it("returns safe default data when primary storage access is denied", () => {
    const storage = storageDouble({
      getItem: () => {
        throw new DOMException("Storage access denied", "SecurityError");
      },
    });

    expect(loadData(storage).schemaVersion).toBe(1);
  });

  it("does not erase corrupt records when recovery inspection is interrupted", () => {
    const { primary, recovery } = storageKeys();
    let removeCalls = 0;
    const storage = storageDouble({
      getItem: (key) => {
        if (key === primary) return "{broken";
        if (key === recovery) throw new DOMException("Storage access denied", "SecurityError");
        return null;
      },
      removeItem: () => {
        removeCalls += 1;
      },
    });

    expect(loadData(storage).schemaVersion).toBe(1);
    expect(removeCalls).toBe(0);
  });

  it("reports a failed local-data clear without throwing", () => {
    const storage = storageDouble({
      removeItem: () => {
        throw new DOMException("Storage access denied", "SecurityError");
      },
    });

    expect(clearData(storage)).toBe(false);
  });
});
