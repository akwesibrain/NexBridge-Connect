export const fmtInt = (n) => new Intl.NumberFormat("en-US").format(Math.round(Number(n) || 0));
export const fmtGhs = (n) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: 2 }).format(Number(n) || 0);
export const fmtPct = (n, d = 1) => `${(Number(n) || 0).toFixed(d)}%`;
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const relTime = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
// GSM-7 vs UCS-2 segment calculation (the correct one TxtConnect got wrong)
const GSM = "@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_EXT = "^{}\[~]|€";
export function smsSegments(text = "") {
  const unicode = [...text].some((c) => !GSM.includes(c) && !GSM_EXT.includes(c));
  let len = 0;
  for (const c of text) len += !unicode && GSM_EXT.includes(c) ? 2 : 1;
  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  const segments = len === 0 ? 0 : len <= single ? 1 : Math.ceil(len / multi);
  return { length: len, unicode, segments, perSegment: segments <= 1 ? single : multi };
}
