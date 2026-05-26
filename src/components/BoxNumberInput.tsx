import { useSearchStore } from '../stores/searchStore.js';

export function BoxNumberInput() {
  const { boxNumber, setBoxNumber, search, loading } = useSearchStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') search();
  };

  return (
    <div className="search-box">
      <div className="search-box-header">货物追踪查询</div>
      <div className="search-input-group">
        <input
          type="text"
          className="search-input"
          placeholder="输入箱号，例如: TRHU8340834"
          value={boxNumber}
          onChange={(e) => setBoxNumber(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="btn btn-primary btn-lg" onClick={() => search()} disabled={loading}>
          {loading ? '查询中...' : '查询'}
        </button>
      </div>
      <div className="search-hint">支持按箱号查询，系统将自动并行查询发货和收货两条线路</div>
    </div>
  );
}
