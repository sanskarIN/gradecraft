import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsPage } from "../src/pages/SettingsPage";
import { AppProvider } from "../src/state/AppContext";

describe("SettingsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("switches the interface to Hindi and updates document language", async () => {
    render(
      <AppProvider>
        <SettingsPage />
      </AppProvider>,
    );
    fireEvent.change(screen.getByLabelText("Language"), { target: { value: "hi" } });
    expect(screen.getByRole("heading", { name: "सेटिंग्स" })).toBeInTheDocument();
    await waitFor(() => expect(document.documentElement.lang).toBe("hi"));
  });

  it("protects the last scale and allows deleting an extra unused profile", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(
      <AppProvider>
        <SettingsPage />
      </AppProvider>,
    );
    expect(screen.getByRole("button", { name: "Delete profile" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "New profile" }));
    const dialog = screen.getByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Save profile" }));
    await waitFor(() => expect(screen.getByText("Custom 4.0")).toBeInTheDocument());
    const deleteButtons = screen.getAllByRole("button", { name: "Delete profile" });
    expect(deleteButtons).toHaveLength(2);
    expect(deleteButtons.every((button) => !button.hasAttribute("disabled"))).toBe(true);
    fireEvent.click(deleteButtons[1]!);
    await waitFor(() => expect(screen.queryByText("Custom 4.0")).not.toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Delete profile" })).toBeDisabled();
  });
});
