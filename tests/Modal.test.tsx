import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "../src/components/Modal";

describe("Modal", () => {
  it("associates the dialog with its visible heading and explicit close label", () => {
    const { container } = render(
      <Modal title="Edit course" open={false} onClose={() => undefined} closeLabel="Cancel">
        <p>Course form</p>
      </Modal>,
    );

    const dialog = container.querySelector("dialog");
    const heading = container.querySelector("h2");
    const closeButton = container.querySelector("button");

    expect(dialog).not.toBeNull();
    expect(heading).not.toBeNull();
    expect(closeButton).not.toBeNull();
    expect(heading?.id).not.toBe("");
    expect(dialog).toHaveAttribute("aria-labelledby", heading?.id);
    expect(closeButton).toHaveAttribute("aria-label", "Cancel");
  });

  it("handles a native cancel request exactly once", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal title="Edit course" open={false} onClose={onClose} closeLabel="Cancel">
        <p>Course form</p>
      </Modal>,
    );
    const dialog = container.querySelector("dialog");
    expect(dialog).not.toBeNull();

    fireEvent.cancel(dialog!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
