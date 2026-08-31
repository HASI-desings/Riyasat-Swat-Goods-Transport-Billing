// CRUD + search for bills in Supabase, with an offline-first save path:
// if the network write fails, the bill is queued locally and synced
// automatically once the connection returns (security.md).
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { offlineQueue } from '../lib/storage';
import { reserveNextBillNumber } from '../lib/billNumber';

function toRow(bill) {
  return {
    bill_number: bill.billNumber,
    date: bill.date,
    branch_id: bill.branchId,
    sender_name: bill.senderName,
    sender_phone: bill.senderPhone || null,
    receiver_name: bill.receiverName,
    receiver_phone: bill.receiverPhone || null,
    destination: bill.destination,
    substance_type: bill.substanceType,
    weight_or_volume: bill.weightOrVolume || null,
    piece_count: bill.pieceCount,
    rate_per_piece: bill.ratePerPiece,
    discounted_rate: bill.discountedRate || null,
    amount: bill.amount,
    toll_tax: bill.tollTax,
    company_commission: bill.companyCommission,
    labour_cost: bill.labourCost,
    kharcha: bill.kharcha,
    total_amount: bill.total,
  };
}

function fromRow(row) {
  return {
    id: row.id,
    billNumber: row.bill_number,
    date: row.date,
    branchId: row.branch_id,
    senderName: row.sender_name,
    senderPhone: row.sender_phone,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    destination: row.destination,
    substanceType: row.substance_type,
    weightOrVolume: row.weight_or_volume,
    pieceCount: row.piece_count,
    ratePerPiece: row.rate_per_piece,
    discountedRate: row.discounted_rate,
    amount: row.amount,
    tollTax: row.toll_tax,
    companyCommission: row.company_commission,
    labourCost: row.labour_cost,
    kharcha: row.kharcha,
    total: row.total_amount,
    createdAt: row.created_at,
  };
}

export function useBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('bills')
      .select('*')
      .order('bill_number', { ascending: false });
    if (err) setError(err.message);
    else setBills((data || []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Attempt to flush any locally-queued bills that failed to save earlier.
  const syncQueue = useCallback(async () => {
    const queued = offlineQueue.getAll();
    for (const entry of queued) {
      try {
        const { error: err } = await supabase.from('bills').insert(toRow(entry.bill));
        if (!err) offlineQueue.remove(entry.localId);
      } catch {
        // still offline / still failing — leave in queue, try again next time
      }
    }
    if (queued.length) refresh();
  }, [refresh]);

  useEffect(() => {
    if (isOnline) syncQueue();
  }, [isOnline, syncQueue]);

  const saveBill = useCallback(async (billWithoutNumber) => {
    let billNumber = billWithoutNumber.billNumber;
    try {
      if (!billNumber) {
        billNumber = await reserveNextBillNumber();
      }
      const bill = { ...billWithoutNumber, billNumber };
      const { data: inserted, error: err } = await supabase
        .from('bills')
        .insert(toRow(bill))
        .select()
        .single();
      if (err) {
        // Duplicate bill number race — retry once with a fresh number.
        if (err.code === '23505') {
          const retryNumber = await reserveNextBillNumber();
          const retryBill = { ...bill, billNumber: retryNumber };
          const { data: retryInserted, error: err2 } = await supabase
            .from('bills')
            .insert(toRow(retryBill))
            .select()
            .single();
          if (err2) throw err2;
          await refresh();
          return { ok: true, bill: fromRow(retryInserted) };
        }
        throw err;
      }
      await refresh();
      return { ok: true, bill: fromRow(inserted) };
    } catch (err) {
      // Network/Supabase failure — never lose the admin's typed data.
      // Queue locally (with a temporary number if none was reserved) and
      // report a friendly, non-technical error with a retry action.
      const fallbackNumber = billNumber || `TEMP-${Date.now()}`;
      offlineQueue.add({ ...billWithoutNumber, billNumber: fallbackNumber });
      return {
        ok: false,
        queued: true,
        reason: "Couldn't save — check your connection and try again.",
        detail: err.message,
      };
    }
  }, [refresh]);

  const search = useCallback((query) => {
    if (!query) return bills;
    const q = query.toLowerCase();
    return bills.filter((b) =>
      [b.billNumber, b.senderName, b.receiverName, b.destination, b.substanceType]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [bills]);

  return { bills, loading, error, isOnline, refresh, saveBill, search, syncQueue };
}
