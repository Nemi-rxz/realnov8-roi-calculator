import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import InputField from '../components/InputField'
import InvestmentVerdict from '../components/InvestmentVerdict'
import MetricCard from '../components/MetricCard'
import BreakdownTable from '../components/BreakdownTable'
import useROICalc from '../hooks/useROICalc'
import useSavedProperties from '../hooks/useSavedProperties'
import useWhiteLabel from '../hooks/useWhiteLabel'
import { exportPDFReport } from '../utils/exportPDF'

const LeadCaptureModal = lazy(() => import('../components/LeadCaptureModal'))
const ProjectionChart = lazy(() => import('../components/ProjectionChart'))

const INITIAL_FORM_STATE = {
  purchasePrice: '',
  downPayment: '',
  closingCosts: '',
  rehabBudget: '',
  mortgageInterestRate: '',
  loanTermYears: '',
  monthlyRentalIncome: '',
  vacancyRate: '',
  propertyTaxAnnual: '',
  insuranceAnnual: '',
  maintenanceAnnual: '',
  propertyManagementFee: '',
}

const propertyDetailFields = [
  { label: 'Purchase Price', name: 'purchasePrice', prefix: '$', placeholder: 'Enter purchase price' },
  { label: 'Down Payment', name: 'downPayment', prefix: '$', placeholder: 'Enter down payment' },
  { label: 'Closing Costs', name: 'closingCosts', prefix: '$', placeholder: 'Enter closing costs' },
  { label: 'Renovation / Rehab Budget', name: 'rehabBudget', prefix: '$', placeholder: 'Enter rehab budget' },
  {
    label: 'Mortgage Interest Rate',
    name: 'mortgageInterestRate',
    suffix: '%',
    placeholder: 'Enter interest rate',
  },
  { label: 'Loan Term', name: 'loanTermYears', suffix: 'yrs', placeholder: 'Enter loan term' },
]

const incomeExpenseFields = [
  {
    label: 'Monthly Rental Income',
    name: 'monthlyRentalIncome',
    prefix: '$',
    placeholder: 'Enter monthly rent',
  },
  { label: 'Vacancy Rate', name: 'vacancyRate', suffix: '%', placeholder: '8' },
  { label: 'Property Tax, Annual', name: 'propertyTaxAnnual', prefix: '$', placeholder: 'Enter property tax' },
  { label: 'Insurance, Annual', name: 'insuranceAnnual', prefix: '$', placeholder: 'Enter insurance' },
  {
    label: 'Maintenance & Repairs, Annual',
    name: 'maintenanceAnnual',
    prefix: '$',
    placeholder: 'Enter maintenance',
  },
  {
    label: 'Property Management Fee',
    name: 'propertyManagementFee',
    suffix: '%',
    placeholder: 'Enter management fee',
  },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function formatPercentage(value) {
  return `${(Number(value) || 0).toFixed(1)}%`
}

function Calculator() {
  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE)
  const [propertyName, setPropertyName] = useState('')
  const [propertyAddress, setPropertyAddress] = useState('')
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const { metrics, breakdown, projection, verdict, hasResults } = useROICalc(formValues)
  const { saveProperty, loadedProperty, clearLoadedProperty } = useSavedProperties()
  const { config } = useWhiteLabel()
  const pdfReportRef = useRef(null)

  useEffect(() => {
    document.title = 'Zoqueda ROI Calculator'
  }, [])

  useEffect(() => {
    if (!loadedProperty) {
      return
    }

    const restoredInputs = Object.entries(loadedProperty.inputs).reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key]: String(value ?? ''),
      }),
      {},
    )

    setFormValues({
      ...INITIAL_FORM_STATE,
      ...restoredInputs,
    })
    setPropertyName(loadedProperty.name || '')
    setPropertyAddress(loadedProperty.propertyAddress || '')
    setSaveMessage(`Loaded ${loadedProperty.name}.`)
    clearLoadedProperty()
  }, [clearLoadedProperty, loadedProperty])

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  async function handleExportPDF() {
    if (!pdfReportRef.current || !hasResults || isExportingPDF) {
      return
    }

    try {
      setIsExportingPDF(true)
      await exportPDFReport({
        element: pdfReportRef.current,
        fileName: 'realnov8-property-investment-analysis.pdf',
      })
    } finally {
      setIsExportingPDF(false)
    }
  }

  function handleSaveProperty() {
    if (!hasResults || !propertyName.trim()) {
      setSaveMessage('Enter a property name before saving.')
      return
    }

    saveProperty({
      name: propertyName.trim(),
      propertyAddress,
      inputs: formValues,
      metrics,
      breakdown,
      projection,
      verdict,
    })
    setSaveMessage(`Saved ${propertyName.trim()} to your portfolio.`)
  }

  const metricCards = hasResults
    ? [
        {
          label: 'Annual ROI',
          value: formatPercentage(metrics.cashOnCashROI),
          caption: 'Cash-on-cash return based on total capital invested',
          tone: 'dark',
          emphasize: true,
        },
        {
          label: 'Monthly Cash Flow',
          value: formatCurrency(metrics.monthlyCashFlow),
          caption: 'Net income after operating expenses and mortgage',
          tone: metrics.monthlyCashFlow >= 0 ? 'gold-positive' : 'gold-negative',
        },
        {
          label: 'Cap Rate',
          value: formatPercentage(metrics.capRate),
          caption: 'NOI as a percentage of purchase price',
          tone: 'default',
        },
        {
          label: 'Gross Yield',
          value: formatPercentage(metrics.grossRentalYield),
          caption: 'Gross annual rent divided by purchase price',
          tone: 'default',
        },
        {
          label: 'Break-even Occupancy',
          value: formatPercentage(metrics.breakEvenOccupancy),
          caption: 'Occupancy required to cover total monthly expenses',
          tone: 'default',
        },
        {
          label: 'Total Cash Invested',
          value: formatCurrency(metrics.totalCashInvested),
          caption: 'Down payment, closing costs, and rehab budget combined',
          tone: 'default',
        },
      ]
    : []

  const projectionRows = useMemo(
    () =>
      projection.map((item) => ({
        ...item,
        projectedValueFormatted: formatCurrency(item.projectedValue),
        appreciationGainFormatted: formatCurrency(item.appreciationGain),
        cumulativeCashFlowFormatted: formatCurrency(item.cumulativeCashFlow),
      })),
    [projection],
  )

  const generatedDate = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  )

  return (
    <section className="space-y-6">
      <div className="editorial-panel">
        <p className="section-label text-white">Calculator</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold text-white sm:text-5xl">
          Analyze property returns with a precise, client-ready Zoqueda ROI workflow.
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-[rgba(255,255,255,0.72)] sm:text-base">
          Enter the property details and income assumptions to reveal investment
          performance, break-even occupancy, and a five-year projection.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
          <p className="section-label">Property Details</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {propertyDetailFields.map((field) => (
              <InputField
                key={field.name}
                inputMode="decimal"
                label={field.label}
                name={field.name}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                prefix={field.prefix}
                suffix={field.suffix}
                value={formValues[field.name]}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
          <p className="section-label">Income & Expenses</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {incomeExpenseFields.map((field) => (
              <InputField
                key={field.name}
                inputMode="decimal"
                label={field.label}
                name={field.name}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                prefix={field.prefix}
                suffix={field.suffix}
                value={formValues[field.name]}
              />
            ))}
          </div>
        </div>
      </div>

      {hasResults ? (
        <div className="space-y-6">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="section-label">Report Context</p>
                <h2 className="mt-3 text-3xl font-bold text-[var(--color-ink)]">
                  Name the property and add an optional address.
                </h2>
                <p className="mt-3 text-sm text-[var(--color-secondary)]">
                  The property name is used when saving, and the address appears beneath the report title in the PDF.
                </p>
              </div>
              <div className="grid w-full max-w-xl gap-4">
                <InputField
                  label="Property Name"
                  name="propertyName"
                  onChange={(event) => setPropertyName(event.target.value)}
                  placeholder="Enter a name to save this analysis"
                  value={propertyName}
                />
                <InputField
                  label="Property Address"
                  name="propertyAddress"
                  onChange={(event) => setPropertyAddress(event.target.value)}
                  placeholder="Enter property address for the PDF report"
                  value={propertyAddress}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {metricCards.map((metric) => (
              <MetricCard
                key={metric.label}
                caption={metric.caption}
                emphasize={metric.emphasize}
                label={metric.label}
                tone={metric.tone}
                value={metric.value}
              />
            ))}
          </div>

          <InvestmentVerdict
            explanation={verdict.explanation}
            title={verdict.title}
            tone={verdict.tone}
          />

          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <BreakdownTable formatCurrency={formatCurrency} rows={breakdown} />
            <Suspense
              fallback={
                <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
                  <p className="section-label">5-Year Projection</p>
                  <p className="mt-3 text-sm text-[var(--color-secondary)]">
                    Loading chart...
                  </p>
                </section>
              }
            >
              <ProjectionChart data={projection} />
            </Suspense>
          </div>

          <div className="flex flex-col gap-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="section-label">Actions</p>
              <p className="mt-2 text-sm text-[var(--color-secondary)]">
                PDF export, saved properties, and lead capture are all live.
              </p>
              {saveMessage ? (
                <p className="mt-2 text-sm text-[var(--color-secondary)]">{saveMessage}</p>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                className="button-primary hidden sm:inline-flex"
                disabled={isExportingPDF}
                type="button"
                onClick={handleExportPDF}
              >
                {isExportingPDF ? 'Preparing PDF...' : 'Download PDF report'}
              </button>
              <button className="button-secondary" type="button" onClick={handleSaveProperty}>
                Save this property
              </button>
              <button className="button-secondary" type="button" onClick={() => setIsLeadModalOpen(true)}>
                Send results to my email
              </button>
            </div>
            <p className="text-sm text-[var(--color-muted)] sm:hidden">
              Open on desktop to download PDF.
            </p>
          </div>
        </div>
      ) : (
        <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
          <p className="section-label">Results</p>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-ink)]">
            Results will appear once purchase price and monthly rent are entered.
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-[var(--color-secondary)]">
            All inputs begin empty by design. Add those two values to unlock the
            full ROI dashboard, monthly breakdown, and five-year projection.
          </p>
        </section>
      )}

      {hasResults ? (
        <div aria-hidden="true" className="pdf-report-shell">
          <div className="pdf-report" id="pdf-report" ref={pdfReportRef}>
            <header className="pdf-report-masthead">
              <div>
                <p className="pdf-report-brand">{config.companyName || 'Zoqueda ROI'}</p>
                <p className="pdf-report-tagline">Professional property investment analysis</p>
              </div>
            </header>

            <section className="pdf-report-section">
              <p className="section-label">Property Investment Analysis</p>
              <h2 className="mt-3 text-[32px] font-bold text-[var(--color-ink)]">
                Property Investment Analysis
              </h2>
              <p className="mt-3 text-[14px] text-[var(--color-secondary)]">
                Generated on {generatedDate}
              </p>
              {propertyAddress ? (
                <p className="mt-2 text-[14px] text-[var(--color-secondary)]">
                  Property address: {propertyAddress}
                </p>
              ) : null}
            </section>

            <section className="pdf-report-section">
              <div className="pdf-report-metric-grid">
                {metricCards.map((metric) => (
                  <MetricCard
                    key={`pdf-${metric.label}`}
                    caption={metric.caption}
                    emphasize={metric.emphasize}
                    label={metric.label}
                    tone={metric.tone}
                    value={metric.value}
                  />
                ))}
              </div>
            </section>

            <section className="pdf-report-section">
              <InvestmentVerdict
                explanation={verdict.explanation}
                title={verdict.title}
                tone={verdict.tone}
              />
            </section>

            <section className="pdf-report-section">
              <BreakdownTable formatCurrency={formatCurrency} rows={breakdown} />
            </section>

            <section className="pdf-report-section">
              <p className="section-label">Projection Table</p>
              <h3 className="mt-3 text-[28px] font-bold text-[var(--color-ink)]">
                Five-year projection summary
              </h3>
              <div className="mt-6 overflow-hidden rounded-[8px] border border-[var(--color-border)]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-soft)]">
                      <th className="breakdown-head text-left">Year</th>
                      <th className="breakdown-head text-right">Projected value</th>
                      <th className="breakdown-head text-right">Appreciation</th>
                      <th className="breakdown-head text-right">Cash flow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectionRows.map((row) => (
                      <tr key={`pdf-row-${row.year}`}>
                        <td className="breakdown-cell">{row.label}</td>
                        <td className="breakdown-cell text-right">{row.projectedValueFormatted}</td>
                        <td className="breakdown-cell text-right">{row.appreciationGainFormatted}</td>
                        <td className="breakdown-cell text-right">{row.cumulativeCashFlowFormatted}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <footer className="pdf-report-footer">
              <p className="text-[14px] text-[var(--color-secondary)]">
                {config.agentName ? `Agent: ${config.agentName}` : config.footerText}
              </p>
              <p className="mt-2 text-[14px] text-[var(--color-secondary)]">
                {config.agentEmail || config.agentPhone
                  ? [config.agentEmail, config.agentPhone].filter(Boolean).join(' | ')
                  : 'Powered by Zoqueda UI'}
              </p>
            </footer>
          </div>
        </div>
      ) : null}

      <Suspense fallback={null}>
        <LeadCaptureModal
          agentConfig={{
            agentEmail: config.agentEmail,
            agentName: config.agentName,
            companyName: config.companyName,
          }}
          isOpen={isLeadModalOpen}
          propertyData={{
            annualROI: formatPercentage(metrics.cashOnCashROI),
            capRate: formatPercentage(metrics.capRate),
            grossYield: formatPercentage(metrics.grossRentalYield),
            monthlyCashFlow: formatCurrency(metrics.monthlyCashFlow),
            monthlyRent: formatCurrency(formValues.monthlyRentalIncome),
            purchasePrice: formatCurrency(formValues.purchasePrice),
          }}
          onClose={() => setIsLeadModalOpen(false)}
        />
      </Suspense>
    </section>
  )
}

Calculator.propTypes = {}

export default Calculator
