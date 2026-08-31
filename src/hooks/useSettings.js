// Substance presets + misc device settings. Presets are seeded from
// defaultPresets.js and overridden/extended via Supabase `settings` row
// (single-admin app, one settings record).
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { defaultPresets } from '../data/defaultPresets';

export function useSettings() {
  const [presets, setPresets] = useState(defaultPresets);
  const [settingsId, setSettingsId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.from('settings').select('*').limit(1).maybeSingle();
    if (err) {
      setError(err.message);
    } else if (data) {
      setSettingsId(data.id);
      setPresets(data.substance_presets?.length ? data.substance_presets : defaultPresets);
    } else {
      // No settings row yet — create the single admin settings record.
      const { data: created, error: createErr } = await supabase
        .from('settings')
        .insert({ substance_presets: defaultPresets })
        .select()
        .single();
      if (!createErr) {
        setSettingsId(created.id);
        setPresets(created.substance_presets);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const savePresets = useCallback(async (nextPresets) => {
    setPresets(nextPresets);
    if (!settingsId) return { ok: false, reason: 'no-settings-row' };
    const { error: err } = await supabase
      .from('settings')
      .update({ substance_presets: nextPresets })
      .eq('id', settingsId);
    return { ok: !err, reason: err?.message };
  }, [settingsId]);

  const addPreset = useCallback((name) => {
    if (!name?.trim()) return;
    const next = [...new Set([...presets, name.trim()])];
    savePresets(next);
  }, [presets, savePresets]);

  const removePreset = useCallback((name) => {
    savePresets(presets.filter((p) => p !== name));
  }, [presets, savePresets]);

  return { presets, loading, error, addPreset, removePreset, refresh };
}
