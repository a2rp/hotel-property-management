import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Dialog = ({ title, description, onClose, children, size = "medium" }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const panel = panelRef.current;
    const target = panel?.querySelector("[data-dialog-initial], input, select, textarea, button");
    target?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panel) {
        const focusable = [...panel.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("dialog-open");
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.classList.remove("dialog-open"); };
  }, [onClose]);

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={panelRef} className={`${styles.dialog} ${styles[size]}`} role="dialog" aria-modal="true" aria-labelledby="hotel-dialog-title" aria-describedby={description ? "hotel-dialog-description" : undefined}>
        <header className={styles.header}>
          <div><h2 id="hotel-dialog-title">{title}</h2>{description && <p id="hotel-dialog-description">{description}</p>}</div>
          <button className={styles.close} type="button" onClick={onClose} aria-label="Close dialog"><FiX aria-hidden="true" /></button>
        </header>
        <div className={styles.content}>{children}</div>
      </section>
    </div>
  );
};

export default Dialog;
