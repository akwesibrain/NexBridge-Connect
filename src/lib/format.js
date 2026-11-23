export const fmtInt = (n) => new Intl.NumberFormat("en-US").format(Math.round(Number(n) || 0));
const safeNum = (n) => (Number.isFinite(Number(n)) ? Number(n) : 0);
export const fmtGhs = (n) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: 2 }).format(safeNum(n));
// Per-SMS rates are fractions of a pesewa apart (0.0250 vs 0.0232), so they
// need more precision than the 2-decimal currency default.
export const fmtRate = (n) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(safeNum(n));
export const fmtPct = (n, d = 1) => `${(Number(n) || 0).toFixed(d)}%`;
export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const relTime = (d) => {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 0) {
    const f = -s;
    if (f < 3600) return `in ${Math.max(1, Math.round(f / 60))}m`;
    if (f < 86400) return `in ${Math.round(f / 3600)}h`;
    return `in ${Math.round(f / 86400)}d`;
  }
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
// GSM-7 vs UCS-2 segment calculation. The basic set includes LF and CR;
// the extension set (each costs 2 septets) includes the backslash.
const GSM = "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !\"#¤%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà";
const GSM_EXT = "^{}\\[~]|€\f";
export function smsSegments(text = "") {
  const chars = [...text];
  const unicode = chars.some((c) => !GSM.includes(c) && !GSM_EXT.includes(c));
  let len = 0;
  if (unicode) {
    // UCS-2 counts UTF-16 code units: emoji and other astral chars take 2.
    for (const c of chars) len += c.length;
  } else {
    for (const c of chars) len += GSM_EXT.includes(c) ? 2 : 1;
  }
  const single = unicode ? 70 : 160;
  const multi = unicode ? 67 : 153;
  const segments = len === 0 ? 0 : len <= single ? 1 : Math.ceil(len / multi);
  const perSegment = segments <= 1 ? single : multi;
  // Characters still free in the current (last) segment.
  const remaining = segments === 0 ? single : segments * perSegment - len;
  return { length: len, unicode, segments, perSegment, remaining };
}
