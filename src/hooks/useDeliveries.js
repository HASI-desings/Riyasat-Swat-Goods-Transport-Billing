// CRUD + search for the Receiving module. A "delivery" here is an item
// that arrived FROM another transport company/city and is sitting in our
// inventory waiting for the receiver to be called and handed the item —
// the reverse flow of our own outgoing bills.
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { withTimeout } from '../lib/withTimeout';

function toRow(d) {
  return {
    date_received: d.dateReceived,
    source_company: d.sourceCompany || null,
    origin_city: d.originCity || null,
    original_bill_number: d.originalBillNumber || null,
    sender_name: d.senderName,
    sender_phone: d.senderPhone || null,
    receiver_name: d.receiverName,
    receiver_phone: d.receiverPhone,
    substance_type: d.substanceType,
    weight_or_volume: d.weightOrVolume || null,
    piece_count: d.pieceCount,
    amount: d.amount || null,
    notes: d.notes || null,
  };
}

function fromRow(row) {
  return {
    id: row.id,
    dateReceived: row.date_received,
    sourceCompany: row.source_company,
    originCity: row.origin_city,
    originalBillNumber: row.original_bill_number,
    senderName: row.sender_name,
    senderPhone: row.sender_phone,
    receiverName: row.receiver_name,
    receiverPhone: row.receiver_phone,
    substanceType: row.substance_type,
    weightOrVolume: row.weight_or_volume,
    pieceCount: row.piece_count,
    amount: row.amount,
    notes: row.notes,
    status: row.status,
    deliveredAt: row.delivered_at,
    createdAt: row.created_at,
  };
}

export function useDeliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('deliveries')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setDeliveries((data || []).map(fromRow));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addDelivery = useCallback(async (delivery) => {
    try {
      const { data, error: err } = await withTimeout(
        supabase.from('deliveries').insert(toRow(delivery)).select().single()
      );
      if (err) return { ok: false, reason: "Couldn't save — check your connection and try again.", detail: err.message };
      // The insert already succeeded — that's the save. Refresh the list
      // in the background so the button never waits on a second request.
      refresh();
      return { ok: true, delivery: fromRow(data) };
    } catch (err) {
      return { ok: false, reason: "Couldn't save — check your connection and try again.", detail: err.message };
    }
  }, [refresh]);

  const markDelivered = useCallback(async (id) => {
    const { error: err } = await supabase
      .from('deliveries')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', id);
    if (!err) await refresh();
    return { ok: !err, reason: err?.message };
  }, [refresh]);

  const markPending = useCallback(async (id) => {
    const { error: err } = await supabase
      .from('deliveries')
      .update({ status: 'pending', delivered_at: null })
      .eq('id', id);
    if (!err) await refresh();
    return { ok: !err, reason: err?.message };
  }, [refresh]);

  const inventory = deliveries.filter((d) => d.status === 'pending');

  const search = useCallback((query, list = deliveries) => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter((d) =>
      [d.receiverName, d.receiverPhone, d.senderName, d.originCity, d.sourceCompany, d.substanceType, d.originalBillNumber]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    );
  }, [deliveries]);

  return { deliveries, inventory, loading, error, refresh, addDelivery, markDelivered, markPending, search };
}
