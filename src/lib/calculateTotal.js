// Pure function: bill fields -> amounts. No UI code, no side effects,
// so it can be unit-tested and reused anywhere the total is needed
// (form live-calc, slip render, history list).

/**
 * @param {object} bill
 * @param {number} bill.pieceCount
 * @param {number} bill.ratePerPiece
 * @param {number|null} bill.discountedRate
 * @param {number|null} bill.tollTax
 * @param {number|null} bill.companyCommission
 * @param {number} bill.labourCost
 * @param {number|null} bill.kharcha
 */
export function calculateTotal(bill) {
  const pieceCount = toNumber(bill.pieceCount);
  const ratePerPiece = toNumber(bill.ratePerPiece);
  const discountedRate = isBlank(bill.discountedRate) ? null : toNumber(bill.discountedRate);
  const tollTax = isBlank(bill.tollTax) ? null : toNumber(bill.tollTax);
  const companyCommission = isBlank(bill.companyCommission) ? null : toNumber(bill.companyCommission);
  const labourCost = toNumber(bill.labourCost);
  const kharcha = isBlank(bill.kharcha) ? null : toNumber(bill.kharcha);

  const unitPrice = discountedRate !== null ? discountedRate : ratePerPiece;
  const amount = round2(pieceCount * unitPrice);

  const total = round2(
    amount +
      (tollTax !== null ? tollTax : 0) +
      (companyCommission !== null ? companyCommission : 0) +
      labourCost +
      (kharcha !== null ? kharcha : 0)
  );

  return {
    unitPrice,
    amount,
    tollTax,
    companyCommission,
    labourCost,
    kharcha,
    total,
  };
}

export function formatPKR(value) {
  const n = toNumber(value);
  return `Rs. ${n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function isBlank(v) {
  return v === null || v === undefined || v === '' || Number.isNaN(Number(v)) && v !== '0';
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
