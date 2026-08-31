// Print / WhatsApp / Save-as-PNG — all three render from the SlipTemplate
// node passed in via slipRef, so output is always pixel-identical.
import React, { useState } from 'react';
import { exportSlipAsPng } from '../lib/exportImage';
import { shareSlipToWhatsApp } from '../lib/whatsappShare';

export default function ShareActions({ slipRef, bill }) {
  const [status, setStatus] = useState(null);

  const handlePrint = () => window.print();

  const handlePng = async () => {
    const res = await exportSlipAsPng(slipRef.current, `${bill.billNumber || 'bill'}.png`);
    setStatus(res.ok ? null : { type: 'error', message: 'Download not available — try Print instead.' });
  };

  const handleWhatsApp = async () => {
    const res = await shareSlipToWhatsApp(slipRef.current, {
      phone: bill.receiverPhone || bill.senderPhone,
      text: `Bill ${bill.billNumber} — Riyasat Swat Goods Transport`,
    });
    setStatus(res.ok ? null : { type: 'error', message: 'Sharing not available — try Print or Save as PNG instead.' });
  };

  return (
    <div>
      {status && <div className={`banner banner-${status.type}`}>{status.message}</div>}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={handlePrint}>🖨 Print</button>
        <button className="btn btn-secondary" onClick={handleWhatsApp}>💬 WhatsApp</button>
        <button className="btn btn-secondary" onClick={handlePng}>⬇ Save as PNG</button>
      </div>
    </div>
  );
}
