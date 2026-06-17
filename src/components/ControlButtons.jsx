import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

export default function ControlButtons({ hasCount, pieces, tons, onUndo, onReset }) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleResetClick() {
    if (!hasCount) return;
    setShowConfirm(true);
  }

  function handleConfirm() {
    setShowConfirm(false);
    onReset();
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  return (
    <>
      <div className="control-row">
        <button
          id="undo-btn"
          className="ctrl-btn"
          onClick={onUndo}
          disabled={!hasCount}
          aria-label="Undo last count"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 14 4 9 9 4" />
            <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
          </svg>
          Undo
        </button>
        <button
          id="reset-btn"
          className="ctrl-btn danger"
          onClick={handleResetClick}
          disabled={!hasCount}
          aria-label="Reset session"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 .49-3" />
          </svg>
          Reset
        </button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        pieces={pieces}
        tons={tons}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
