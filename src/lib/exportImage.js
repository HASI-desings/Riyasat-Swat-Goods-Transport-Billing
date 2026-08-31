// DOM-to-PNG rendering for the slip. Falls back gracefully rather than
// crashing the app (security.md — PNG export failure).
import { toPng } from 'html-to-image';

export async function exportSlipAsPng(node, filename = 'bill.png') {
  if (!node) return { ok: false, reason: 'no-node' };
  try {
    const dataUrl = await toPng(node, { pixelRatio: 2, backgroundColor: '#f6f4ee' });
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
    return { ok: true, dataUrl };
  } catch (err) {
    return { ok: false, reason: err.message || 'export-failed' };
  }
}
