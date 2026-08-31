// Sequential invoice numbering. Bill numbers start at 1, are never reused,
// and are assigned via a Postgres function (see supabase/schema.sql ->
// next_bill_number()) so concurrent saves never collide. On a unique-
// constraint conflict, we retry with the next number automatically
// (see security.md — duplicate/conflicting bill number).
import { supabase } from './supabaseClient';

export function formatBillNumber(n) {
  return `RSGT-${String(n).padStart(4, '0')}`;
}

export async function reserveNextBillNumber() {
  const { data, error } = await supabase.rpc('next_bill_number');
  if (error) throw error;
  return data; // integer
}
