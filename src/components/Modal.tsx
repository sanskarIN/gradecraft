import { useEffect, useId, useRef, type PropsWithChildren } from "react";
import { Button } from "./Button";

export function Modal({
  title,
  open,
  onClose,
  closeLabel,
  children,
}: PropsWithChildren<{ title: string; open: boolean; onClose: () => void; closeLabel?: string }>) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
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
        <Button variant="ghost" onClick={onClose} aria-label={closeLabel ?? title}>
          ×
        </Button>
      </div>
      {children}
    </dialog>
  );
}
