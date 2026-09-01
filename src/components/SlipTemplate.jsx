// SINGLE source of truth for rendering a bill (rules.md #2). Used by
// Preview, Print, WhatsApp export, and PNG export — never duplicate this
// layout elsewhere. Strict suppression: any optional field left blank
// produces zero trace (no label, no "N/A", no empty line) — rules.md #1.
//
// Every label is bilingual (English / Urdu) per the physical receipt
// this app is modeled on. Urdu text is wrapped in <span className="ur">
// so it gets RTL direction + the Urdu font (see theme.css).
import React, { forwardRef } from 'react';
import { formatPKR } from '../lib/calculateTotal';
import { formatBillNumber } from '../lib/billNumber';
import { branches } from '../data/defaultPresets';

function Bilingual({ en, ur }) {
  return (
    <>
      {en} <span className="ur">/ {ur}</span>
    </>
  );
}

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
        <div className="company">
          Riyasat Swat Goods Transport Company
          <span className="ur company-ur"> — ریاست سوات گڈز ٹرانسپورٹ کمپنی</span>
        </div>

        <div className="hq-contacts">
          <span className="contact-name">Rana Shahid</span> <span className="contact-num">0344-4595510</span> ·{' '}
          <span className="contact-num">0321-4138059</span>
          <br />
          <span className="contact-name">Rana Jahanzaib</span> <span className="contact-num">0300-4768995</span>
        </div>

        <div className="branch-offices">
          <div className="branch-office">
            <span className="office-label">Branch Office <span className="ur">/ برانچ آفس</span>:</span>{' '}
            Shalmi Chowk <span className="ur">/ شالمی چوک</span>
            <br />
            <span className="contact-name">Majid Sulehri</span> <span className="contact-num">0345-2528125</span>
          </div>
          <div className="branch-office">
            <span className="office-label">Delivery Office <span className="ur">/ ڈیلیوری آفس</span>:</span>{' '}
            32 Chowk <span className="ur">/ 32 چوک</span>
            <br />
            <span className="contact-num">0310-4595510</span>
          </div>
        </div>

        {branch && (
          <div className="branch">
            This Slip — {branch.label} ({branch.address})
          </div>
        )}
        <div className="tagline">Lahore to Swat &amp; Beyond</div>
      </div>

      <div className="slip-meta">
        <span>
          <Bilingual en="Bill No" ur="بلٹی نمبر" />: <strong>{formatBillNumber(bill.billNumber)}</strong>
        </span>
        <span>
          <Bilingual en="Date" ur="تاریخ" />: {formatDate(bill.date)}
        </span>
      </div>

      <div className="slip-parties">
        <div>
          <div className="label"><Bilingual en="Sender" ur="بھیجنے والا" /></div>
          <div>{bill.senderName}</div>
          {hasSenderPhone && <div>{bill.senderPhone}</div>}
        </div>
        <div>
          <div className="label"><Bilingual en="Receiver" ur="وصول کنندہ" /></div>
          <div>{bill.receiverName}</div>
          {hasReceiverPhone && <div>{bill.receiverPhone}</div>}
        </div>
      </div>

      <div className="slip-parties" style={{ marginTop: -6 }}>
        <div>
          <div className="label"><Bilingual en="Destination" ur="منزل" /></div>
          <div>{bill.destination}</div>
        </div>
        <div>
          <div className="label"><Bilingual en="Substance" ur="مال کی قسم" /></div>
          <div>{bill.substanceType}</div>
        </div>
      </div>

      <table className="slip-table">
        <tbody>
          {hasWeight && (
            <tr>
              <td><Bilingual en="Weight / Volume (per piece)" ur="وزن" /></td>
              <td>{bill.weightOrVolume}</td>
            </tr>
          )}
          <tr>
            <td><Bilingual en="Pieces" ur="تعداد" /></td>
            <td>{bill.pieceCount}</td>
          </tr>
          <tr>
            <td>
              <Bilingual en="Rate per Piece" ur="کرایہ فی پیس" />
              {hasDiscount ? ' (Discounted)' : ''}
            </td>
            <td>{formatPKR(hasDiscount ? bill.discountedRate : bill.ratePerPiece)}</td>
          </tr>
          <tr>
            <td><Bilingual en="Amount" ur="تفصیلی کرایہ" /></td>
            <td>{formatPKR(bill.amount)}</td>
          </tr>
          {hasTollTax && (
            <tr>
              <td><Bilingual en="Toll Tax" ur="ٹول ٹیکس" /></td>
              <td>{formatPKR(bill.tollTax)}</td>
            </tr>
          )}
          {hasCommission && (
            <tr>
              <td><Bilingual en="Company Commission" ur="کمپنی کمیشن" /></td>
              <td>{formatPKR(bill.companyCommission)}</td>
            </tr>
          )}
          <tr>
            <td><Bilingual en="Labour Cost" ur="مزدوری" /></td>
            <td>{formatPKR(bill.labourCost)}</td>
          </tr>
          {hasKharcha && (
            <tr>
              <td><Bilingual en="Kharcha" ur="خرچہ" /></td>
              <td>{formatPKR(bill.kharcha)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="slip-total">
        <span className="label"><Bilingual en="Total" ur="کل رقم" /></span>
        <span className="value">{formatPKR(bill.total)}</span>
      </div>

      <div className="slip-footer">
        <div>Thank you for trusting Riyasat Swat Goods Transport.</div>
        <div className="ur footer-note">
          نوٹ: ہر قسم کے مال کی بلٹی آف انٹری ضروری ہے۔ اگر کسی پارٹی نے مقررہ وقت پر مال وصول نہ کیا تو وہ خود ذمہ دار ہوگا۔
          رسید ہذا اجراء کے 15 دن بعد تک مال نہ آنے کی صورت میں، مال چھوٹ جانے کی جو بھی شکایت ہو 15 دن تک اندراج کروا لیں۔
        </div>
      </div>
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
