import { useEffect, useId, useRef, type PropsWithChildren } from "react";
import { Button } from "./Button";

export function Modal({
  title,
  open,
  onClose,
  closeLabel,
  children,
}: PropsWithChildren<{ title: string; open: boolean; onClose: () => void; closeLabel: string }>) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    if (!open && dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
    >
      <div className="modal__header">
        <h2 id={titleId}>{title}</h2>
        <Button variant="ghost" onClick={onClose} aria-label={closeLabel}>
          ×
        </Button>
      </div>
      {children}
    </dialog>
  );
}
