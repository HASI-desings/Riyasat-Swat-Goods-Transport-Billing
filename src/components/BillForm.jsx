// The input form (New Bill). Live calculation only — no submit/calculate
// button (rules.md #3). Autosaves to local draft storage on every change
// so a closed browser or connection drop never loses typed data.
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateTotal } from '../lib/calculateTotal';
import { draftStorage } from '../lib/storage';
import ManualAmountField from './ManualAmountField';
import CustomerAutocomplete from './CustomerAutocomplete';
import SubstancePresetSelect from './SubstancePresetSelect';

const emptyBill = {
  date: new Date().toISOString().slice(0, 10),
  senderName: '',
  senderPhone: '',
  receiverName: '',
  receiverPhone: '',
  destination: '',
  substanceType: '',
  weightOrVolume: '',
  pieceCount: '',
  ratePerPiece: '',
  discountedRate: '',
  tollTax: '',
  companyCommission: '',
  labourCost: '',
  kharcha: '',
};

export default function BillForm({ branchId, presets, customers, onSaveCustomer, onCalcChange, onBillChange }) {
  const [bill, setBill] = useState(() => draftStorage.load() || emptyBill);
  const [showDiscount, setShowDiscount] = useState(false);
  const idleTimer = useRef(null);

  const calc = calculateTotal(bill);

  useEffect(() => {
    onCalcChange?.(calc);
    onBillChange?.(bill);
    draftStorage.save(bill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill]);

  function update(field, value) {
    setBill((prev) => ({ ...prev, [field]: value }));
  }

  function handleRateTyping(value) {
    update('ratePerPiece', value);
    setShowDiscount(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (!bill.discountedRate) setShowDiscount(false);
    }, 10000);
  }

  return (
    <div className="card">
      <div className="section-title">New Bill</div>

      <div className="field">
        <label>Date <span className="ur">/ تاریخ</span></label>
        <input type="date" value={bill.date} onChange={(e) => update('date', e.target.value)} />
      </div>

      <CustomerAutocomplete
        value={bill.senderName}
        onChange={(v) => update('senderName', v)}
        customers={customers}
        onSaveNew={onSaveCustomer}
      />

      <div className="field">
        <label>Sender Phone (optional) <span className="ur">/ بھیجنے والے کا نمبر</span></label>
        <input type="tel" value={bill.senderPhone} placeholder="03xx-xxxxxxx" onChange={(e) => update('senderPhone', e.target.value)} />
      </div>

      <div className="field">
        <label>Receiver Name <span className="ur">/ وصول کنندہ کا نام</span></label>
        <input type="text" value={bill.receiverName} placeholder="e.g. Khan Traders" onChange={(e) => update('receiverName', e.target.value)} />
      </div>

      <div className="field">
        <label>Receiver Phone (optional) <span className="ur">/ وصول کنندہ کا نمبر</span></label>
        <input type="tel" value={bill.receiverPhone} placeholder="03xx-xxxxxxx" onChange={(e) => update('receiverPhone', e.target.value)} />
      </div>

      <div className="field">
        <label>Destination <span className="ur">/ منزل</span></label>
        <input type="text" value={bill.destination} placeholder="e.g. Mingora, Swat" onChange={(e) => update('destination', e.target.value)} />
      </div>

      <SubstancePresetSelect value={bill.substanceType} onChange={(v) => update('substanceType', v)} presets={presets} />

      <div className="field">
        <label>Weight / Volume per piece (optional) <span className="ur">/ وزن</span></label>
        <input type="text" value={bill.weightOrVolume} placeholder="e.g. 50kg" onChange={(e) => update('weightOrVolume', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Piece Count <span className="ur">/ تعداد</span></label>
          <input type="number" inputMode="numeric" min="0" value={bill.pieceCount} onChange={(e) => update('pieceCount', e.target.value)} />
        </div>
        <div className="field">
          <label>Rate per Piece <span className="ur">/ کرایہ فی پیس</span></label>
          <input type="number" inputMode="decimal" min="0" value={bill.ratePerPiece} onChange={(e) => handleRateTyping(e.target.value)} />
        </div>
      </div>

      <AnimatePresence>
        {showDiscount && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="field">
              <label>Discounted Rate (optional) <span className="ur">/ رعایتی کرایہ</span></label>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                value={bill.discountedRate}
                placeholder="Leave blank for no discount"
                onChange={(e) => update('discountedRate', e.target.value)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ManualAmountField label={<>Toll Tax (manual, per bill) <span className="ur">/ ٹول ٹیکس</span></>} value={bill.tollTax} onChange={(v) => update('tollTax', v)} />
      <ManualAmountField label={<>Company Commission (manual, per bill) <span className="ur">/ کمپنی کمیشن</span></>} value={bill.companyCommission} onChange={(v) => update('companyCommission', v)} />

      <div className="field">
        <label>Labour Cost <span className="ur">/ مزدوری</span></label>
        <input type="number" inputMode="decimal" min="0" value={bill.labourCost} onChange={(e) => update('labourCost', e.target.value)} />
      </div>

      <ManualAmountField label={<>Kharcha (optional) <span className="ur">/ خرچہ</span></>} value={bill.kharcha} onChange={(v) => update('kharcha', v)} />
    </div>
  );
}

export { emptyBill };
