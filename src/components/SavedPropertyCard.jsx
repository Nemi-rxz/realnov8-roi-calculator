import PropTypes from 'prop-types'

function SavedPropertyCard({
  property,
  isSelected,
  canSelectMore,
  onToggleCompare,
  onLoad,
  onDelete,
  formatCurrency,
  formatPercentage,
}) {
  return (
    <article className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="section-label">Saved Property</p>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-ink)]">{property.name}</h2>
          <p className="mt-3 text-sm text-[var(--color-secondary)]">
            Saved on{' '}
            {new Date(property.timestamp).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm text-[var(--color-secondary)]">
          <input
            checked={isSelected}
            disabled={!isSelected && !canSelectMore}
            type="checkbox"
            onChange={() => onToggleCompare(property.id)}
          />
          Compare
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="section-label">Purchase Price</p>
          <p className="mt-2 text-lg text-[var(--color-ink)]">{formatCurrency(property.inputs.purchasePrice)}</p>
        </div>
        <div>
          <p className="section-label">ROI</p>
          <p className="mt-2 text-lg text-[var(--color-ink)]">{formatPercentage(property.metrics.cashOnCashROI)}</p>
        </div>
        <div>
          <p className="section-label">Cash Flow / Mo</p>
          <p
            className={`mt-2 text-lg ${
              property.metrics.monthlyCashFlow >= 0 ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
            }`}
          >
            {formatCurrency(property.metrics.monthlyCashFlow)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button className="button-primary" type="button" onClick={() => onLoad(property.id)}>
          Load
        </button>
        <button className="button-secondary" type="button" onClick={() => onDelete(property.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}

SavedPropertyCard.propTypes = {
  canSelectMore: PropTypes.bool.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  formatPercentage: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired,
  onLoad: PropTypes.func.isRequired,
  onToggleCompare: PropTypes.func.isRequired,
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    inputs: PropTypes.shape({
      purchasePrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }).isRequired,
    metrics: PropTypes.shape({
      breakEvenOccupancy: PropTypes.number,
      capRate: PropTypes.number,
      cashOnCashROI: PropTypes.number.isRequired,
      grossRentalYield: PropTypes.number,
      monthlyCashFlow: PropTypes.number.isRequired,
      totalCashInvested: PropTypes.number,
    }).isRequired,
    name: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
}

export default SavedPropertyCard
