import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.js';
import { TrackSearchPage } from './pages/TrackSearchPage.js';
import { TrajectoryPage } from './pages/TrajectoryPage.js';
import { HistoryPage } from './pages/HistoryPage.js';
import { CredentialsPage } from './pages/CredentialsPage.js';
import { BoxNumberManagePage } from './pages/BoxNumberManagePage.js';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TrackSearchPage />} />
          <Route path="/trajectory/:ydid" element={<TrajectoryPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/box-numbers" element={<BoxNumberManagePage />} />
          <Route path="/credentials" element={<CredentialsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
