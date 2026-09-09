// A single delivery row for Inventory / History. Tapping it opens the
// full receipt-style detail sheet (DeliverySlipTemplate) with a prominent
// Call button — a real tel: link, so tapping it opens the phone's dialer
// with the receiver's number already filled in.
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DeliverySlipTemplate from './DeliverySlipTemplate';

export default function DeliveryListItem({ delivery, onMarkDelivered, onMarkPending }) {
  const [open, setOpen] = useState(false);
  const slipRef = useRef(null);

  return (
    <>
      <div className="list-item" style={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>
        <div>
          <div className="title">{delivery.receiverName} · {delivery.pieceCount} pcs</div>
          <div className="subtitle">
            {delivery.substanceType}
            {delivery.originCity ? ` · from ${delivery.originCity}` : ''}
            {delivery.sourceCompany ? ` (${delivery.sourceCompany})` : ''}
            {' · '}{delivery.dateReceived}
          </div>
        </div>
        <span className={`status-badge status-${delivery.status}`}>
          {delivery.status === 'pending' ? 'Pending' : 'Delivered'}
        </span>
      </div>

      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <motion.div
            className="sheet"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '88vh', overflowY: 'auto' }}
          >
            <div className="print-area">
              <DeliverySlipTemplate ref={slipRef} delivery={delivery} />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
              <a
                href={`tel:${delivery.receiverPhone.replace(/[^\d+]/g, '')}`}
                className="btn btn-primary"
                style={{ flex: '1 1 45%', textDecoration: 'none' }}
              >
                📞 Call Receiver
              </a>
              <button className="btn btn-secondary" style={{ flex: '1 1 45%' }} onClick={() => window.print()}>
                🖨 Print
              </button>
              {delivery.status === 'pending' ? (
                <button className="btn btn-secondary btn-block" onClick={() => { onMarkDelivered(delivery.id); setOpen(false); }}>
                  ✓ Mark Delivered
                </button>
              ) : (
                <button className="btn btn-ghost btn-block" onClick={() => { onMarkPending(delivery.id); setOpen(false); }}>
                  Undo
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
