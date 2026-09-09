// Receiving terminal — the reverse of our own outgoing bill system.
// Other transport companies deliver goods TO Lahore for us to hand over;
// this page logs each item received, tracks what's still sitting in
// inventory (not yet handed to the customer), lets the admin call the
// receiver directly, and keeps a full history of everything ever received.
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useDeliveries } from '../hooks/useDeliveries';
import { useSettings } from '../hooks/useSettings';
import DeliveryForm from '../components/DeliveryForm';
import DeliveryListItem from '../components/DeliveryListItem';

const TABS = [
  { id: 'add', label: 'Add', ur: 'اندراج' },
  { id: 'inventory', label: 'Inventory', ur: 'انوینٹری' },
  { id: 'history', label: 'History', ur: 'تاریخ' },
];

export default function ReceivingPage() {
  const [tab, setTab] = useState('inventory');
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { deliveries, inventory, loading, error, addDelivery, markDelivered, markPending, search } = useDeliveries();
  const { presets } = useSettings();

  const list = tab === 'inventory' ? inventory : deliveries;
  const results = useMemo(() => search(query, list), [search, query, list]);

  async function handleAdd(delivery) {
    setSubmitting(true);
    const res = await addDelivery(delivery);
    setSubmitting(false);
    if (res.ok) setTab('inventory');
    return res;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="section-title">Receiving <span className="ur">/ موصولی</span></div>

      <div className="sub-tab-bar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`sub-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label} <span className="ur">/ {t.ur}</span>
            {t.id === 'inventory' && inventory.length > 0 && (
              <span className="sub-tab-count">{inventory.length}</span>
            )}
          </button>
        ))}
      </div>

      {error && <div className="banner banner-error">{error}</div>}

      {tab === 'add' && (
        <DeliveryForm presets={presets} onSubmit={handleAdd} submitting={submitting} />
      )}

      {(tab === 'inventory' || tab === 'history') && (
        <>
          <div className="field" style={{ marginBottom: 12 }}>
            <input
              type="text"
              placeholder="Search by receiver, phone, city, company…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {loading && <div className="empty-state">Loading…</div>}
          {!loading && results.length === 0 && (
            <div className="empty-state">
              {tab === 'inventory' ? 'Nothing waiting in inventory.' : 'No matching deliveries found.'}
            </div>
          )}

          {results.map((d) => (
            <DeliveryListItem key={d.id} delivery={d} onMarkDelivered={markDelivered} onMarkPending={markPending} />
          ))}
        </>
      )}
    </motion.div>
  );
}
