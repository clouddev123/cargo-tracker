import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore.js';

const navItems = [
  { to: '/', end: true, icon: '🔍', label: '运踪查询' },
  { to: '/box-numbers', icon: '📦', label: '箱号管理' },
  { to: '/history', icon: '🕐', label: '查询历史' },
  { to: '/credentials', icon: '⚙️', label: '系统配置' },
];

export function Sidebar() {
  const { hasCredentials, username, unitname } = useAuthStore();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">铁</div>
        <div className="sidebar-brand-text">
          <h2>货运追踪</h2>
          <span>95306 铁路物流</span>
        </div>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        {hasCredentials ? (
          <div className="cred-status connected">
            <span className="status-dot" />
            <div>
              <div className="status-label">95306 已连接</div>
              <div className="status-detail">{username} · {unitname}</div>
            </div>
          </div>
        ) : (
          <div className="cred-status disconnected">
            <span className="status-dot" />
            <div>
              <div className="status-label">95306 未配置</div>
              <div className="status-detail">请先配置认证凭证</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
