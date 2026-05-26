import { BoxNumberInput } from '../components/BoxNumberInput.js';
import { CargoTrackTable } from '../components/CargoTrackTable.js';
import { LoadingSpinner } from '../components/LoadingSpinner.js';
import { ErrorAlert } from '../components/ErrorAlert.js';
import { useSearchStore } from '../stores/searchStore.js';

export function TrackSearchPage() {
  const {
    shippingResults,
    receivingResults,
    shippingTotal,
    receivingTotal,
    loading,
    error,
    activeTab,
    setActiveTab,
    clearResults,
  } = useSearchStore();

  const hasResults = shippingResults.length > 0 || receivingResults.length > 0;

  return (
    <div className="page">
      <h1 className="page-title">货物全程追踪</h1>

      <BoxNumberInput />

      {loading && <LoadingSpinner text="正在查询..." />}
      {error && <ErrorAlert message={error} onDismiss={clearResults} />}

      {hasResults && (
        <>
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">发货记录</span>
                <div className="stat-card-icon blue">📤</div>
              </div>
              <div className="stat-card-value">{shippingTotal}</div>
              <div className="stat-card-footer">发货需求号运单</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">收货记录</span>
                <div className="stat-card-icon green">📥</div>
              </div>
              <div className="stat-card-value">{receivingTotal}</div>
              <div className="stat-card-footer">收货需求号运单</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span className="stat-card-label">当前查看</span>
                <div className="stat-card-icon orange">📋</div>
              </div>
              <div className="stat-card-value">{activeTab === 'shipping' ? shippingTotal : receivingTotal}</div>
              <div className="stat-card-footer">{activeTab === 'shipping' ? '发货' : '收货'}标签页</div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="tab-bar">
              <button
                className={`tab ${activeTab === 'shipping' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                发货<span className="tab-badge">{shippingTotal}</span>
              </button>
              <button
                className={`tab ${activeTab === 'receiving' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('receiving')}
              >
                收货<span className="tab-badge">{receivingTotal}</span>
              </button>
            </div>
            {activeTab === 'shipping' && (
              <CargoTrackTable items={shippingResults} total={shippingTotal} />
            )}
            {activeTab === 'receiving' && (
              <CargoTrackTable items={receivingResults} total={receivingTotal} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
