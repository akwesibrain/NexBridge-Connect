# Nexbridge Connect

**Enterprise SMS messaging platform — frontend**
Connect. Communicate. Deliver.

Copyright © 2026 Nexbridge Technology. Nexbridge Connect. All rights reserved.

---

## About

Nexbridge Connect is an enterprise messaging platform that enables businesses,
institutions and developers to reach customers through reliable SMS. This repository
is the **frontend application only**. It is built for the Ghanaian market with an
architecture ready for international expansion.

> **Development phase notice.** This is a frontend build. There is **no backend,
> database, SMS gateway, payment integration or real authentication**. All data is
> mock data held in local component state, and every action that would normally hit a
> server (sending messages, payments, approvals, API calls) is a clearly labelled
> simulated interaction.

## Tech stack

| Area | Choice |
|------|--------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router 6 |
| Styling | Tailwind CSS 3 (navy-blue enterprise design system) |
| Charts | Recharts |
| Icons | lucide-react |

## Getting started

```bash
npm install
npm run dev        # start the dev server (http://localhost:4000)
npm run build      # production build to /dist
npm run preview    # preview the production build
```

### Demo sign-in

Authentication is mocked. On the **Login** page, use the **Customer / Administrator**
toggle and any email + password to enter the respective workspace:

- Customer workspace → `/app`
- Admin console → `/admin`

## Structure

```
src/
  app/            Router + navigation config
  brand/          Logo and brand mark
  components/
    ui/           Reusable primitives (Button, Card, DataTable, Modal, …)
    charts/       Recharts wrappers
  data/mock.js    Single mock-data source for the whole app
  layouts/        Dashboard shell, customer & admin layouts
  lib/            Auth context, formatting, SMS-segment helpers
  pages/
    public/       Landing + pricing
    auth/         Login + register
    app/          Customer modules (messaging, contacts, senders, analytics,
                  finance, developers, account)
    admin/        Admin console modules
```

## Modules

- **Messaging** — overview, Quick SMS, Bulk SMS (multi-step campaign builder),
  campaigns, scheduled messages, templates.
- **Contacts** — directory, groups, import (CSV/Excel), export.
- **Sender IDs** — list and registration with approval statuses.
- **Analytics** — delivery reports, message history, campaign analytics.
- **Finance** — SMS wallet, buy credits (simulated checkout), transactions, pricing.
- **Developer Center** — API overview, keys, documentation (cURL/JS/PHP/Python),
  logs, webhooks.
- **Account** — profile, organization, team, notifications, security.
- **Admin console** — overview, customers, pricing, credits, sender IDs, campaign &
  transaction & API monitoring, system config, admin users, audit logs.

## Third-party dependencies & licenses

Nexbridge Technology owns the application code in this repository. It does **not** own
the third-party libraries it depends on; those remain under their respective licenses:

| Dependency | License |
|------------|---------|
| react, react-dom | MIT |
| react-router-dom | MIT |
| recharts | MIT |
| lucide-react (icons) | ISC |
| clsx | MIT |
| tailwindcss, vite, postcss, autoprefixer | MIT |
| Inter font (Google Fonts) | SIL Open Font License 1.1 |

Ownership notices for Nexbridge-owned work are kept separate from these third-party
licenses. See each package's own license for full terms.
