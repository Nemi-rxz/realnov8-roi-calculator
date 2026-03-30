import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useWhiteLabel from '../hooks/useWhiteLabel'

const featureCards = [
  {
    label: 'Instant ROI Analysis',
    description: 'Turn property assumptions into cash flow, cap rate, gross yield, and break-even occupancy in one calm, client-facing screen.',
  },
  {
    label: 'Branded PDF Reports',
    description: 'Create polished investment reports your team can share with buyers, investors, and internal decision-makers.',
  },
  {
    label: 'White-label Ready',
    description: 'Swap in your company name, colour, logo, and agent details so the tool feels native to your agency.',
  },
]

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    highlight: false,
    description: 'A public-facing ROI calculator for lead generation and fast first-pass analysis.',
    features: [
      'Calculator only',
      'RealNov8 branding',
      'No PDF export',
      'No saved properties',
    ],
  },
  {
    name: 'Pro',
    price: '$49',
    cadence: '/mo',
    highlight: true,
    badge: 'Most popular',
    description: 'A working sales asset for individual agents, brokers, and small teams.',
    features: [
      'Full calculator',
      'PDF export',
      'Save up to 20 properties',
      'Lead capture',
      'Remove RealNov8 branding',
    ],
  },
  {
    name: 'Agency',
    price: '$149',
    cadence: '/mo',
    highlight: false,
    description: 'A complete white-label toolkit for agencies selling investment expertise at scale.',
    features: [
      'Everything in Pro',
      'White-label config',
      'Unlimited saves',
      'Priority support',
      'Custom domain embed code',
    ],
  },
]

const comparisonRows = [
  ['Calculator access', 'Yes', 'Yes', 'Yes'],
  ['RealNov8 branding removed', 'No', 'Yes', 'Yes'],
  ['PDF export', 'No', 'Yes', 'Yes'],
  ['Saved properties', 'No', '20 properties', 'Unlimited'],
  ['Lead capture emails', 'No', 'Yes', 'Yes'],
  ['White-label branding controls', 'No', 'No', 'Yes'],
  ['Priority support', 'No', 'No', 'Yes'],
  ['Custom domain embed code', 'No', 'No', 'Yes'],
]

const testimonials = [
  {
    quote: 'It changed the tone of our investor conversations overnight. Clients felt they were looking at something serious, not a toy widget.',
    author: 'Managing Broker, Houston',
  },
  {
    quote: 'The PDF reports helped us move from rough back-of-napkin estimates to a repeatable advisory process our whole team could use.',
    author: 'Investment Sales Lead, Atlanta',
  },
  {
    quote: 'White-labelling made the calculator feel like a built-in part of our brand. Prospects now remember the experience, not the spreadsheet.',
    author: 'Agency Founder, Phoenix',
  },
]

function PricingPage() {
  const { config } = useWhiteLabel()

  useEffect(() => {
    document.title = 'Pricing | RealNov8'
  }, [])

  return (
    <section className="space-y-6">
      <section className="sales-hero">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div>
            <p className="section-label text-[rgba(255,255,255,0.5)]">Pricing</p>
            <h1 className="mt-3 max-w-4xl text-5xl font-bold text-[var(--color-page-bg)] sm:text-6xl">
              The ROI calculator your clients will trust and your competitors do not have
            </h1>
            <p className="mt-5 max-w-2xl text-base text-[rgba(255,255,255,0.72)] sm:text-lg">
              Built for real estate professionals who want sharper conversations, better-looking analysis, and a branded experience clients actually remember.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary" style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)', color: 'var(--color-ink)' }} to="/">
                Try the calculator free
              </Link>
              <a className="button-secondary" href="#pricing-tiers">
                See pricing
              </a>
            </div>
          </div>

          <div className="sales-preview-card">
            <div className="sales-preview-masthead">
              <p className="sales-preview-brand">{config.companyName}</p>
              <p className="sales-preview-tagline">Property investment analysis for serious client conversations</p>
            </div>
            <div className="sales-preview-body">
              <div className="sales-preview-grid">
                <div className="sales-preview-panel">
                  <p className="section-label">Property Details</p>
                  <div className="mt-4 grid gap-3">
                    <div className="sales-preview-input">$ Purchase price</div>
                    <div className="sales-preview-input">$ Down payment</div>
                    <div className="sales-preview-input">% Mortgage rate</div>
                  </div>
                </div>
                <div className="sales-preview-panel">
                  <p className="section-label">Key Metrics</p>
                  <div className="mt-4 grid gap-3">
                    <div className="sales-preview-metric sales-preview-metric-dark">
                      <span className="section-label text-[rgba(255,255,255,0.58)]">Annual ROI</span>
                      <span className="sales-preview-number" style={{ color: config.accentColor }}>
                        12.4%
                      </span>
                    </div>
                    <div className="sales-preview-metric">
                      <span className="section-label">Cash Flow</span>
                      <span className="sales-preview-number text-[var(--color-positive)]">$640</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
        <p className="section-label">What It Does</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature.label} className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5">
              <h2 className="text-3xl font-bold text-[var(--color-ink)]">{feature.label}</h2>
              <p className="mt-4 text-sm text-[var(--color-secondary)]">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8" id="pricing-tiers">
        <p className="section-label">Pricing Tiers</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`pricing-tier-card ${tier.highlight ? 'pricing-tier-card-highlight' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-label">{tier.name}</p>
                  <p className="mt-4 font-[var(--font-editorial)] text-5xl leading-none text-[var(--color-ink)]">
                    {tier.price}
                    <span className="ml-1 text-xl text-[var(--color-secondary)]">{tier.cadence}</span>
                  </p>
                </div>
                {tier.badge ? <span className="pricing-badge">{tier.badge}</span> : null}
              </div>
              <p className="mt-5 text-sm text-[var(--color-secondary)]">{tier.description}</p>
              <div className="mt-6 grid gap-3">
                {tier.features.map((feature) => (
                  <p key={`${tier.name}-${feature}`} className="text-sm text-[var(--color-secondary)]">
                    {feature}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
        <p className="section-label">Feature Comparison</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-[#f5f0e8]">
                <th className="breakdown-head text-left">Feature</th>
                <th className="breakdown-head text-right">Free</th>
                <th className="breakdown-head text-right">Pro</th>
                <th className="breakdown-head text-right">Agency</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row[0]}>
                  <td className="breakdown-cell">{row[0]}</td>
                  <td className="breakdown-cell text-right">{row[1]}</td>
                  <td className="breakdown-cell text-right">{row[2]}</td>
                  <td className="breakdown-cell text-right">{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
        <p className="section-label">Built For Real Estate Professionals</p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.author} className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-gold-light)] p-5">
              <p className="font-[var(--font-editorial)] text-3xl leading-tight text-[var(--color-ink)]">
                "{testimonial.quote}"
              </p>
              <p className="mt-5 text-sm text-[var(--color-secondary)]">{testimonial.author}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-panel">
        <p className="section-label text-[rgba(255,255,255,0.5)]">Get Started</p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="max-w-3xl text-4xl font-bold text-[var(--color-accent)] sm:text-5xl">
              Bring a premium ROI experience into your agency before someone else does
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-[rgba(255,255,255,0.72)] sm:text-base">
              Start free, upgrade when your team is ready, and tailor the full experience to your brand.
            </p>
          </div>
          <Link className="button-primary" style={{ backgroundColor: 'var(--color-accent)', borderColor: 'var(--color-accent)', color: 'var(--color-ink)' }} to="/">
            Get started free
          </Link>
        </div>
      </section>
    </section>
  )
}

PricingPage.propTypes = {}

export default PricingPage
