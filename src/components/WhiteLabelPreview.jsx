import PropTypes from 'prop-types'

function WhiteLabelPreview({ config }) {
  return (
    <section className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6">
      <p className="section-label">Live Preview</p>
      <div className="mt-6 border border-[var(--color-ink)] bg-[var(--color-ink)] p-5">
        <div className="flex items-center gap-3">
          {config.logoDataUrl ? (
            <img
              alt={`${config.companyName} logo preview`}
              className="h-11 w-11 rounded-[8px] border border-[var(--color-border)] object-cover"
              src={config.logoDataUrl}
            />
          ) : (
            <div
              className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[rgba(255,255,255,0.16)]"
              style={{ color: config.accentColor }}
            >
              R
            </div>
          )}
          <div>
            <p
              className="font-[var(--font-editorial)] text-[28px] font-bold"
              style={{ color: config.accentColor }}
            >
              {config.companyName}
            </p>
            <p className="text-xs text-[rgba(255,255,255,0.5)]">
              Property investment analysis for modern agencies
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-5">
        <p className="section-label">Sample Metric</p>
        <p
          className="mt-4 font-[var(--font-editorial)] text-[48px] leading-none font-normal"
          style={{ color: config.accentColor }}
        >
          12.4%
        </p>
        <p className="mt-4 text-sm text-[var(--color-secondary)]">
          Annual ROI card accent updates in real time as the primary brand colour changes.
        </p>
      </div>

      <div className="mt-6 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-gold-light)] p-5">
        <p className="section-label">Footer Preview</p>
        <p className="mt-3 text-sm text-[var(--color-secondary)]">{config.footerText}</p>
        <p className="mt-2 text-sm text-[var(--color-secondary)]">
          {config.agentName || 'Agent name'} {config.agentEmail ? `• ${config.agentEmail}` : ''}
        </p>
      </div>
    </section>
  )
}

WhiteLabelPreview.propTypes = {
  config: PropTypes.shape({
    accentColor: PropTypes.string.isRequired,
    agentEmail: PropTypes.string.isRequired,
    agentName: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
    footerText: PropTypes.string.isRequired,
    logoDataUrl: PropTypes.string.isRequired,
  }).isRequired,
}

export default WhiteLabelPreview
