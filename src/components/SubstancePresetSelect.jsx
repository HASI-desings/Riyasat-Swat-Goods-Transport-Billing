// Preset dropdown (Cotton, Bags, ...) + "Add custom" inline option.
import React, { useState } from 'react';

export default function SubstancePresetSelect({ value, onChange, presets }) {
  const [customMode, setCustomMode] = useState(false);

  if (customMode) {
    return (
      <div className="field">
        <label>Substance Type <span className="ur">/ مال کی قسم</span></label>
        <input
          type="text"
          autoFocus
          value={value}
          placeholder="Type custom substance"
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => { if (!value) setCustomMode(false); }}
        />
      </div>
    );
  }

  return (
    <div className="field">
      <label>Substance Type <span className="ur">/ مال کی قسم</span></label>
      <select
        value={presets.includes(value) ? value : ''}
        onChange={(e) => {
          if (e.target.value === '__custom__') {
            setCustomMode(true);
            onChange('');
          } else {
            onChange(e.target.value);
          }
        }}
      >
        <option value="" disabled>Select substance</option>
        {presets.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
        <option value="__custom__">+ Add custom…</option>
      </select>
    </div>
  );
}
