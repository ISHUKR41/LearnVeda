import React from "react";
import styles from "../AppState.module.css";

export default function Class9Loading() {
  return (
    <div className={styles.statePage}>
      <div className={styles.stateCard} aria-busy="true" aria-live="polite">
        <div className={styles.stateIcon} />
        <p className={styles.stateText}>Loading Class 9 Curriculum...</p>
        <div className={styles.loadingRows}>
          <span className={styles.loadingRow} />
          <span className={styles.loadingRow} />
          <span className={styles.loadingRow} />
        </div>
      </div>
    </div>
  );
}
