function StatusModal({
  isOpen,
  type = "confirm",
  description,
  amountText,
  statusText,
  primaryText,
  onPrimary,
  secondaryText,
  onSecondary,
}) {
  if (!isOpen) return null;

  const iconMap = {
    confirm: "▣",
    success: "✓",
    error: "✕",
  };

  return (
    <div className="status-modal-overlay" role="dialog" aria-modal="true">
      <div className="status-modal-card">
        <div className={`status-modal-icon status-modal-icon-${type}`}>{iconMap[type] || "!"}</div>
        {description && <p className="status-modal-description">{description}</p>}
        {amountText && <h3 className="status-modal-amount">{amountText}</h3>}
        {statusText && <p className="status-modal-state">{statusText}</p>}

        {primaryText && (
          <button type="button" className="status-modal-action status-modal-action-primary" onClick={onPrimary}>
            {primaryText}
          </button>
        )}
        {secondaryText && (
          <button type="button" className="status-modal-action status-modal-action-secondary" onClick={onSecondary}>
            {secondaryText}
          </button>
        )}
      </div>
    </div>
  );
}

export default StatusModal;
