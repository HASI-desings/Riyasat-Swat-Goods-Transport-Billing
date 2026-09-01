// Autocomplete for sender name, backed by useCustomers. Offers to save a
// new sender as a fixed customer once they finish typing a name that
// doesn't match an existing one.
import React, { useMemo, useState } from 'react';

export default function CustomerAutocomplete({ value, onChange, customers, onSaveNew }) {
  const [focused, setFocused] = useState(false);

  const matches = useMemo(() => {
    if (!value) return [];
    const q = value.toLowerCase();
    return customers.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 5);
  }, [value, customers]);

  const exactMatch = customers.some((c) => c.name.toLowerCase() === (value || '').toLowerCase());

  return (
    <div className="field" style={{ position: 'relative' }}>
      <label>Sender Name <span className="ur">/ بھیجنے والے کا نام</span></label>
      <input
        type="text"
        value={value}
        placeholder="e.g. Ahmed Traders"
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
      />
      {focused && matches.length > 0 && (
        <div className="card" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10, padding: 6, marginTop: 4 }}>
          {matches.map((c) => (
            <div
              key={c.id}
              className="list-item"
              style={{ margin: 0, marginBottom: 4, cursor: 'pointer' }}
              onMouseDown={() => onChange(c.name)}
            >
              <div>
                <div className="title" style={{ fontSize: '0.88rem' }}>{c.name}</div>
                {c.default_destination && <div className="subtitle">{c.default_destination}</div>}
              </div>
            </div>
          ))}
        </div>
      )}
      {value && !exactMatch && !focused && onSaveNew && (
        <button type="button" className="btn btn-ghost" style={{ alignSelf: 'flex-start', padding: '4px 0' }} onClick={() => onSaveNew(value)}>
          + Save "{value}" as a fixed customer
        </button>
      )}
    </div>
  );
}
