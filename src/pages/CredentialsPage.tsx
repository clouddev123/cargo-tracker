import { useState } from 'react';
import { useAuthStore } from '../stores/authStore.js';
import { ErrorAlert } from '../components/ErrorAlert.js';

export function CredentialsPage() {
  const { hasCredentials, username, unitname, saveCredentials, error } = useAuthStore();
  const [cookie, setCookie] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await saveCredentials(cookie);
    setSaving(false);
  };

  return (
    <div className="page">
      <h1 className="page-title">系统配置</h1>

      <div className="card">
        <h3 className="card-title">95306 认证凭证</h3>
        <p className="form-hint" style={{ marginBottom: 20 }}>
          在浏览器中登录 ec.95306.cn 后，从 DevTools → Application → Cookies 复制完整的 Cookie 字符串即可。
        </p>

        {hasCredentials && (
          <div className="cred-status connected" style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
            padding: '10px 14px', background: 'var(--success-light)', borderRadius: 'var(--radius-sm)',
            border: '1px solid #bbf7d0',
          }}>
            <span className="status-dot" />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#16a34a' }}>
              已配置 - {username} ({unitname})
            </span>
          </div>
        )}

        {error && <ErrorAlert message={error} />}

        <div className="form-group">
          <label className="form-label">Cookie 字符串</label>
          <textarea
            className="form-textarea"
            placeholder={`从浏览器复制完整的 Cookie 字符串，例如：\n95306-1.6.10-accessToken=eyJhbG...; 95306-1.6.10-userdo=%7B%22userName%22%3A...`}
            value={cookie}
            onChange={(e) => setCookie(e.target.value)}
            rows={6}
          />
          <div className="form-hint" style={{ marginTop: 6 }}>
            系统会自动解析 <code>95306-1.6.10-accessToken</code> 和 <code>95306-1.6.10-userdo</code>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave} disabled={saving || !cookie.trim()}>
          {saving ? '保存中...' : '保存配置'}
        </button>
      </div>
    </div>
  );
}
