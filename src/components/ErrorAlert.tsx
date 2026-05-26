export function ErrorAlert({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div className="error-alert">
      <span>{message}</span>
      {onDismiss && (
        <button className="error-dismiss" onClick={onDismiss}>
          &times;
        </button>
      )}
    </div>
  );
}
