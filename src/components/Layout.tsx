import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { useAuthStore } from '../stores/authStore.js';
import { useEffect } from 'react';

export function Layout() {
  const checkStatus = useAuthStore((s) => s.checkStatus);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
