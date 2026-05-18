import { useMemo } from 'react'
import { calculateInvestmentMetrics, normalizeROIInputs } from '../utils/calculations'

function useROICalc(inputs) {
  const normalizedInputs = useMemo(() => normalizeROIInputs(inputs), [inputs])

  return useMemo(
    () => calculateInvestmentMetrics(normalizedInputs),
    [normalizedInputs],
  )
}

export default useROICalc
