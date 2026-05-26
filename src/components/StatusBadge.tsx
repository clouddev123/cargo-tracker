const STATUS_COLORS: Record<string, string> = {
  '05': 'delivered',
  '80': 'delivered',
  '70': 'arrived',
  '85': 'received',
};

const STATUS_LABELS: Record<string, string> = {
  '05': '已交付',
  '80': '已交付',
  '70': '已卸车',
  '85': '确认收货',
};

export function StatusBadge({ code, label }: { code: string; label: string }) {
  const color = STATUS_COLORS[code] || 'default';
  return (
    <span className={`status-badge status-${color}`}>
      {STATUS_LABELS[code] || label || code}
    </span>
  );
}
