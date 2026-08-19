import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { storageKeys } from "../src/data/storage";
import { AppProvider, useApp } from "../src/state/AppContext";

function ResetHarness() {
  const { resetPersistedData } = useApp();
  return <button onClick={resetPersistedData}>Delete local data</button>;
}

describe("AppContext privacy reset", () => {
  beforeEach(() => localStorage.clear());

  it("does not immediately repersist data after explicit delete-all", async () => {
    render(<AppProvider><ResetHarness /></AppProvider>);
    await waitFor(() => expect(localStorage.getItem(storageKeys().primary)).not.toBeNull());
    fireEvent.click(screen.getByRole("button", { name: "Delete local data" }));
    await waitFor(() => {
      expect(localStorage.getItem(storageKeys().primary)).toBeNull();
      expect(localStorage.getItem(storageKeys().recovery)).toBeNull();
    });
  });
});
