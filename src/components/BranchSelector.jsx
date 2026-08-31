// First-launch (and Settings) branch picker. Bill creation is blocked
// until a branch is selected on this device (rules.md #4a, security.md).
import React from 'react';
import { motion } from 'framer-motion';

export default function BranchSelector({ branches, onSelect, onClose }) {
  return (
    <motion.div
      className="sheet"
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 60, opacity: 0 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
    >
      <h2>Select this device's branch</h2>
      <p style={{ color: 'var(--slate-300)', fontSize: '0.85rem', marginTop: -6, marginBottom: 16 }}>
        This is remembered on this device and printed on every bill. You can change it later in Settings.
      </p>
      {branches.map((b) => (
        <button
          key={b.id}
          className="list-item"
          style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
          onClick={() => onSelect(b.id)}
        >
          <div>
            <div className="title">{b.label}</div>
            <div className="subtitle">{b.address}</div>
          </div>
          <span style={{ color: 'var(--amber-400)' }}>→</span>
        </button>
      ))}
      {onClose && (
        <button className="btn btn-ghost btn-block" onClick={onClose} style={{ marginTop: 8 }}>
          Cancel
        </button>
      )}
    </motion.div>
  );
}
