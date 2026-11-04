import { useEffect, useRef } from "react";
import "./ExperienceDialog.css";
export default function ExperienceDialog({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!open) return;
    const previous = document.activeElement;
    dialog.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = oldOverflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className="ew-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="ew-dialog-title"
    >
      <div className="ew-dialog-inner">
        <div className="ew-dialog-heading">
          <h2 id="ew-dialog-title">{title}</h2>
          <button type="button" aria-label="Close estimate" onClick={onClose}>
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
