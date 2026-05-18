import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

const Calculator = lazy(() => import('./pages/Calculator'))
const PricingPage = lazy(() => import('./pages/SalesPage'))
const SavedPropertiesPage = lazy(() => import('./pages/SavedProperties'))
const WhiteLabelConfigPage = lazy(() => import('./pages/WhiteLabelConfig'))

function RouteFallback() {
  return (
    <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 sm:p-8">
      <p className="section-label">Loading</p>
      <p className="mt-3 text-sm text-[var(--color-secondary)]">
        Preparing the next screen...
      </p>
    </div>
  )
}

function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Calculator />} />
          <Route path="/saved" element={<SavedPropertiesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/white-label" element={<WhiteLabelConfigPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
