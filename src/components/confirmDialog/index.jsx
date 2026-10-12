import { FiAlertTriangle } from "react-icons/fi";
import Dialog from "../dialog";
import styles from "./styles.module.css";

const ConfirmDialog = ({ title, message, confirmLabel = "Remove", onConfirm, onCancel }) => (
  <Dialog title={title} description={message} onClose={onCancel} size="small">
    <div className={styles.notice}><FiAlertTriangle aria-hidden="true" /><p>This action cannot be undone in this demo.</p></div>
    <div className={styles.actions}>
      <button className={styles.cancel} type="button" data-dialog-initial onClick={onCancel}>Keep it</button>
      <button className={styles.danger} type="button" onClick={onConfirm}>{confirmLabel}</button>
    </div>
  </Dialog>
);

export default ConfirmDialog;
