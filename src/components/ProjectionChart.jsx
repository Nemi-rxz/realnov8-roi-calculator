import PropTypes from 'prop-types'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function formatCompactCurrency(value) {
  const numericValue = Number(value) || 0

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(numericValue)
}

function formatFullCurrency(value) {
  const numericValue = Number(value) || 0

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numericValue)
}

function ProjectionChart({ data }) {
  return (
    <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5 sm:p-6">
      <p className="section-label">5-Year Projection</p>
      <h3 className="mt-3 text-3xl font-bold text-[var(--color-ink)]">Projected equity growth</h3>
      <div className="mt-6 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-border)" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: 'var(--color-secondary)', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: 'var(--color-secondary)', fontSize: 12 }}
              tickFormatter={formatCompactCurrency}
              tickLine={false}
              width={64}
            />
            <Tooltip
              contentStyle={{
                border: '1px solid var(--color-border)',
                borderRadius: 12,
                backgroundColor: 'var(--color-card-bg)',
                color: 'var(--color-ink)',
                fontFamily: 'var(--font-ui)',
              }}
              cursor={{ fill: '#eff6ff' }}
              formatter={(value) => [formatFullCurrency(value), 'Projected value']}
              labelStyle={{ color: 'var(--color-ink)', fontWeight: 600 }}
            />
            <Bar dataKey="projectedValue" radius={0}>
              {data.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={entry.projectedValue >= 0 ? 'var(--color-ink)' : 'var(--color-negative)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

ProjectionChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      projectedValue: PropTypes.number.isRequired,
    }),
  ).isRequired,
}

export default ProjectionChart
