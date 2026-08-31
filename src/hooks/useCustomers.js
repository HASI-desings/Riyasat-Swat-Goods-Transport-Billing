// CRUD for saved customers, sorted most-used first.
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('customers')
      .select('*')
      .order('times_used', { ascending: false })
      .order('name', { ascending: true });
    if (err) setError(err.message);
    else setCustomers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addCustomer = useCallback(async (customer) => {
    const { data, error: err } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        phone: customer.phone || null,
        default_destination: customer.defaultDestination || null,
        times_used: 1,
      })
      .select()
      .single();
    if (err) return { ok: false, reason: err.message };
    setCustomers((prev) => [data, ...prev]);
    return { ok: true, customer: data };
  }, []);

  const bumpUsage = useCallback(async (customerId) => {
    const { error: err } = await supabase.rpc('increment_customer_usage', {
      customer_id: customerId,
    });
    if (!err) refresh();
  }, [refresh]);

  const updateCustomer = useCallback(async (id, patch) => {
    const { error: err } = await supabase.from('customers').update(patch).eq('id', id);
    if (!err) refresh();
    return { ok: !err, reason: err?.message };
  }, [refresh]);

  const deleteCustomer = useCallback(async (id) => {
    const { error: err } = await supabase.from('customers').delete().eq('id', id);
    if (!err) setCustomers((prev) => prev.filter((c) => c.id !== id));
    return { ok: !err, reason: err?.message };
  }, []);

  const findByName = useCallback(
    (name) => customers.find((c) => c.name.toLowerCase() === (name || '').toLowerCase()),
    [customers]
  );

  return { customers, loading, error, refresh, addCustomer, updateCustomer, deleteCustomer, bumpUsage, findByName };
}
