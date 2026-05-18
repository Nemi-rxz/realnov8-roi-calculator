import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SavedPropertyCard from '../components/SavedPropertyCard'
import useSavedProperties from '../hooks/useSavedProperties'

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

function SavedPropertiesPage() {
  const navigate = useNavigate()
  const { savedProperties, deleteProperty, loadProperty } = useSavedProperties()
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    document.title = 'Saved Properties | Zoqueda ROI'
  }, [])

  const selectedProperties = useMemo(
    () => savedProperties.filter((property) => selectedIds.includes(property.id)).slice(0, 3),
    [savedProperties, selectedIds],
  )

  function handleToggleCompare(propertyId) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(propertyId)) {
        return currentIds.filter((id) => id !== propertyId)
      }

      if (currentIds.length >= 3) {
        return currentIds
      }

      return [...currentIds, propertyId]
    })
  }

  function handleLoad(propertyId) {
    loadProperty(propertyId)
    navigate('/')
  }

  function handleDelete(propertyId) {
    deleteProperty(propertyId)
    setSelectedIds((currentIds) => currentIds.filter((id) => id !== propertyId))
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
        <p className="section-label">Saved Portfolio</p>
        <h1 className="mt-3 text-4xl font-bold">Saved Properties</h1>
        <p className="mt-4 max-w-3xl text-[var(--color-secondary)]">
          Save calculations from the main tool, reload them instantly, and compare up to three opportunities side by side.
        </p>
      </div>

      {savedProperties.length === 0 ? (
        <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-8 text-center sm:p-12">
          <p className="font-[var(--font-editorial)] text-3xl font-bold text-[var(--color-ink)]">
            No properties saved yet.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[var(--color-secondary)]">
            Run a calculation and save it to build your portfolio analysis.
          </p>
        </section>
      ) : null}

      {selectedProperties.length >= 2 ? (
        <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
          <p className="section-label">Compare Mode</p>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-ink)]">Saved property comparison</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="bg-[var(--color-surface-soft)]">
                  <th className="breakdown-head text-left">Metric</th>
                  {selectedProperties.map((property) => (
                    <th key={`head-${property.id}`} className="breakdown-head text-right">
                      {property.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Annual ROI', (property) => formatPercentage(property.metrics.cashOnCashROI)],
                  ['Monthly Cash Flow', (property) => formatCurrency(property.metrics.monthlyCashFlow)],
                  ['Cap Rate', (property) => formatPercentage(property.metrics.capRate)],
                  ['Gross Yield', (property) => formatPercentage(property.metrics.grossRentalYield)],
                  ['Break-even Occupancy', (property) => formatPercentage(property.metrics.breakEvenOccupancy)],
                  ['Total Cash Invested', (property) => formatCurrency(property.metrics.totalCashInvested)],
                ].map(([label, formatter]) => (
                  <tr key={label}>
                    <td className="breakdown-cell">{label}</td>
                    {selectedProperties.map((property) => (
                      <td key={`${property.id}-${label}`} className="breakdown-cell text-right">
                        {formatter(property)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6">
        {savedProperties.map((property) => (
          <SavedPropertyCard
            key={property.id}
            canSelectMore={selectedIds.length < 3}
            formatCurrency={formatCurrency}
            formatPercentage={formatPercentage}
            isSelected={selectedIds.includes(property.id)}
            property={property}
            onDelete={handleDelete}
            onLoad={handleLoad}
            onToggleCompare={handleToggleCompare}
          />
        ))}
      </div>
    </section>
  )
}

SavedPropertiesPage.propTypes = {}

export default SavedPropertiesPage
