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
  cost: '',
  godamCharges: '',
  labourCost: '',
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
      <div className="section-title">Log Received Delivery <bdi className="ur">/ موصول شدہ مال درج کریں</bdi></div>

      <div className="field">
        <label>Date Received <bdi className="ur">/ موصولہ تاریخ</bdi></label>
        <input type="date" value={d.dateReceived} onChange={(e) => update('dateReceived', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Sending Company (optional) <bdi className="ur">/ بھیجنے والی کمپنی</bdi></label>
          <input type="text" value={d.sourceCompany} placeholder="e.g. Khyber Goods" onChange={(e) => update('sourceCompany', e.target.value)} />
        </div>
        <div className="field">
          <label>Origin City <bdi className="ur">/ شہر</bdi></label>
          <input type="text" value={d.originCity} placeholder="e.g. Mingora" onChange={(e) => update('originCity', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Original Bilty Number (optional) <bdi className="ur">/ اصل بلٹی نمبر</bdi></label>
        <input type="text" value={d.originalBillNumber} onChange={(e) => update('originalBillNumber', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Sender Name <bdi className="ur">/ بھیجنے والا</bdi></label>
          <input type="text" value={d.senderName} onChange={(e) => update('senderName', e.target.value)} />
        </div>
        <div className="field">
          <label>Sender Phone (optional) <bdi className="ur">/ بھیجنے والے کا نمبر</bdi></label>
          <input type="tel" value={d.senderPhone} onChange={(e) => update('senderPhone', e.target.value)} />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label>Receiver Name <bdi className="ur">/ وصول کنندہ کا نام</bdi></label>
          <input type="text" value={d.receiverName} onChange={(e) => update('receiverName', e.target.value)} />
        </div>
        <div className="field">
          <label>Receiver Phone <bdi className="ur">/ وصول کنندہ کا نمبر</bdi></label>
          <input type="tel" required value={d.receiverPhone} placeholder="03xx-xxxxxxx" onChange={(e) => update('receiverPhone', e.target.value)} />
        </div>
      </div>

      <SubstancePresetSelect value={d.substanceType} onChange={(v) => update('substanceType', v)} presets={presets} />

      <div className="field-row">
        <div className="field">
          <label>Weight / Volume (optional) <bdi className="ur">/ وزن</bdi></label>
          <input type="text" value={d.weightOrVolume} onChange={(e) => update('weightOrVolume', e.target.value)} />
        </div>
        <div className="field">
          <label>Piece Count <bdi className="ur">/ تعداد</bdi></label>
          <input type="number" inputMode="numeric" min="0" value={d.pieceCount} onChange={(e) => update('pieceCount', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Cost (optional) <bdi className="ur">/ کرایہ</bdi></label>
        <input type="number" inputMode="decimal" min="0" value={d.cost} placeholder="From the original bilty, if known" onChange={(e) => update('cost', e.target.value)} />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Godam Charges (optional) <bdi className="ur">/ گودام چارجز</bdi></label>
          <input type="number" inputMode="decimal" min="0" value={d.godamCharges} onChange={(e) => update('godamCharges', e.target.value)} />
        </div>
        <div className="field">
          <label>Labour (optional) <bdi className="ur">/ مزدوری</bdi></label>
          <input type="number" inputMode="decimal" min="0" value={d.labourCost} onChange={(e) => update('labourCost', e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Notes (optional) <bdi className="ur">/ نوٹ</bdi></label>
        <textarea rows={2} value={d.notes} onChange={(e) => update('notes', e.target.value)} />
      </div>

      <button
        className="btn btn-primary btn-block"
        type="button"
        disabled={!readyToSave || submitting}
        onPointerDown={() => {
          // Fires BEFORE the click, early enough to beat the keyboard's
          // dismiss gesture — the actual root cause of the double-tap bug.
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
        }}
        onClick={handleSubmit}
      >
        {submitting ? 'Saving…' : 'Add to Inventory'}
      </button>
    </div>
  );
}
