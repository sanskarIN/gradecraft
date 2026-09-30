import { fireEvent,render,screen } from "@testing-library/react";
import { beforeEach,describe,expect,it,vi } from "vitest";
import { Modal } from "../src/components/Modal";

describe("Modal",()=>{
  beforeEach(()=>{
    Object.defineProperty(HTMLDialogElement.prototype,"showModal",{configurable:true,value:function(this:HTMLDialogElement){this.setAttribute("open","");}});
    Object.defineProperty(HTMLDialogElement.prototype,"close",{configurable:true,value:function(this:HTMLDialogElement){this.removeAttribute("open");}});
  });

  it("uses its heading as the dialog name and exposes the supplied localized close label",()=>{
    render(<Modal title="Create course" open onClose={()=>undefined} closeLabel="Cancel"><p>Dialog body</p></Modal>);
    expect(screen.getByRole("dialog",{name:"Create course"})).toBeInTheDocument();
    expect(screen.getByRole("button",{name:"Cancel"})).toBeInTheDocument();
  });

  it("invokes the controlled close handler once from the close control",()=>{
    const onClose=vi.fn();
    render(<Modal title="Edit course" open onClose={onClose} closeLabel="Dismiss"><p>Dialog body</p></Modal>);
    fireEvent.click(screen.getByRole("button",{name:"Dismiss"}));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("routes the native cancel event through the controlled close handler",()=>{
    const onClose=vi.fn();
    render(<Modal title="Edit assignment" open onClose={onClose} closeLabel="Cancel"><p>Dialog body</p></Modal>);
    const dialog=screen.getByRole("dialog",{name:"Edit assignment"});
    fireEvent(dialog,new Event("cancel",{bubbles:false,cancelable:true}));
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

    fireEvent(dialog!, new Event("cancel", { bubbles: true, cancelable: true }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
