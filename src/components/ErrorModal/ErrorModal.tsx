import React from "react";
import styles from "./ErrorModal.module.css";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p className={styles.message}>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>
          Oke
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
