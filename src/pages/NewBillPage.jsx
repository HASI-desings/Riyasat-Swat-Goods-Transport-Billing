// Screen 1 — main screen, form + live preview side-by-side (desktop) or
// stacked (mobile). Blocks bill creation until a branch is selected on
// this device (rules.md #4a).
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BillForm, { emptyBill } from '../components/BillForm';
import AmountSummary from '../components/AmountSummary';
import { useBills } from '../hooks/useBills';
import { useCustomers } from '../hooks/useCustomers';
import { useSettings } from '../hooks/useSettings';
import { draftStorage } from '../lib/storage';

export default function NewBillPage({ branch }) {
  const navigate = useNavigate();
  const { saveBill, isOnline } = useBills();
  const { customers, addCustomer, findByName, bumpUsage } = useCustomers();
  const { presets } = useSettings();
  const [bill, setBill] = useState(emptyBill);
  const [calc, setCalc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const readyToSave =
    branch && bill.senderName && bill.receiverName && bill.destination &&
    bill.substanceType && bill.pieceCount && bill.ratePerPiece && calc?.total > 0;

  async function handleSaveNewCustomer(name) {
    await addCustomer({ name, defaultDestination: bill.destination });
  }

  async function handleSave() {
    if (!branch) {
      setError('Select a branch first (see the picker, or go to Settings).');
      return;
    }
    setSaving(true);
    setError(null);

    const existing = findByName(bill.senderName);
    if (existing) bumpUsage(existing.id);

    const fullBill = { ...bill, ...calc, branchId: branch.id };
    const res = await saveBill(fullBill);
    setSaving(false);

    if (res.ok) {
      draftStorage.clear();
      navigate(`/preview/${res.bill.id || res.bill.billNumber}`, { state: { bill: res.bill } });
    } else {
      setError(res.reason);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
    >
      {!isOnline && (
        <div className="banner banner-offline">
          Offline — bill will be saved on this device and synced when back online.
        </div>
      )}
      {error && (
        <div className="banner banner-error">
          {error} <span className="retry-link" onClick={handleSave}>Retry</span>
        </div>
      )}

      <div className="split-layout">
        <div>
          <BillForm
            branchId={branch?.id}
            presets={presets}
            customers={customers}
            onSaveCustomer={handleSaveNewCustomer}
            onCalcChange={setCalc}
            onBillChange={setBill}
          />
        </div>

        <div className="sticky-col" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {calc && <AmountSummary calc={calc} />}

          <button className="btn btn-primary btn-block" disabled={!readyToSave || saving} onClick={handleSave}>
            {saving ? 'Saving…' : 'Save & Preview Slip'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
