import PropTypes from 'prop-types'
import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import { themeTokens } from '../theme/tokens'

const WHITE_LABEL_STORAGE_KEY = 'realnov8_whitelabel'

const defaultWhiteLabelConfig = {
  companyName: themeTokens.brand.name,
  logoDataUrl: '',
  accentColor: themeTokens.colors.accent,
  agentName: '',
  agentEmail: '',
  agentPhone: '',
  footerText: themeTokens.brand.defaultFooter,
}

const WhiteLabelContext = createContext(null)

function sanitizeConfig(candidateConfig = {}) {
  return {
    companyName: candidateConfig.companyName || defaultWhiteLabelConfig.companyName,
    logoDataUrl: candidateConfig.logoDataUrl || '',
    accentColor: candidateConfig.accentColor || defaultWhiteLabelConfig.accentColor,
    agentName: candidateConfig.agentName || '',
    agentEmail: candidateConfig.agentEmail || '',
    agentPhone: candidateConfig.agentPhone || '',
    footerText: candidateConfig.footerText || defaultWhiteLabelConfig.footerText,
  }
}

function readStoredWhiteLabelConfig() {
  try {
    const storedValue = window.localStorage.getItem(WHITE_LABEL_STORAGE_KEY)

    if (!storedValue) {
      return defaultWhiteLabelConfig
    }

    return sanitizeConfig(JSON.parse(storedValue))
  } catch {
    return defaultWhiteLabelConfig
  }
}

export function WhiteLabelProvider({ children }) {
  const [config, setConfig] = useState(() => readStoredWhiteLabelConfig())

  useEffect(() => {
    try {
      window.localStorage.setItem(WHITE_LABEL_STORAGE_KEY, JSON.stringify(config))
    } catch {
      return
    }
  }, [config])

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', config.accentColor)
  }, [config.accentColor])

  const value = useMemo(
    () => ({
      config,
      updateConfig: (partialConfig) => {
        setConfig((currentConfig) => sanitizeConfig({ ...currentConfig, ...partialConfig }))
      },
      resetConfig: () => {
        setConfig(defaultWhiteLabelConfig)

        try {
          window.localStorage.removeItem(WHITE_LABEL_STORAGE_KEY)
        } catch {
          return
        }
      },
      storageKey: WHITE_LABEL_STORAGE_KEY,
      defaultConfig: defaultWhiteLabelConfig,
    }),
    [config],
  )

  return createElement(WhiteLabelContext.Provider, { value }, children)
}

WhiteLabelProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

function useWhiteLabel() {
  const context = useContext(WhiteLabelContext)

  if (!context) {
    throw new Error('useWhiteLabel must be used within a WhiteLabelProvider.')
  }

  return context
}

export default useWhiteLabel
