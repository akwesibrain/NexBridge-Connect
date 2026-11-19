# Nexbridge Connect — DIRECTION

## Brief (self-authored from prior build + user answers)
- **What / who:** Enterprise SMS platform (web app, ~45 screens) for Ghanaian
  businesses, financial institutions, schools, hospitals, retail, government
  and developers. Also an admin console.
- **The daily job:** send messages and see whether they are being delivered.
  The core screen leads with that, not a KPI-card row.
- **Feel (user-chosen):** warm · human · approachable.
- **Exists:** the app is already built (React + Vite + Tailwind + Recharts).
  This pass gives it a real direction. Mock data only; no paid image credits.

## Category default being refused
Enterprise SMS/comms dashboards (and the earlier Nexbridge build) all share:
a **navy/blue** palette, Inter, and a **row of KPI cards** as the first thing
(slop face 3, "the shadcn Dashboard"). The category colour cliché is blue =
"trust/telecom". We refuse blue, refuse the KPI reflex, and refuse Inter.

## Concept (chosen: C — Daybreak delta)
> Nexbridge Connect is a **river delta at sunrise**: one message leaves you and
> fans out across every network until it reaches many hands.

Source family: **nature**. Warm, hopeful, human; "delivery" becomes water
reaching the river mouths. (The other two explored: A "post counter" — warm
ledger; B "woven signal" — delivery loom. A was most scalable, B most
memorable; the user picked C for warmth.)

## Tokens

### Neutrals (warm, plum-tinted)
| role | light |
|---|---|
| page ground | `#fdfbf8` |
| surface / card | `#ffffff` |
| surface muted | `#f7f3ee` |
| sunken | `#efe9e2` |
| hairline | `#ece6df` |
| ink (headings) | `#241f26` |
| ink body | `#4f4654` |
| ink secondary | `#675c66` (passes AA on white) |
| ink muted | `#7a6f78` |

**Warm-dark** surfaces (landing hero, auth panel, wallet card) use the same
ramp deep end `#1f1922`–`#2a2130` — an "evening delta", still warm.

### Accent — coral (sunrise), one job: the primary action + "needs you"
| role | value | use |
|---|---|---|
| coral bright | `#ef6a43` | large shapes, the delta, illustration (non-text) |
| coral 600 | `#cf4e2a` | button fills (white text passes AA) |
| coral 700 | `#b8431f` | accent text / links on white (AA) |
| coral 50 / 100 | `#fff1ec` / `#ffe0d4` | tints |

Dawn field (hero only): `#ffe4d0 → #ffd8c4 → #ffe0e6`, a purposeful colour
field (direction F), not decoration. Hero ink `#3a2318` on it ≈ 9:1.

### Status (word + shape carry it; hue only for urgency)
delivered/active = green `#1f7a4d` on tint; in-transit/pending = amber
`#8a5a12`; failed/rejected = red `#a3281d`. Tints are the 50-step of each.

### Type
- **Baloo 2** (display/headings) — rounded, warm terminals read *human and
  approachable* at 600–700 without being childish. Carries the brief.
- **Hanken Grotesk** (body/UI, 13.5–14px) — humanist grotesque, warm, superb
  in dense tables. Not a default-reach UI font.
- **Spline Sans Mono** (figures) — tabular numbers for counts, money, API;
  character without JetBrains.
- Scale: 12 · 13.5 · 15 · 18 · 21 · 27 · 34 (7 steps).

### Shape / space
Rounded family to match the type: inputs & buttons `11px`, cards `16–20px`,
pills full. Group with space + hairlines; boxes only where something floats.

## Richness source (first screen)
The **delta** is the richness: an SVG river-delta from one source node fanning
through branches to four network mouths (MTN, Telecel, AirtelTigo, + others),
with coral delivery-pulses flowing downstream. Honest to the data (branch
weight = traffic share), not decoration.

## Grammar / shell
Light **sidebar** (white, warm ink, coral active) + warm top bar. Comfortable
density. Dashboard = dawn hero (delta + the one number + the one action) →
recent messages + "pick up where you left off" → quiet supporting data.
Everything else is a calm document so the user's content is loudest.

## Signature moment
**Daybreak delta flow.** On load, coral pulses travel the delta branches from
source to the river mouths and fade as they "arrive"; the delivered count rolls
up once (odometer). Trigger: page load + a slow 3–4s loop. Reduced motion: the
delta is drawn and still, pulses shown at rest at the mouths; the count is
final. Built in SVG/CSS, visible without JS.

## Voice
Plain, warm, first-person-plural where it helps. "Good things are on their way
to 1.28M people." Never "supercharge / seamless / unlock". Say the real thing.

## Content
Uses the existing mock data (Horizon Retail Group; HORIZON / HRZ-OTP /
HRZ-PROMO sender IDs; 1.28M sent, 94.2% delivered, 48,250 credits; real Ghana
numbers and message bodies). States designed: empty, loading (skeleton),
error, and the delivery "in transit" partial state.
