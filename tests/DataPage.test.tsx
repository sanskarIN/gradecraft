import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/data/encryptedBackup", () => ({
  createEncryptedBackup: vi.fn(async () => '{"format":"gradecraft-encrypted-backup"}'),
  parseEncryptedBackup: vi.fn(),
  encryptedBackupPolicy: { minimumPassphraseLength: 8, iterations: 210000 },
}));

vi.mock("../src/utils/download", () => ({
  downloadText: vi.fn(async () => true),
}));

import { createBackup } from "../src/data/backup";
import { createDefaultData } from "../src/domain/defaults";
import { DataPage } from "../src/pages/DataPage";
import { AppProvider } from "../src/state/AppContext";

function fileWithText(name: string, content: string): File {
  const file = new File(["fixture"], name, { type: "application/json" });
  Object.defineProperty(file, "text", { value: async () => content });
  return file;
}

describe("DataPage data safety", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clears passphrase fields after a successful encrypted export", async () => {
    render(
      <AppProvider>
        <DataPage />
      </AppProvider>,
    );
    const passphrase = screen.getByLabelText("Backup passphrase");
    const confirm = screen.getByLabelText("Confirm passphrase");
    fireEvent.change(passphrase, { target: { value: "correct horse battery staple" } });
    fireEvent.change(confirm, { target: { value: "correct horse battery staple" } });
    fireEvent.click(screen.getByRole("button", { name: "Export encrypted backup" }));
    await waitFor(() => expect(screen.getByText(/Encrypted backup created/)).toBeInTheDocument());
    expect(passphrase).toHaveValue("");
    expect(confirm).toHaveValue("");
  });

  it("does not replace local data when restore confirmation is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const restored = createDefaultData("2026-08-19T00:00:00.000Z");
    restored.settings.language = "hi";
    const { container } = render(
      <AppProvider>
        <DataPage />
      </AppProvider>,
    );
    const standardInput = container.querySelector(
      'input[type="file"][accept=".json,application/json"]',
    );
    expect(standardInput).not.toBeNull();
    fireEvent.change(standardInput!, {
      target: { files: [fileWithText("backup.json", createBackup(restored))] },
    });
    await waitFor(() =>
      expect(
        screen.getByText("Restore cancelled. Current local data was not changed."),
      ).toBeInTheDocument(),
    );
    expect(screen.getByRole("heading", { name: "Import & export" })).toBeInTheDocument();
    expect(window.confirm).toHaveBeenCalledTimes(1);
  });
});
