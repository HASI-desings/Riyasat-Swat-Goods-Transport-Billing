// Receipt-style view for a received delivery — same paper/header styling
// as our own outgoing SlipTemplate, so both look like they belong to the
// same company. Used inside the Inventory/History detail sheet.
import React, { forwardRef } from 'react';
import { formatPKR } from '../lib/calculateTotal';

// <bdi> (bidirectional isolate) keeps the Urdu text from reordering the
// English/number characters sitting right next to it — without it, a
// date or number placed beside RTL Urdu text can visually scramble
// (digits jumping position, words swapping order).
function Bilingual({ en, ur }) {
  return (
    <>
      {en} / <bdi className="ur">{ur}</bdi>
    </>
  );
}

const DeliverySlipTemplate = forwardRef(function DeliverySlipTemplate({ delivery }, ref) {
  const hasWeight = notBlank(delivery.weightOrVolume);
  const hasCost = notBlank(delivery.cost);
  const hasGodamCharges = notBlank(delivery.godamCharges);
  const hasLabourCost = notBlank(delivery.labourCost);
  const hasSenderPhone = notBlank(delivery.senderPhone);
  const hasOriginCity = notBlank(delivery.originCity);
  const hasSourceCompany = notBlank(delivery.sourceCompany);
  const hasOriginalBillNumber = notBlank(delivery.originalBillNumber);
  const hasNotes = notBlank(delivery.notes);

  const totalDeclared =
    (hasCost ? Number(delivery.cost) : 0) +
    (hasGodamCharges ? Number(delivery.godamCharges) : 0) +
    (hasLabourCost ? Number(delivery.labourCost) : 0);

  return (
    <div className="slip" ref={ref}>
      <div className="slip-header">
        <div className="company">
          Riyasat Swat Goods Transport Company
          <bdi className="ur company-ur"> — ریاست سوات گڈز ٹرانسپورٹ کمپنی</bdi>
        </div>

        <div className="hq-contacts">
          <span className="contact-name">Rana Shahid</span> <span className="contact-num">0344-4595510</span> ·{' '}
          <span className="contact-num">0321-4138059</span>
          <br />
          <span className="contact-name">Rana Jahanzaib</span> <span className="contact-num">0300-4768995</span>
          <br />
          <span className="contact-name">Muhammad Numan</span> <span className="contact-num">+92 326 6406600</span>
        </div>

        <div className="branch" style={{ marginTop: 8 }}>
          <Bilingual en="Received Delivery" ur="موصول شدہ مال" />
        </div>
        <div className="tagline">Swat to Lahore &amp; Beyond</div>
      </div>

      <div className="slip-meta">
        <span>
          <Bilingual en="Received" ur="موصولہ تاریخ" />: <strong>{formatDate(delivery.dateReceived)}</strong>
        </span>
        <span>
          <span className={`status-badge status-${delivery.status}`}>
            {delivery.status === 'pending' ? 'Pending' : 'Delivered'}
          </span>
        </span>
      </div>

      {(hasSourceCompany || hasOriginCity || hasOriginalBillNumber) && (
        <div className="slip-parties" style={{ marginBottom: 12 }}>
          {hasSourceCompany && (
            <div>
              <div className="label"><Bilingual en="Sending Company" ur="بھیجنے والی کمپنی" /></div>
              <div>{delivery.sourceCompany}</div>
            </div>
          )}
          {hasOriginCity && (
            <div>
              <div className="label"><Bilingual en="Origin City" ur="شہر" /></div>
              <div>{delivery.originCity}</div>
            </div>
          )}
          {hasOriginalBillNumber && (
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="label"><Bilingual en="Original Bilty #" ur="اصل بلٹی نمبر" /></div>
              <div>{delivery.originalBillNumber}</div>
            </div>
          )}
        </div>
      )}

      <div className="slip-parties">
        <div>
          <div className="label"><Bilingual en="Sender" ur="بھیجنے والا" /></div>
          <div>{delivery.senderName || '—'}</div>
          {hasSenderPhone && <div>{delivery.senderPhone}</div>}
        </div>
        <div>
          <div className="label"><Bilingual en="Receiver" ur="وصول کنندہ" /></div>
          <div>{delivery.receiverName}</div>
          <div>{delivery.receiverPhone}</div>
        </div>
      </div>

      <table className="slip-table">
        <tbody>
          <tr>
            <td><Bilingual en="Substance" ur="مال کی قسم" /></td>
            <td>{delivery.substanceType}</td>
          </tr>
          {hasWeight && (
            <tr>
              <td><Bilingual en="Weight / Volume" ur="وزن" /></td>
              <td>{delivery.weightOrVolume}</td>
            </tr>
          )}
          <tr>
            <td><Bilingual en="Pieces" ur="تعداد" /></td>
            <td>{delivery.pieceCount}</td>
          </tr>
          {hasCost && (
            <tr>
              <td><Bilingual en="Cost" ur="کرایہ" /></td>
              <td>{formatPKR(delivery.cost)}</td>
            </tr>
          )}
          {hasGodamCharges && (
            <tr>
              <td><Bilingual en="Godam Charges" ur="گودام چارجز" /></td>
              <td>{formatPKR(delivery.godamCharges)}</td>
            </tr>
          )}
          {hasLabourCost && (
            <tr>
              <td><Bilingual en="Labour" ur="مزدوری" /></td>
              <td>{formatPKR(delivery.labourCost)}</td>
            </tr>
          )}
        </tbody>
      </table>

      {(hasCost || hasGodamCharges || hasLabourCost) && (
        <div className="slip-total">
          <span className="label"><Bilingual en="Total Declared Amount" ur="کل مقررہ رقم" /></span>
          <span className="value">{formatPKR(totalDeclared)}</span>
        </div>
      )}

      {hasNotes && (
        <div style={{ fontSize: '0.82rem', color: '#4b5563', marginTop: 10 }}>
          <bdi className="ur">نوٹ / </bdi>{delivery.notes}
        </div>
      )}

      <div className="slip-footer">
        <div>Riyasat Swat Goods Transport — Receiving Record</div>
        <div className="footer-note">
          <bdi className="ur">
            یہ مال {delivery.receiverName} کے نام موصول ہوا ہے۔ برائے کرم رابطہ نمبر پر کال کر کے مال وصول کرنے کی اطلاع دیں۔
          </bdi>
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

export default DeliverySlipTemplate;
