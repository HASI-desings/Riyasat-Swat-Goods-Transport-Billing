// A single delivery row for Inventory / History. Tapping it opens the
// detail sheet; the Call button uses a tel: link, which on a phone
// opens the dialer with the receiver's number pre-filled — one tap to
// call, no manual dialing.
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatPKR } from '../lib/calculateTotal';

export default function DeliveryListItem({ delivery, onMarkDelivered, onMarkPending }) {
  const [open, setOpen] = useState(false);

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
          >
            <h2>{delivery.receiverName}</h2>
            <div className="delivery-detail">
              <div className="row"><span>Receiver Phone <span className="ur">/ نمبر</span></span><span>{delivery.receiverPhone}</span></div>
              {delivery.senderName && <div className="row"><span>Sender <span className="ur">/ بھیجنے والا</span></span><span>{delivery.senderName}</span></div>}
              {delivery.senderPhone && <div className="row"><span>Sender Phone</span><span>{delivery.senderPhone}</span></div>}
              {delivery.originCity && <div className="row"><span>Origin City <span className="ur">/ شہر</span></span><span>{delivery.originCity}</span></div>}
              {delivery.sourceCompany && <div className="row"><span>Sending Company</span><span>{delivery.sourceCompany}</span></div>}
              {delivery.originalBillNumber && <div className="row"><span>Original Bilty #</span><span>{delivery.originalBillNumber}</span></div>}
              <div className="row"><span>Substance <span className="ur">/ مال کی قسم</span></span><span>{delivery.substanceType}</span></div>
              {delivery.weightOrVolume && <div className="row"><span>Weight / Volume</span><span>{delivery.weightOrVolume}</span></div>}
              <div className="row"><span>Pieces <span className="ur">/ تعداد</span></span><span>{delivery.pieceCount}</span></div>
              {delivery.amount && <div className="row"><span>Declared Amount</span><span>{formatPKR(delivery.amount)}</span></div>}
              <div className="row"><span>Received <span className="ur">/ موصولہ تاریخ</span></span><span>{delivery.dateReceived}</span></div>
              {delivery.notes && <div className="row"><span>Notes</span><span>{delivery.notes}</span></div>}
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <a
                href={`tel:${delivery.receiverPhone.replace(/[^\d+]/g, '')}`}
                className="btn btn-primary"
                style={{ flex: 1, textDecoration: 'none' }}
              >
                📞 Call Receiver
              </a>
              {delivery.status === 'pending' ? (
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { onMarkDelivered(delivery.id); setOpen(false); }}>
                  ✓ Mark Delivered
                </button>
              ) : (
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => { onMarkPending(delivery.id); setOpen(false); }}>
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
