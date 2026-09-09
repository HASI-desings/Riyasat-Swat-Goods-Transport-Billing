// Form for logging a delivery received from another transport company —
// the reverse of BillForm. Mirrors the same field set as our own bilty
// (rules.md-equivalent for this module) so nothing gets lost: sender,
// receiver + phone (required — this is who gets called), substance,
// weight, pieces, and the declared amount from the original bilty.
import React, { useState } from 'react';
import SubstancePresetSelect from './SubstancePresetSelect';

const emptyDelivery = {
  dateReceived: new Date().toISOString().slice(0, 10),
  sourceCompany: '',
  originCity: '',
  originalBillNumber: '',
  senderName: '',
  senderPhone: '',
  receiverName: '',
  receiverPhone: '',
  substanceType: '',
  weightOrVolume: '',
  pieceCount: '',
  amount: '',
  notes: '',
};

export default function DeliveryForm({ presets, onSubmit, submitting }) {
  const [d, setD] = useState(emptyDelivery);

  function update(field, value) {
    setD((prev) => ({ ...prev, [field]: value }));
  }

  const readyToSave = d.receiverName && d.receiverPhone && d.substanceType && d.pieceCount;

  async function handleSubmit() {
    // Same mobile keyboard-focus issue as the New Bill save button: tapping
    // Save while a field is still focused can just dismiss the keyboard on
    // the first tap. Blurring first means one tap reliably saves.
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const res = await onSubmit(d);
    if (res?.ok) setD(emptyDelivery);
  }

  return (
    <div className="card">
      <div className="section-title">Log Received Delivery <span className="ur">/ موصول شدہ مال درج کریں</span></div>

      <div className="field">
        <label>Date Received <span className="ur">/ موصولہ تاریخ</span></label>
        <input type="date" value={d.dateReceived} onChange={(e) => update('dateReceived', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Sending Company (optional) <span className="ur">/ بھیجنے والی کمپنی</span></label>
          <input type="text" value={d.sourceCompany} placeholder="e.g. Khyber Goods" onChange={(e) => update('sourceCompany', e.target.value)} />
        </div>
        <div className="field">
          <label>Origin City <span className="ur">/ شہر</span></label>
          <input type="text" value={d.originCity} placeholder="e.g. Mingora" onChange={(e) => update('originCity', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Original Bilty Number (optional) <span className="ur">/ اصل بلٹی نمبر</span></label>
        <input type="text" value={d.originalBillNumber} onChange={(e) => update('originalBillNumber', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Sender Name <span className="ur">/ بھیجنے والا</span></label>
          <input type="text" value={d.senderName} onChange={(e) => update('senderName', e.target.value)} />
        </div>
        <div className="field">
          <label>Sender Phone (optional) <span className="ur">/ بھیجنے والے کا نمبر</span></label>
          <input type="tel" value={d.senderPhone} onChange={(e) => update('senderPhone', e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Receiver Name <span className="ur">/ وصول کنندہ کا نام</span></label>
          <input type="text" value={d.receiverName} onChange={(e) => update('receiverName', e.target.value)} />
        </div>
        <div className="field">
          <label>Receiver Phone <span className="ur">/ وصول کنندہ کا نمبر</span></label>
          <input type="tel" required value={d.receiverPhone} placeholder="03xx-xxxxxxx" onChange={(e) => update('receiverPhone', e.target.value)} />
        </div>
      </div>

      <SubstancePresetSelect value={d.substanceType} onChange={(v) => update('substanceType', v)} presets={presets} />

      <div className="field-row">
        <div className="field">
          <label>Weight / Volume (optional) <span className="ur">/ وزن</span></label>
          <input type="text" value={d.weightOrVolume} onChange={(e) => update('weightOrVolume', e.target.value)} />
        </div>
        <div className="field">
          <label>Piece Count <span className="ur">/ تعداد</span></label>
          <input type="number" inputMode="numeric" min="0" value={d.pieceCount} onChange={(e) => update('pieceCount', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Declared Amount (optional) <span className="ur">/ رقم</span></label>
        <input type="number" inputMode="decimal" min="0" value={d.amount} placeholder="From the original bilty, if known" onChange={(e) => update('amount', e.target.value)} />
      </div>

      <div className="field">
        <label>Notes (optional) <span className="ur">/ نوٹ</span></label>
        <textarea rows={2} value={d.notes} onChange={(e) => update('notes', e.target.value)} />
      </div>

      <button className="btn btn-primary btn-block" type="button" disabled={!readyToSave || submitting} onClick={handleSubmit}>
        {submitting ? 'Saving…' : 'Add to Inventory'}
      </button>
    </div>
  );
}
