# RealNov8 ROI Calculator

RealNov8 ROI Calculator is a production-ready React + Vite application for real estate professionals who need a polished way to analyse rental property returns, export branded PDF reports, capture leads, and white-label the experience for their agency.

## Features

- ROI calculator with cash-on-cash ROI, monthly cash flow, cap rate, gross yield, break-even occupancy, and 5-year projection
- Warm editorial design system with shared theme tokens
- Branded PDF export using `jsPDF` and `html2canvas`
- White-label configuration with local persistence for company name, logo, accent colour, and agent details
- Saved properties workflow with compare mode
- Lead capture modal with EmailJS integration and graceful fallback when EmailJS is not configured
- Sales / pricing page for commercial rollout

## Stack

- React 19 + Vite
- React Router v6
- Tailwind CSS v4 for layout and spacing
- Recharts
- jsPDF
- html2canvas
- EmailJS browser SDK

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Run checks:

```bash
npm run lint
npm run test
npm run build
```

## EmailJS Setup

Create a `.env` file in the project root with:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

The app expects these template variables:

- `{{to_name}}`
- `{{to_email}}`
- `{{property_price}}`
- `{{monthly_rent}}`
- `{{annual_roi}}`
- `{{monthly_cashflow}}`
- `{{cap_rate}}`
- `{{gross_yield}}`
- `{{agent_name}}`
- `{{agent_email}}`
- `{{user_phone}}`
- `{{user_type}}`

If EmailJS is not configured, the lead capture modal still shows a successful completion state so the user flow is not blocked.

## White-label Configuration

White-label settings are stored in `localStorage` under:

- `realnov8_whitelabel`

Saved property records are stored under:

- `realnov8_saved_properties`

The white-label screen allows agencies to set:

- Company name
- Logo image stored as base64
- Primary brand colour
- Agent full name
- Agent email
- Agent phone
- Custom footer text

These settings update the live application immediately, including the masthead, PDF branding, and preview areas.

## Deployment

This project is configured for Vercel SPA deployment.

### Build settings

- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`

### Environment variables

Add the EmailJS values in the Vercel project settings if you want live email delivery:

- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

## Routes

- `/` calculator
- `/saved` saved properties
- `/pricing` sales and pricing page
- `/white-label` white-label configuration

## Notes

- PDF export is intentionally desktop-only in the UI.
- The current production build passes lint, tests, and build checks.
- Vite may warn about large chunks because of the PDF/export stack. A later optimization pass can code-split those paths if needed.
