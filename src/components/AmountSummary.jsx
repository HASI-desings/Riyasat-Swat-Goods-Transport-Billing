// Live total display. The total amount is the single most visually
// dominant element (app.md §7) — large tabular-numeral type, amber accent.
import React from 'react';
import { formatPKR } from '../lib/calculateTotal';

export default function AmountSummary({ calc }) {
  return (
    <div className="amount-summary">
      <div className="total-label">Total Amount</div>
      <div className="total-value">{formatPKR(calc.total)}</div>
      <div className="amount-breakdown">
        <div className="row"><span>Amount (pieces × rate)</span><span>{formatPKR(calc.amount)}</span></div>
        {calc.tollTax !== null && (
          <div className="row"><span>Toll Tax</span><span>{formatPKR(calc.tollTax)}</span></div>
        )}
        {calc.companyCommission !== null && (
          <div className="row"><span>Company Commission</span><span>{formatPKR(calc.companyCommission)}</span></div>
        )}
        <div className="row"><span>Labour Cost</span><span>{formatPKR(calc.labourCost)}</span></div>
        {calc.kharcha !== null && (
          <div className="row"><span>Kharcha</span><span>{formatPKR(calc.kharcha)}</span></div>
        )}
      </div>
    </div>
  );
}
