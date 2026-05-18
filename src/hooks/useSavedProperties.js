import PropTypes from 'prop-types'
import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'

const SAVED_PROPERTIES_STORAGE_KEY = 'realnov8_saved_properties'

const SavedPropertiesContext = createContext(null)

function readSavedProperties() {
  try {
    const storedValue = window.localStorage.getItem(SAVED_PROPERTIES_STORAGE_KEY)

    if (!storedValue) {
      return []
    }

    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export function SavedPropertiesProvider({ children }) {
  const [savedProperties, setSavedProperties] = useState(() => readSavedProperties())
  const [loadedProperty, setLoadedProperty] = useState(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_PROPERTIES_STORAGE_KEY, JSON.stringify(savedProperties))
    } catch {
      return
    }
  }, [savedProperties])

  const value = useMemo(
    () => ({
      savedProperties,
      loadedProperty,
      saveProperty: (propertyPayload) => {
        const savedEntry = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          timestamp: new Date().toISOString(),
          ...propertyPayload,
        }

        setSavedProperties((currentProperties) => [savedEntry, ...currentProperties])
        return savedEntry
      },
      deleteProperty: (propertyId) => {
        setSavedProperties((currentProperties) =>
          currentProperties.filter((property) => property.id !== propertyId),
        )
      },
      loadProperty: (propertyId) => {
        const selectedProperty = savedProperties.find((property) => property.id === propertyId) || null
        setLoadedProperty(selectedProperty)
        return selectedProperty
      },
      clearLoadedProperty: () => {
        setLoadedProperty(null)
      },
    }),
    [loadedProperty, savedProperties],
  )

  return createElement(SavedPropertiesContext.Provider, { value }, children)
}

SavedPropertiesProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

function useSavedProperties() {
  const context = useContext(SavedPropertiesContext)

  if (!context) {
    throw new Error('useSavedProperties must be used within a SavedPropertiesProvider.')
  }

  return context
}

export default useSavedProperties
