// Screen 2 — clean printable layout using SlipTemplate, with Print /
// WhatsApp / Save-as-PNG actions.
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SlipTemplate from '../components/SlipTemplate';
import ShareActions from '../components/ShareActions';
import { supabase } from '../lib/supabaseClient';

export default function SlipPreviewPage() {
  const { billId } = useParams();
  const location = useLocation();
  const slipRef = useRef(null);
  const [bill, setBill] = useState(location.state?.bill || null);
  const [loading, setLoading] = useState(!location.state?.bill);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bill) return;
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase.from('bills').select('*').eq('id', billId).maybeSingle();
      if (err) setError(err.message);
      else if (data) {
        setBill({
          id: data.id,
          billNumber: data.bill_number,
          date: data.date,
          branchId: data.branch_id,
          senderName: data.sender_name,
          senderPhone: data.sender_phone,
          receiverName: data.receiver_name,
          receiverPhone: data.receiver_phone,
          destination: data.destination,
          substanceType: data.substance_type,
          weightOrVolume: data.weight_or_volume,
          pieceCount: data.piece_count,
          ratePerPiece: data.rate_per_piece,
          discountedRate: data.discounted_rate,
          amount: data.amount,
          tollTax: data.toll_tax,
          companyCommission: data.company_commission,
          labourCost: data.labour_cost,
          kharcha: data.kharcha,
          total: data.total_amount,
        });
      } else {
        setError('Bill not found.');
      }
      setLoading(false);
    })();
  }, [billId, bill]);

  if (loading) return <div className="empty-state">Loading bill…</div>;
  if (error) return <div className="banner banner-error">{error}</div>;
  if (!bill) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div style={{ marginBottom: 14 }}>
        <Link to="/" className="btn btn-ghost" style={{ padding: 0 }}>← New Bill</Link>
      </div>

      <div className="print-area">
        <SlipTemplate ref={slipRef} bill={bill} />
      </div>

      <div style={{ marginTop: 16 }}>
        <ShareActions slipRef={slipRef} bill={bill} />
      </div>
    </motion.div>
  );
}
