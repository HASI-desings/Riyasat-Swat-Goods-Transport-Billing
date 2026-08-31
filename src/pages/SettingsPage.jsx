// Screen 5 — remembered toggle defaults, substance preset manager,
// branch reassignment, and a daily/monthly totals mini-dashboard (Phase 7).
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';
import { useBills } from '../hooks/useBills';
import { formatPKR } from '../lib/calculateTotal';

export default function SettingsPage({ branches, selectBranch, currentBranchId }) {
  const { presets, addPreset, removePreset } = useSettings();
  const { bills } = useBills();
  const [newPreset, setNewPreset] = useState('');

  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return bills.filter((b) => b.date === today).reduce((sum, b) => sum + Number(b.total || 0), 0);
  }, [bills]);

  const monthTotal = useMemo(() => {
    const ym = new Date().toISOString().slice(0, 7);
    return bills.filter((b) => (b.date || '').startsWith(ym)).reduce((sum, b) => sum + Number(b.total || 0), 0);
  }, [bills]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="section-title">Totals</div>
      <div className="card" style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-300)', fontWeight: 700, textTransform: 'uppercase' }}>Today</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber-400)' }}>{formatPKR(todayTotal)}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--slate-300)', fontWeight: 700, textTransform: 'uppercase' }}>This Month</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--amber-400)' }}>{formatPKR(monthTotal)}</div>
        </div>
      </div>

      <div className="section-title">Branch</div>
      <div className="card" style={{ marginBottom: 20 }}>
        {branches.map((b) => (
          <button
            key={b.id}
            className="list-item"
            style={{ width: '100%', textAlign: 'left', border: b.id === currentBranchId ? '1px solid var(--amber-500)' : undefined }}
            onClick={() => selectBranch(b.id)}
          >
            <div>
              <div className="title">{b.label}</div>
              <div className="subtitle">{b.address}</div>
            </div>
            {b.id === currentBranchId && <span style={{ color: 'var(--amber-400)' }}>✓</span>}
          </button>
        ))}
      </div>

      <div className="section-title">Substance Presets</div>
      <div className="card">
        {presets.map((p) => (
          <div key={p} className="list-item">
            <span>{p}</span>
            <button className="btn btn-danger" onClick={() => removePreset(p)}>Remove</button>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <input
            type="text"
            placeholder="New preset name"
            value={newPreset}
            onChange={(e) => setNewPreset(e.target.value)}
            style={{ flex: 1, background: 'var(--navy-700)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', color: 'var(--slate-100)' }}
          />
          <button className="btn btn-primary" onClick={() => { addPreset(newPreset); setNewPreset(''); }}>Add</button>
        </div>
      </div>
    </motion.div>
  );
}
