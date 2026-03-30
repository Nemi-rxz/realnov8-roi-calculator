import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import useWhiteLabel from '../hooks/useWhiteLabel'

const navigationItems = [
  { label: 'Calculator', to: '/' },
  { label: 'Saved Properties', to: '/saved' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'White-label', to: '/white-label' },
]

function isDarkRoute(pathname) {
  return pathname === '/' || pathname === '/pricing'
}

function Layout() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { config } = useWhiteLabel()
  const darkMode = isDarkRoute(location.pathname)

  const navClasses = darkMode
    ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-page-bg)]'
    : 'border-[var(--color-border)] bg-[var(--color-page-bg)] text-[var(--color-ink)]'

  const brandTone = darkMode
    ? 'text-[var(--color-accent)]'
    : 'text-[var(--color-ink)]'

  const taglineTone = darkMode
    ? 'text-[rgba(255,255,255,0.5)]'
    : 'text-[var(--color-muted)]'

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-ink)]">
      <header className={`border-b ${navClasses}`}>
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <NavLink className="inline-flex items-center gap-3" to="/" onClick={() => setIsMenuOpen(false)}>
              {config.logoDataUrl ? (
                <img
                  alt={`${config.companyName} logo`}
                  className="h-9 w-9 rounded-[8px] border border-[var(--color-border)] object-cover"
                  src={config.logoDataUrl}
                />
              ) : null}
              <span
                className={`font-[var(--font-editorial)] text-2xl font-bold tracking-[0.01em] ${brandTone}`}
              >
                {config.companyName}
              </span>
            </NavLink>
            <p className={`mt-1 text-xs ${taglineTone}`}>
              Property investment analysis for modern agencies
            </p>
          </div>

          <button
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[8px] border border-[var(--color-border)] px-3 py-2 text-sm sm:hidden"
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            Menu
          </button>

          <nav className="hidden items-center gap-5 sm:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'text-sm font-medium font-[var(--font-ui)] transition-colors duration-150',
                    isActive ? 'underline underline-offset-8' : 'no-underline',
                    darkMode ? 'hover:text-[var(--color-accent)]' : 'hover:text-[var(--color-accent)]',
                  ].join(' ')
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {isMenuOpen ? (
          <nav className="border-t border-[var(--color-border)] px-4 py-3 sm:hidden">
            <div className="flex flex-col gap-3">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [
                      'min-h-11 border-b border-[var(--color-border)] py-2 text-sm font-medium font-[var(--font-ui)]',
                      isActive ? 'underline underline-offset-8' : 'no-underline',
                    ].join(' ')
                  }
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-border)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-[var(--color-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>Warm editorial interface for property investment analysis.</p>
          <p>{config.footerText}</p>
        </div>
      </footer>
    </div>
  )
}

Layout.propTypes = {}

export default Layout
