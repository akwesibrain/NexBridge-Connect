# Nexbridge Connect — Critique

Direction: **Daybreak delta** (warm · human · approachable). Self-critiqued
(no independent critic agent spawned, to respect plan cost — an independent
critic pass is available on request).

## Rounds
- **r1** — applied Daybreak tokens + shell + delta signature. 7 FAILs on the
  dashboard (coral AA, clipped hero number, greeting-over-gradient, sidebar
  label sizes). All fixed.
- **r2** — systemic fix: swept cool `slate` greys → warm `navy` ramp across all
  24 components/pages (the warm ground had pushed borderline greys under AA);
  deepened coral `brand-600/700` for AA; labelled icon-only buttons.
- **r3–r5** — Wallet button class-conflict (white-on-white), footer contrast,
  chart axis clipping + compact number formatting, admin revenue card overflow,
  Windows High-Contrast control shapes. All fixed.

**Final: 0 scan FAILs on dashboard, quick-sms, campaigns, wallet, api-docs,
admin, login, landing. 0 matrix FAILs** (Windows 125/150/HC, Linux, Android,
mac, 320 reflow, reduced-motion, l10n).

## The six tests (slop.md §9)
1. **Swap** — a blue/Inter telecom competitor's logo looks wrong on the warm
   cream + coral + Baloo system. Pass.
2. **Squint** — each screen has one clear first thing: dashboard = hero
   headline + delta; tables = the table; admin = the overview. Pass.
3. **Face** — core dashboard avoids the KPI-card-first reflex (leads with the
   work + delta). Not Paper Edition, not Launch Page, not Dark Dev Tool
   (customer app is light). Pass. *Caveat:* Campaigns and Admin open with a
   metric-card row (1 shared feature of face 3) — acceptable on secondary/ops
   screens, under the 3-feature threshold.
4. **Specificity** — coral = sunrise/delta concept; Baloo = the "approachable"
   brief; cream = warmth; delta fans to the real GH networks. All defensible.
5. **Screenshot** — the delta hero is the distinctive, postable moment. Pass.
6. **Subtraction** — the dashboard runs ~9 regions; it survives but is on the
   dense side. Could drop "recent activity" or "recent transactions". Noted.

## Rubric (self-scored, harsh)
| Axis | Score /5 | Note |
|---|---|---|
| Concept & distinctiveness | 4.5 | Delta is specific and ownable; scales as a motif in the mark + hero |
| Typography | 4 | Baloo/Hanken/Spline trio with reasons; could use one more display moment on inner pages |
| Colour | 4.5 | One coral accent, warm neutrals, status by word+shape; all AA |
| Layout & space | 4 | Hairlines + space; some card nesting remains on dashboard |
| Richness & signature | 4.5 | Delta flow is honest (branch = network) and animated; reduced-motion safe |
| Motion | 4 | Delta pulses + axis draw; quiet elsewhere. No scroll-reveal slop |
| Accessibility | 4.5 | AA throughout, labels/names, focus, HC shapes, reduced motion |
| Responsive | 4.5 | Phone hero stacks; tables scroll; 320 reflow clean |

## Warnings answered (deliberate)
- **24 shadows / boxes-in-boxes** — an operational dashboard is made of panels;
  shadow is one subtle `card` layer. Reduced where it was decorative.
- **Icons in tinted squares (3)** — only on the "resume work" chips, where the
  tint aids scannability of a short, fixed list.
- **Stock outline icons at 2px** — Lucide at 1.8px in the sidebar; one icon set,
  used sparingly. Matching every stroke to type weight is a later polish.
- **Letter-spaced uppercase labels** — only the sidebar group headers and the
  one admin/dev "illustrative data" notice; not an eyebrow over every section.
- **11px text** — metadata/timestamps only (13px floor for running text).
- **Metric-card row on Campaigns/Admin** — kept: ops users scan counts there;
  the core dashboard deliberately does not lead with them.

## Could not verify
- Real Windows ClearType glyph rendering, real screen readers, real devices.
- **Firefox & WebKit/Safari engines are not installed**, so those matrix passes
  used Chrome emulation (UA/metrics), not the real engines.
- Real performance (the JS bundle is ~800KB/218KB gzip, one chunk — fine for an
  authed app; route code-splitting would trim it).
