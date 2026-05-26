export function LoadingSpinner({ text = '查询中...' }: { text?: string }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}
