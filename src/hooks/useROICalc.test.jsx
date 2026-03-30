import { renderHook } from '@testing-library/react'
import useROICalc from './useROICalc'

describe('useROICalc', () => {
  it('returns calculated metrics, breakdown, projection, and verdict', () => {
    const { result } = renderHook(() =>
      useROICalc({
        purchasePrice: '250000',
        downPayment: '50000',
        closingCosts: '8000',
        rehabBudget: '12000',
        mortgageInterestRate: '7.5',
        loanTermYears: '30',
        monthlyRentalIncome: '2400',
        vacancyRate: '8',
        propertyTaxAnnual: '3600',
        insuranceAnnual: '1800',
        maintenanceAnnual: '2400',
        propertyManagementFee: '10',
      }),
    )

    expect(result.current.hasResults).toBe(true)
    expect(result.current.metrics.monthlyCashFlow).toBeCloseTo(-61.23, 2)
    expect(result.current.breakdown[0].label).toBe('Effective rent')
    expect(result.current.projection[4].label).toBe('Year 5')
    expect(result.current.verdict.title).toBe('High-risk investment outlook')
  })
})
