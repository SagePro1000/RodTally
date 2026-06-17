export default function ConfirmDialog({ open, onConfirm, onCancel, pieces, tons }) {
  if (!open) return null;

  return (
    <div className="dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="dialog-box">
        <div id="dialog-title" className="dialog-title">Save &amp; Reset?</div>
        <div className="dialog-body">
          This will save the current session ({pieces} pcs · {tons} t) to history and clear the tally board. This cannot be undone.
        </div>
        <div className="dialog-actions">
          <button
            id="confirm-cancel-btn"
            className="dialog-cancel"
            onClick={onCancel}
          >
            Keep Counting
          </button>
          <button
            id="confirm-reset-btn"
            className="dialog-confirm"
            onClick={onConfirm}
          >
            Save &amp; Reset
          </button>
        </div>
      </div>
    </div>
  );
}
