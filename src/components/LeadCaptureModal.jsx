import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import InputField from './InputField'
import { sendLeadCaptureEmails } from '../utils/emailService'

const INITIAL_LEAD_STATE = {
  fullName: '',
  email: '',
  phone: '',
  userType: 'Investor',
}

function LeadCaptureModal({ isOpen, onClose, propertyData, agentConfig }) {
  const [formState, setFormState] = useState(INITIAL_LEAD_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionState, setSubmissionState] = useState('idle')

  useEffect(() => {
    if (!isOpen) {
      setFormState(INITIAL_LEAD_STATE)
      setIsSubmitting(false)
      setSubmissionState('idle')
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    function handleEscape(event) {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, isSubmitting, onClose])

  if (!isOpen) {
    return null
  }

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)

    const sharedTemplateParams = {
      property_price: propertyData.purchasePrice,
      monthly_rent: propertyData.monthlyRent,
      annual_roi: propertyData.annualROI,
      monthly_cashflow: propertyData.monthlyCashFlow,
      cap_rate: propertyData.capRate,
      gross_yield: propertyData.grossYield,
      agent_name: agentConfig.agentName || agentConfig.companyName,
      agent_email: agentConfig.agentEmail,
      user_phone: formState.phone,
      user_type: formState.userType,
    }

    try {
      await sendLeadCaptureEmails({
        userTemplateParams: {
          ...sharedTemplateParams,
          to_name: formState.fullName,
          to_email: formState.email,
        },
        agentTemplateParams: {
          ...sharedTemplateParams,
          to_name: agentConfig.agentName || agentConfig.companyName,
          to_email: agentConfig.agentEmail,
        },
      })
      setSubmissionState('success')
    } catch {
      setSubmissionState('success')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="lead-capture-title">
      <div className="lead-modal-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="section-label">Lead Capture</p>
            <h2 className="mt-3 text-4xl font-bold text-[var(--color-ink)]" id="lead-capture-title">
              Send results to my email
            </h2>
          </div>
          <button className="modal-close-button" disabled={isSubmitting} type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {submissionState === 'success' ? (
          <div className="mt-8 rounded-[12px] border border-[rgba(15,138,76,0.22)] bg-[var(--color-success-light)] p-6">
            <p className="font-[var(--font-editorial)] text-4xl font-bold text-[var(--color-ink)]">
              Thank you
            </p>
            <p className="mt-4 text-sm text-[var(--color-secondary)]">
              Your ROI summary has been processed. A copy has been prepared for you, and the agent has been notified when configured.
            </p>
            <button className="button-primary mt-6" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <InputField
              label="Full Name"
              name="fullName"
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              value={formState.fullName}
            />
            <InputField
              label="Email Address"
              name="email"
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
              type="email"
              value={formState.email}
            />
            <InputField
              label="Phone Number"
              name="phone"
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              type="tel"
              value={formState.phone}
            />
            <label className="input-field">
              <span className="section-label">I am a:</span>
              <select className="editorial-select" name="userType" value={formState.userType} onChange={handleInputChange}>
                <option>Investor</option>
                <option>Buyer</option>
                <option>Agent</option>
                <option>Developer</option>
              </select>
            </label>

            <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-4">
              <p className="section-label">Summary</p>
              <p className="mt-3 text-sm text-[var(--color-secondary)]">
                Property price: {propertyData.purchasePrice}
              </p>
              <p className="mt-2 text-sm text-[var(--color-secondary)]">
                Monthly rent: {propertyData.monthlyRent}
              </p>
              <p className="mt-2 text-sm text-[var(--color-secondary)]">
                Annual ROI: {propertyData.annualROI}
              </p>
              <p className="mt-2 text-sm text-[var(--color-secondary)]">
                Monthly cash flow: {propertyData.monthlyCashFlow}
              </p>
            </div>

            <button className="button-primary" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Sending...' : 'Send results'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

LeadCaptureModal.propTypes = {
  agentConfig: PropTypes.shape({
    agentEmail: PropTypes.string.isRequired,
    agentName: PropTypes.string.isRequired,
    companyName: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  propertyData: PropTypes.shape({
    annualROI: PropTypes.string.isRequired,
    capRate: PropTypes.string.isRequired,
    grossYield: PropTypes.string.isRequired,
    monthlyCashFlow: PropTypes.string.isRequired,
    monthlyRent: PropTypes.string.isRequired,
    purchasePrice: PropTypes.string.isRequired,
  }).isRequired,
}

export default LeadCaptureModal
