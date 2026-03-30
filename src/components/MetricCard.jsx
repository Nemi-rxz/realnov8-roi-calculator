import PropTypes from 'prop-types'

function MetricCard({ label, value, caption, tone, emphasize }) {
  const toneClass =
    tone === 'dark'
      ? 'metric-card-dark'
      : tone === 'gold'
        ? 'metric-card-gold'
        : tone === 'gold-positive'
          ? 'metric-card-gold-positive'
          : tone === 'gold-negative'
            ? 'metric-card-gold-negative'
        : tone === 'positive'
          ? 'metric-card-positive'
          : tone === 'negative'
            ? 'metric-card-negative'
            : 'metric-card-default'

  return (
    <article className={`metric-card ${toneClass} ${emphasize ? 'metric-card-emphasize' : ''}`.trim()}>
      <p className="section-label">{label}</p>
      <p className="metric-card-value">{value}</p>
      {caption ? <p className="metric-card-caption">{caption}</p> : null}
    </article>
  )
}

MetricCard.propTypes = {
  caption: PropTypes.string,
  emphasize: PropTypes.bool,
  label: PropTypes.string.isRequired,
  tone: PropTypes.oneOf([
    'default',
    'dark',
    'gold',
    'gold-positive',
    'gold-negative',
    'positive',
    'negative',
  ]),
  value: PropTypes.string.isRequired,
}

MetricCard.defaultProps = {
  caption: '',
  emphasize: false,
  tone: 'default',
}

export default MetricCard
