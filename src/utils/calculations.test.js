import {
  calculateEffectiveMonthlyRent,
  calculateInvestmentMetrics,
  calculateMonthlyManagementCost,
  calculateMonthlyMortgagePayment,
  calculateProjectionSeries,
  getInvestmentVerdict,
} from './calculations'

const sampleInputs = {
  purchasePrice: 250000,
  downPayment: 50000,
  closingCosts: 8000,
  rehabBudget: 12000,
  mortgageInterestRate: 7.5,
  loanTermYears: 30,
  monthlyRentalIncome: 2400,
  vacancyRate: 8,
  propertyTaxAnnual: 3600,
  insuranceAnnual: 1800,
  maintenanceAnnual: 2400,
  propertyManagementFee: 10,
}

describe('ROI calculations', () => {
  it('calculates monthly mortgage with amortization', () => {
    const payment = calculateMonthlyMortgagePayment(200000, 7.5, 30)

    expect(payment).toBeCloseTo(1398.43, 2)
  })

  it('calculates effective rent and management cost', () => {
    const effectiveRent = calculateEffectiveMonthlyRent(2400, 8)
    const managementCost = calculateMonthlyManagementCost(effectiveRent, 10)

    expect(effectiveRent).toBeCloseTo(2208, 5)
    expect(managementCost).toBeCloseTo(220.8, 5)
  })

  it('calculates the full investment metrics object', () => {
    const result = calculateInvestmentMetrics(sampleInputs)

    expect(result.hasResults).toBe(true)
    expect(result.metrics.loanAmount).toBe(200000)
    expect(result.metrics.monthlyMortgage).toBeCloseTo(1398.43, 2)
    expect(result.metrics.monthlyOperatingExpenses).toBeCloseTo(870.8, 2)
    expect(result.metrics.noiAnnual).toBeCloseTo(16046.4, 2)
    expect(result.metrics.monthlyCashFlow).toBeCloseTo(-61.23, 2)
    expect(result.metrics.annualCashFlow).toBeCloseTo(-734.75, 2)
    expect(result.metrics.totalCashInvested).toBe(70000)
    expect(result.metrics.cashOnCashROI).toBeCloseTo(-1.05, 2)
    expect(result.metrics.capRate).toBeCloseTo(6.42, 2)
    expect(result.metrics.grossRentalYield).toBeCloseTo(11.52, 2)
    expect(result.metrics.breakEvenOccupancy).toBeCloseTo(94.55, 2)
    expect(result.breakdown).toHaveLength(7)
    expect(result.projection).toHaveLength(5)
    expect(result.verdict.tone).toBe('red')
  })

  it('builds a five-year projection using cash flow and appreciation', () => {
    const projection = calculateProjectionSeries(500, 250000, 5)

    expect(projection[0]).toMatchObject({
      year: 1,
      label: 'Year 1',
      cumulativeCashFlow: 6000,
    })
    expect(projection[0].appreciationGain).toBeCloseTo(10000, 5)
    expect(projection[4].projectedValue).toBeCloseTo(84163.23, 2)
  })

  it('returns the correct verdict threshold states', () => {
    expect(getInvestmentVerdict(9, 250).tone).toBe('green')
    expect(getInvestmentVerdict(4.5, 50).tone).toBe('amber')
    expect(getInvestmentVerdict(3.9, 50).tone).toBe('red')
    expect(getInvestmentVerdict(10, -1).tone).toBe('red')
  })

  it('hides results until purchase price and rent are present', () => {
    const result = calculateInvestmentMetrics({ purchasePrice: 300000, monthlyRentalIncome: 0 })

    expect(result.hasResults).toBe(false)
  })
})
