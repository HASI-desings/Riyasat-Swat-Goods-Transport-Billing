// Toll Tax / Company Commission — manual per-bill amount inputs, NOT
// toggles and NOT fixed values (rules.md #4). Blank = excluded from the
// total and never printed on the slip.
import React from 'react';

export default function ManualAmountField({ label, value, onChange, placeholder = 'Leave blank if not applicable' }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
