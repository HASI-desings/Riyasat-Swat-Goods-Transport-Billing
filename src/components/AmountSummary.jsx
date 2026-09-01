// Live total display. The total amount is the single most visually
// dominant element (app.md §7) — large tabular-numeral type, amber accent.
import React from 'react';
import { formatPKR } from '../lib/calculateTotal';

export default function AmountSummary({ calc }) {
  return (
    <div className="amount-summary">
      <div className="total-label">Total Amount <span className="ur">/ کل رقم</span></div>
      <div className="total-value">{formatPKR(calc.total)}</div>
      <div className="amount-breakdown">
        <div className="row"><span>Amount (pieces × rate) <span className="ur">/ تفصیلی کرایہ</span></span><span>{formatPKR(calc.amount)}</span></div>
        {calc.tollTax !== null && (
          <div className="row"><span>Toll Tax <span className="ur">/ ٹول ٹیکس</span></span><span>{formatPKR(calc.tollTax)}</span></div>
        )}
        {calc.companyCommission !== null && (
          <div className="row"><span>Company Commission <span className="ur">/ کمپنی کمیشن</span></span><span>{formatPKR(calc.companyCommission)}</span></div>
        )}
        <div className="row"><span>Labour Cost <span className="ur">/ مزدوری</span></span><span>{formatPKR(calc.labourCost)}</span></div>
        {calc.kharcha !== null && (
          <div className="row"><span>Kharcha <span className="ur">/ خرچہ</span></span><span>{formatPKR(calc.kharcha)}</span></div>
        )}
      </div>
    </div>
  );
}
