// WhatsApp Share — Web Share API (mobile, supports image attachment) with
// a wa.me text-link fallback on desktop / unsupported browsers.
import { toPng } from 'html-to-image';

export async function shareSlipToWhatsApp(node, { phone, text } = {}) {
  if (!node) return { ok: false, reason: 'no-node' };
  try {
    const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#f6f4ee' });
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], 'bill.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Riyasat Swat Goods Transport — Bill',
        text: text || 'Your bill from Riyasat Swat Goods Transport',
      });
      return { ok: true, method: 'web-share' };
    }

    // Fallback: wa.me deep link (text only — image must be downloaded/attached manually)
    const digits = (phone || '').replace(/\D/g, '');
    const waUrl = `https://wa.me/${digits}?text=${encodeURIComponent(
      text || 'Your bill from Riyasat Swat Goods Transport'
    )}`;
    window.open(waUrl, '_blank', 'noopener');
    return { ok: true, method: 'wa-me-fallback' };
  } catch (err) {
    return { ok: false, reason: err.message || 'share-failed' };
  }
}
