import PropTypes from 'prop-types'

function BreakdownTable({ rows, formatCurrency }) {
  return (
    <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
      <p className="section-label">Monthly Breakdown</p>
      <h3 className="mt-3 text-3xl font-bold text-[var(--color-ink)]">Income and expense detail</h3>
      <div className="mt-6 overflow-hidden rounded-[8px] border border-[var(--color-border)]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[var(--color-surface-soft)]">
              <th className="breakdown-head text-left">Line item</th>
              <th className="breakdown-head text-right">Monthly amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <td className="breakdown-cell">{row.label}</td>
                <td
                  className={`breakdown-cell text-right ${
                    row.key === 'net-cash-flow'
                      ? row.value >= 0
                        ? 'text-[var(--color-positive)]'
                        : 'text-[var(--color-negative)]'
                      : 'text-[var(--color-ink)]'
                  }`}
                >
                  {formatCurrency(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

BreakdownTable.propTypes = {
  formatCurrency: PropTypes.func.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export default BreakdownTable
