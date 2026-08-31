// Screen 4 — list of past bills, newest first, searchable by bill number,
// sender, receiver, destination, or substance type (partial, case-insensitive).
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBills } from '../hooks/useBills';
import { formatBillNumber } from '../lib/billNumber';
import { formatPKR } from '../lib/calculateTotal';

export default function BillHistoryPage() {
  const { bills, loading, error, search } = useBills();
  const [query, setQuery] = useState('');
  const results = search(query);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="section-title">Bill History</div>

      <div className="field" style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Search by bill #, sender, receiver, destination, substance…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <div className="banner banner-error">{error}</div>}
      {loading && <div className="empty-state">Loading…</div>}
      {!loading && results.length === 0 && <div className="empty-state">No matching bills found.</div>}

      {results.map((b) => (
        <Link key={b.id} to={`/preview/${b.id}`} state={{ bill: b }} className="list-item" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>
            <div className="title">{formatBillNumber(b.billNumber)} · {b.senderName} → {b.receiverName}</div>
            <div className="subtitle">{b.destination} · {b.substanceType} · {b.date}</div>
          </div>
          <div className="amount">{formatPKR(b.total)}</div>
        </Link>
      ))}
    </motion.div>
  );
}
