// Screen 3 — list + add/edit/delete, searchable.
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useCustomers } from '../hooks/useCustomers';

export default function SavedCustomersPage() {
  const { customers, loading, error, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', phone: '', defaultDestination: '' });

  const filtered = useMemo(() => {
    if (!query) return customers;
    const q = query.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, query]);

  function openNew() {
    setEditing(null);
    setForm({ name: '', phone: '', defaultDestination: '' });
    setShowForm(true);
  }

  function openEdit(c) {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone || '', defaultDestination: c.default_destination || '' });
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editing) {
      await updateCustomer(editing.id, {
        name: form.name,
        phone: form.phone || null,
        default_destination: form.defaultDestination || null,
      });
    } else {
      await addCustomer(form);
    }
    setShowForm(false);
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="section-title">Saved Customers</div>

      <div className="field" style={{ marginBottom: 12 }}>
        <input type="text" placeholder="Search customers…" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <button className="btn btn-primary" onClick={openNew} style={{ marginBottom: 16 }}>+ Add Customer</button>

      {error && <div className="banner banner-error">{error}</div>}
      {loading && <div className="empty-state">Loading…</div>}
      {!loading && filtered.length === 0 && <div className="empty-state">No customers found.</div>}

      {filtered.map((c) => (
        <div key={c.id} className="list-item">
          <div onClick={() => openEdit(c)} style={{ cursor: 'pointer', flex: 1 }}>
            <div className="title">{c.name}</div>
            <div className="subtitle">
              {c.phone || 'No phone'}{c.default_destination ? ` · ${c.default_destination}` : ''} · used {c.times_used || 0}×
            </div>
          </div>
          <button className="btn btn-danger" onClick={() => deleteCustomer(c.id)}>Delete</button>
        </div>
      ))}

      {showForm && (
        <div className="sheet-backdrop" onClick={() => setShowForm(false)}>
          <motion.form
            className="sheet"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <h2>{editing ? 'Edit Customer' : 'Add Customer'}</h2>
            <div className="field">
              <label>Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>Phone (optional)</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="field">
              <label>Default Destination (optional)</label>
              <input type="text" value={form.defaultDestination} onChange={(e) => setForm({ ...form, defaultDestination: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
            </div>
          </motion.form>
        </div>
      )}
    </motion.div>
  );
}
