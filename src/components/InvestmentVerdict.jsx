import PropTypes from 'prop-types'

function InvestmentVerdict({ tone, title, explanation }) {
  const toneClass =
    tone === 'green'
      ? 'verdict-positive'
      : tone === 'amber'
        ? 'verdict-amber'
        : 'verdict-negative'

  return (
    <section className={`investment-verdict ${toneClass}`}>
      <p className="section-label">Investment Verdict</p>
      <h3 className="investment-verdict-title">{title}</h3>
      <p className="investment-verdict-text">{explanation}</p>
    </section>
  )
}

InvestmentVerdict.propTypes = {
  explanation: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tone: PropTypes.oneOf(['green', 'amber', 'red']).isRequired,
}

export default InvestmentVerdict
