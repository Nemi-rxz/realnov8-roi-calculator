const DEFAULT_INPUTS = {
  purchasePrice: '',
  downPayment: '',
  closingCosts: '',
  rehabBudget: '',
  mortgageInterestRate: '',
  loanTermYears: '',
  monthlyRentalIncome: '',
  vacancyRate: '',
  propertyTaxAnnual: '',
  insuranceAnnual: '',
  maintenanceAnnual: '',
  propertyManagementFee: '',
}

function toNumber(value) {
  if (value === '' || value === null || value === undefined) {
    return 0
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : 0
}

export function normalizeROIInputs(inputs = {}) {
  const mergedInputs = { ...DEFAULT_INPUTS, ...inputs }

  return {
    purchasePrice: toNumber(mergedInputs.purchasePrice),
    downPayment: toNumber(mergedInputs.downPayment),
    closingCosts: toNumber(mergedInputs.closingCosts),
    rehabBudget: toNumber(mergedInputs.rehabBudget),
    mortgageInterestRate: toNumber(mergedInputs.mortgageInterestRate),
    loanTermYears: toNumber(mergedInputs.loanTermYears),
    monthlyRentalIncome: toNumber(mergedInputs.monthlyRentalIncome),
    vacancyRate: toNumber(mergedInputs.vacancyRate),
    propertyTaxAnnual: toNumber(mergedInputs.propertyTaxAnnual),
    insuranceAnnual: toNumber(mergedInputs.insuranceAnnual),
    maintenanceAnnual: toNumber(mergedInputs.maintenanceAnnual),
    propertyManagementFee: toNumber(mergedInputs.propertyManagementFee),
  }
}

export function calculateLoanAmount(purchasePrice, downPayment) {
  return Math.max(toNumber(purchasePrice) - toNumber(downPayment), 0)
}

export function calculateMonthlyMortgagePayment(loanAmount, annualInterestRate, loanTermYears) {
  const principal = toNumber(loanAmount)
  const years = toNumber(loanTermYears)
  const monthlyRate = toNumber(annualInterestRate) / 100 / 12
  const numberOfPayments = years * 12

  if (principal <= 0 || numberOfPayments <= 0) {
    return 0
  }

  if (monthlyRate === 0) {
    return principal / numberOfPayments
  }

  const growthFactor = (1 + monthlyRate) ** numberOfPayments
  return principal * ((monthlyRate * growthFactor) / (growthFactor - 1))
}

export function calculateEffectiveMonthlyRent(monthlyRentalIncome, vacancyRate) {
  const rent = toNumber(monthlyRentalIncome)
  const vacancy = toNumber(vacancyRate) / 100
  return rent * (1 - vacancy)
}

export function calculateMonthlyManagementCost(effectiveMonthlyRent, propertyManagementFee) {
  return toNumber(effectiveMonthlyRent) * (toNumber(propertyManagementFee) / 100)
}

export function calculateTotalCashInvested(downPayment, closingCosts, rehabBudget) {
  return toNumber(downPayment) + toNumber(closingCosts) + toNumber(rehabBudget)
}

export function calculateProjectionSeries(monthlyCashFlow, purchasePrice, years = 5) {
  const annualCashFlow = toNumber(monthlyCashFlow) * 12
  const basePurchasePrice = toNumber(purchasePrice)

  return Array.from({ length: years }, (_, index) => {
    const year = index + 1
    const appreciationGain = basePurchasePrice * (1.04 ** year - 1)
    const projectedValue = annualCashFlow * year + appreciationGain

    return {
      year,
      label: `Year ${year}`,
      projectedValue,
      appreciationGain,
      cumulativeCashFlow: annualCashFlow * year,
    }
  })
}

export function getInvestmentVerdict(annualROI, monthlyCashFlow) {
  const roi = toNumber(annualROI)
  const cashFlow = toNumber(monthlyCashFlow)

  if (roi >= 8 && cashFlow >= 0) {
    return {
      tone: 'green',
      title: 'Strong investment outlook',
      explanation: 'This property meets the target ROI threshold and maintains non-negative monthly cash flow.',
    }
  }

  if (roi >= 4 && cashFlow >= 0) {
    return {
      tone: 'amber',
      title: 'Moderate investment outlook',
      explanation: 'This property may work for cautious investors, but the return profile is more modest.',
    }
  }

  return {
    tone: 'red',
    title: 'High-risk investment outlook',
    explanation: 'This property falls below the preferred ROI threshold or produces negative monthly cash flow.',
  }
}

export function calculateInvestmentMetrics(inputs = {}) {
  const normalized = normalizeROIInputs(inputs)
  const loanAmount = calculateLoanAmount(normalized.purchasePrice, normalized.downPayment)
  const monthlyMortgage = calculateMonthlyMortgagePayment(
    loanAmount,
    normalized.mortgageInterestRate,
    normalized.loanTermYears,
  )
  const effectiveMonthlyRent = calculateEffectiveMonthlyRent(
    normalized.monthlyRentalIncome,
    normalized.vacancyRate,
  )
  const managementCostMonthly = calculateMonthlyManagementCost(
    effectiveMonthlyRent,
    normalized.propertyManagementFee,
  )
  const fixedOperatingExpensesMonthly =
    (normalized.propertyTaxAnnual + normalized.insuranceAnnual + normalized.maintenanceAnnual) / 12
  const monthlyOperatingExpenses = fixedOperatingExpensesMonthly + managementCostMonthly
  const annualOperatingExpenses = monthlyOperatingExpenses * 12
  const noiAnnual = effectiveMonthlyRent * 12 - annualOperatingExpenses
  const monthlyCashFlow = effectiveMonthlyRent - monthlyOperatingExpenses - monthlyMortgage
  const annualCashFlow = monthlyCashFlow * 12
  const totalCashInvested = calculateTotalCashInvested(
    normalized.downPayment,
    normalized.closingCosts,
    normalized.rehabBudget,
  )
  const cashOnCashROI = totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0
  const capRate = normalized.purchasePrice > 0 ? (noiAnnual / normalized.purchasePrice) * 100 : 0
  const grossRentalYield =
    normalized.purchasePrice > 0
      ? ((normalized.monthlyRentalIncome * 12) / normalized.purchasePrice) * 100
      : 0
  const totalMonthlyExpenses = monthlyOperatingExpenses + monthlyMortgage
  const breakEvenOccupancy =
    normalized.monthlyRentalIncome > 0
      ? (totalMonthlyExpenses / normalized.monthlyRentalIncome) * 100
      : 0
  const projection = calculateProjectionSeries(monthlyCashFlow, normalized.purchasePrice, 5)
  const verdict = getInvestmentVerdict(cashOnCashROI, monthlyCashFlow)

  return {
    inputs: normalized,
    hasResults: normalized.purchasePrice > 0 && normalized.monthlyRentalIncome > 0,
    metrics: {
      loanAmount,
      monthlyMortgage,
      effectiveMonthlyRent,
      managementCostMonthly,
      monthlyOperatingExpenses,
      annualOperatingExpenses,
      noiAnnual,
      monthlyCashFlow,
      annualCashFlow,
      totalCashInvested,
      cashOnCashROI,
      capRate,
      grossRentalYield,
      breakEvenOccupancy,
      totalMonthlyExpenses,
    },
    breakdown: [
      { key: 'effective-rent', label: 'Effective rent', value: effectiveMonthlyRent },
      { key: 'mortgage', label: 'Mortgage', value: monthlyMortgage },
      { key: 'property-tax', label: 'Property tax', value: normalized.propertyTaxAnnual / 12 },
      { key: 'insurance', label: 'Insurance', value: normalized.insuranceAnnual / 12 },
      { key: 'maintenance', label: 'Maintenance', value: normalized.maintenanceAnnual / 12 },
      { key: 'management', label: 'Management', value: managementCostMonthly },
      { key: 'net-cash-flow', label: 'Net cash flow', value: monthlyCashFlow },
    ],
    projection,
    verdict,
  }
}
