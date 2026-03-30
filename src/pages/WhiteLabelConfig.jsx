import { useEffect, useState } from 'react'
import InputField from '../components/InputField'
import WhiteLabelPreview from '../components/WhiteLabelPreview'
import useWhiteLabel from '../hooks/useWhiteLabel'

function WhiteLabelConfigPage() {
  const { config, updateConfig, resetConfig } = useWhiteLabel()
  const [isReadingLogo, setIsReadingLogo] = useState(false)

  useEffect(() => {
    document.title = 'White-label Config | RealNov8'
  }, [])

  function handleFieldChange(event) {
    const { name, value } = event.target
    updateConfig({ [name]: value })
  }

  function handleColorChange(event) {
    updateConfig({ accentColor: event.target.value })
  }

  function handleLogoUpload(event) {
    const [file] = event.target.files || []

    if (!file) {
      return
    }

    const reader = new FileReader()
    setIsReadingLogo(true)

    reader.onload = () => {
      updateConfig({ logoDataUrl: String(reader.result || '') })
      setIsReadingLogo(false)
    }

    reader.onerror = () => {
      setIsReadingLogo(false)
    }

    reader.readAsDataURL(file)
  }

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
        <p className="section-label">White-label</p>
        <h1 className="mt-3 text-4xl font-bold">Brand Configuration</h1>
        <p className="mt-4 text-[var(--color-secondary)]">
          Agency branding updates the live interface instantly and persists to local storage for reuse.
        </p>

        <div className="mt-8 grid gap-4">
          <InputField
            label="Company Name"
            name="companyName"
            onChange={handleFieldChange}
            placeholder="Enter company name"
            value={config.companyName}
          />

          <label className="input-field">
            <span className="section-label">Logo Upload</span>
            <span className="input-shell">
              <input
                accept="image/*"
                className="editorial-input file-input"
                name="logoUpload"
                type="file"
                onChange={handleLogoUpload}
              />
            </span>
            <span className="input-helper">
              {isReadingLogo
                ? 'Reading logo...'
                : config.logoDataUrl
                  ? 'Logo stored in localStorage as base64.'
                  : 'Upload a square logo for the masthead preview.'}
            </span>
          </label>

          <label className="input-field">
            <span className="section-label">Primary Brand Colour</span>
            <div className="color-picker-row">
              <input
                aria-label="Primary brand colour"
                className="brand-color-input"
                type="color"
                value={config.accentColor}
                onChange={handleColorChange}
              />
              <div className="rounded-[8px] border border-[var(--color-border)] bg-[var(--color-card-bg)] px-3 py-2 text-sm text-[var(--color-secondary)]">
                {config.accentColor}
              </div>
            </div>
          </label>

          <InputField
            label="Agent Full Name"
            name="agentName"
            onChange={handleFieldChange}
            placeholder="Enter agent full name"
            value={config.agentName}
          />

          <InputField
            label="Agent Email Address"
            name="agentEmail"
            onChange={handleFieldChange}
            placeholder="Enter agent email"
            type="email"
            value={config.agentEmail}
          />

          <InputField
            label="Agent Phone Number"
            name="agentPhone"
            onChange={handleFieldChange}
            placeholder="Enter agent phone number"
            type="tel"
            value={config.agentPhone}
          />

          <InputField
            label="Custom Footer Text"
            name="footerText"
            onChange={handleFieldChange}
            placeholder="Enter custom footer text"
            value={config.footerText}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button className="button-primary" type="button" onClick={resetConfig}>
              Reset to RealNov8 defaults
            </button>
          </div>
        </div>
      </div>

      <WhiteLabelPreview config={config} />
    </section>
  )
}

WhiteLabelConfigPage.propTypes = {}

export default WhiteLabelConfigPage
