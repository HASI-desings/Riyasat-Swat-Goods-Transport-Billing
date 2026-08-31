// Reads/writes this device's selected branch. Branch is a device setting,
// not a per-bill choice (rules.md #4a) — picked once, remembered via
// localStorage, editable later from Settings.
import { useCallback, useEffect, useState } from 'react';
import { branchStorage } from '../lib/storage';
import { branches } from '../data/defaultPresets';

export function useBranch() {
  const [branchId, setBranchId] = useState(() => branchStorage.get());

  useEffect(() => {
    setBranchId(branchStorage.get());
  }, []);

  const selectBranch = useCallback((id) => {
    branchStorage.set(id);
    setBranchId(id);
  }, []);

  const branch = branches.find((b) => b.id === branchId) || null;

  return { branch, branchId, branches, selectBranch, needsSelection: !branchId };
}
