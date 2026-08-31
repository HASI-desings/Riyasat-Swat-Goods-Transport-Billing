// SINGLE source of truth for rendering a bill (rules.md #2). Used by
// Preview, Print, WhatsApp export, and PNG export — never duplicate this
// layout elsewhere. Strict suppression: any optional field left blank
// produces zero trace (no label, no "N/A", no empty line) — rules.md #1.
import React, { forwardRef } from 'react';
import { formatPKR } from '../lib/calculateTotal';
import { formatBillNumber } from '../lib/billNumber';
import { branches } from '../data/defaultPresets';

const SlipTemplate = forwardRef(function SlipTemplate({ bill }, ref) {
  const branch = branches.find((b) => b.id === bill.branchId);
  const hasWeight = notBlank(bill.weightOrVolume);
  const hasDiscount = notBlank(bill.discountedRate);
  const hasTollTax = notBlank(bill.tollTax);
  const hasCommission = notBlank(bill.companyCommission);
  const hasKharcha = notBlank(bill.kharcha);
  const hasSenderPhone = notBlank(bill.senderPhone);
  const hasReceiverPhone = notBlank(bill.receiverPhone);

  return (
    <div className="slip" ref={ref}>
      <div className="slip-header">
        <div className="company">Riyasat Swat Goods Transport</div>
        {branch && <div className="branch">{branch.label} — {branch.address}</div>}
        <div className="tagline">Lahore to Swat &amp; Beyond</div>
      </div>

      <div className="slip-meta">
        <span>Bill No: <strong>{formatBillNumber(bill.billNumber)}</strong></span>
        <span>Date: {formatDate(bill.date)}</span>
      </div>

      <div className="slip-parties">
        <div>
          <div className="label">Sender</div>
          <div>{bill.senderName}</div>
          {hasSenderPhone && <div>{bill.senderPhone}</div>}
        </div>
        <div>
          <div className="label">Receiver</div>
          <div>{bill.receiverName}</div>
          {hasReceiverPhone && <div>{bill.receiverPhone}</div>}
        </div>
      </div>

      <div className="slip-parties" style={{ marginTop: -6 }}>
        <div>
          <div className="label">Destination</div>
          <div>{bill.destination}</div>
        </div>
        <div>
          <div className="label">Substance</div>
          <div>{bill.substanceType}</div>
        </div>
      </div>

      <table className="slip-table">
        <tbody>
          {hasWeight && (
            <tr><td>Weight / Volume (per piece)</td><td>{bill.weightOrVolume}</td></tr>
          )}
          <tr><td>Pieces</td><td>{bill.pieceCount}</td></tr>
          <tr>
            <td>Rate per Piece{hasDiscount ? ' (Discounted)' : ''}</td>
            <td>{formatPKR(hasDiscount ? bill.discountedRate : bill.ratePerPiece)}</td>
          </tr>
          <tr><td>Amount</td><td>{formatPKR(bill.amount)}</td></tr>
          {hasTollTax && (
            <tr><td>Toll Tax</td><td>{formatPKR(bill.tollTax)}</td></tr>
          )}
          {hasCommission && (
            <tr><td>Company Commission</td><td>{formatPKR(bill.companyCommission)}</td></tr>
          )}
          <tr><td>Labour Cost</td><td>{formatPKR(bill.labourCost)}</td></tr>
          {hasKharcha && (
            <tr><td>Kharcha</td><td>{formatPKR(bill.kharcha)}</td></tr>
          )}
        </tbody>
      </table>

      <div className="slip-total">
        <span className="label">Total</span>
        <span className="value">{formatPKR(bill.total)}</span>
      </div>

      <div className="slip-footer">Thank you for trusting Riyasat Swat Goods Transport.</div>
    </div>
  );
});

function notBlank(v) {
  return v !== null && v !== undefined && v !== '' && !(typeof v === 'number' && Number.isNaN(v));
}

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return d;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default SlipTemplate;
