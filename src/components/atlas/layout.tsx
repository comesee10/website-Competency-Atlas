import { Link } from '@tanstack/react-router'

const NAV = [
  { to: '/', label: 'Опросник' },
  { to: '/professions', label: 'Профессии' },
  { to: '/colleges', label: 'После 9 класса' },
  { to: '/universities', label: 'Вузы и баллы' },
  { to: '/methodology', label: 'Методология' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-serif text-2xl font-bold tracking-tight">
            Профессии<span className="text-violet">·</span>2030
          </span>
          <span className="label hidden md:inline">Атлас востребованных специальностей</span>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === '/' }}
              className="border border-transparent px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2 transition-colors hover:border-rule hover:text-ink motion-reduce:transition-none"
              activeProps={{ className: 'border-violet/60 text-violet bg-accent/40' }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto grid max-w-content gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-bold">
            Профессии<span className="text-violet">·</span>2030
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Исследовательский атлас профессий, востребованных в 2027–2030 гг., с подбором вузов после 11 класса и колледжей после 9.
          </p>
        </div>
        <div>
          <p className="label mb-3">Разделы</p>
          <ul className="space-y-1.5 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="text-ink-2 hover:text-violet">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-3">Примечание</p>
          <p className="text-sm text-muted-foreground">
            Проходные баллы приведены ориентировочно по данным приёмных кампаний 2024–2025 гг. Актуальные значения публикуют приёмные комиссии.
          </p>
        </div>
      </div>
    </footer>
  )
}

export function PageHead({ kicker, title, children }: { kicker: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section className="rise border-b border-rule pb-10 pt-14">
      <p className="label text-violet">{kicker}</p>
      <h1 className="mt-4 max-w-4xl font-serif text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">{title}</h1>
      {children && <div className="mt-6 max-w-reading text-lg text-ink-2">{children}</div>}
    </section>
  )
}

export function DemandBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full bg-gradient-to-r from-violet-deep via-violet to-orchid" style={{ width: `${value}%` }} />
    </div>
  )
}
