import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import useWhiteLabel from '../hooks/useWhiteLabel'
import useThemeMode from '../hooks/useThemeMode'

const navigationItems = [
  { label: 'Calculator', to: '/' },
  { label: 'Saved Properties', to: '/saved' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'White-label', to: '/white-label' },
]

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { config } = useWhiteLabel()
  const { isDarkMode, toggleThemeMode } = useThemeMode()

  return (
    <div className="min-h-screen bg-[var(--color-page-bg)] text-[var(--color-ink)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card-bg)] text-[var(--color-ink)]">
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
                className="font-[var(--font-editorial)] text-2xl font-bold tracking-[0.01em] text-[var(--color-ink)]"
              >
                {config.companyName}
              </span>
            </NavLink>
            <p className="mt-1 text-xs text-[var(--color-secondary)]">
              Property investment analysis for modern agencies
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <nav className="hidden items-center gap-5 sm:flex">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    [
                      'rounded-[6px] px-3 py-2 text-sm font-bold font-[var(--font-ui)] transition-colors duration-150',
                      isActive ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-secondary)] no-underline',
                      'hover:text-[var(--color-accent)]',
                    ].join(' ')
                  }
                  to={item.to}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDarkMode}
              className={`zq-theme-toggle ${isDarkMode ? 'zq-theme-toggle-dark' : ''}`}
              type="button"
              onClick={toggleThemeMode}
            >
              <span className="zq-theme-track" aria-hidden="true">
                <span className="zq-theme-icon zq-theme-icon-sun" />
                <span className="zq-theme-icon zq-theme-icon-moon" />
                <span className="zq-theme-thumb" />
              </span>
            </button>

            <button
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[8px] border border-[var(--color-border)] px-3 py-2 text-sm sm:hidden"
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              Menu
            </button>
          </div>
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
                      'min-h-11 rounded-[6px] px-3 py-2 text-sm font-bold font-[var(--font-ui)]',
                      isActive ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-secondary)] no-underline',
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
          <p>Zoqueda UI interface for property investment analysis.</p>
          <p>{config.footerText}</p>
        </div>
      </footer>
    </div>
  )
}

Layout.propTypes = {}

export default Layout
