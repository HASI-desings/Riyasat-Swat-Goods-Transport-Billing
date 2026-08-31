import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { credentialsMissing, checkSupabaseConnection, supabase } from './lib/supabaseClient';
import { useBranch } from './hooks/useBranch';
import BranchSelector from './components/BranchSelector';
import AdminLogin from './components/AdminLogin';
import NewBillPage from './pages/NewBillPage';
import SlipPreviewPage from './pages/SlipPreviewPage';
import SavedCustomersPage from './pages/SavedCustomersPage';
import BillHistoryPage from './pages/BillHistoryPage';
import SettingsPage from './pages/SettingsPage';

const ICONS = {
  bill: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2h9l3 3v17H6z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  ),
  customers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.3 3.1-6 7-6s7 2.7 7 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M17 14c2.8.4 5 2.6 5 5" />
    </svg>
  ),
  history: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1z" />
    </svg>
  ),
};

function SetupErrorScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="card" style={{ maxWidth: 420 }}>
        <h2>Setup needed</h2>
        <p style={{ color: 'var(--slate-300)', fontSize: '0.9rem' }}>
          This app can't connect to Supabase — the URL or anon key is missing
          or invalid. Add <code>VITE_SUPABASE_URL</code> and{' '}
          <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code> file
          (or your Vercel project's Environment Variables), then reload.
        </p>
        <button className="btn btn-primary btn-block" onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { branch, needsSelection, branches, selectBranch } = useBranch();
  const [connection, setConnection] = useState({ checked: false, ok: true });
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    if (credentialsMissing) return;
    checkSupabaseConnection().then((res) => setConnection({ checked: true, ...res }));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (credentialsMissing) return <SetupErrorScreen />;
  if (connection.checked && !connection.ok) return <SetupErrorScreen />;
  if (session === undefined) return null; // brief check, avoids a login flash
  if (!session) return <AdminLogin onSignedIn={setSession} />;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-name">Riyasat Swat Goods Transport</span>
          <span className="brand-branch">{branch ? `${branch.label} — ${branch.address}` : 'Select branch'}</span>
        </div>
      </header>

      <main className="app-main">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<NewBillPage branch={branch} />} />
            <Route path="/preview/:billId" element={<SlipPreviewPage branch={branch} />} />
            <Route path="/customers" element={<SavedCustomersPage />} />
            <Route path="/history" element={<BillHistoryPage branch={branch} />} />
            <Route path="/settings" element={<SettingsPage branches={branches} selectBranch={selectBranch} currentBranchId={branch?.id} />} />
          </Routes>
        </AnimatePresence>
      </main>

      <nav className="tab-bar">
        <NavLink to="/" end className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
          {ICONS.bill}
          New Bill
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
          {ICONS.customers}
          Customers
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
          {ICONS.history}
          History
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
          {ICONS.settings}
          Settings
        </NavLink>
      </nav>

      {needsSelection && (
        <motion.div
          className="sheet-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <BranchSelector branches={branches} onSelect={selectBranch} />
        </motion.div>
      )}
    </div>
  );
}
