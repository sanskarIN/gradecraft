import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../src/App";
import { AppProvider } from "../src/state/AppContext";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = "#/dashboard";
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders onboarding for first-run users", () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>,
    );
    expect(screen.getByRole("heading", { name: "Welcome to GradeCraft" })).toBeInTheDocument();
  });

  it("exposes primary navigation", () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>,
    );
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  });

  it("marks a course-specific what-if route as the current planner navigation item", () => {
    window.location.hash = "#/what-if/course-1";
    render(
      <AppProvider>
        <App />
      </AppProvider>,
    );

    expect(screen.getByRole("link", { name: "What-if" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Overview" })).not.toHaveAttribute("aria-current");
  });

  it("warns when changes cannot be persisted locally", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage access denied", "SecurityError");
    });

    render(
      <AppProvider>
        <App />
      </AppProvider>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Changes could not be saved to this device");
  });
});
