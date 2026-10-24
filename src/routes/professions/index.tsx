import { useMemo, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHead } from '@/components/atlas/layout'
import { DOMAINS, type DomainId } from '@/data/base'
import { PROFESSIONS } from '@/data/professions'
import { DOMAIN_LIST } from '@/lib/match'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/professions/')({
  head: () => ({ meta: [{ title: 'Каталог профессий — Профессии·2030' }] }),
  component: Catalog,
})

const SORTS = { demand: 'по индексу спроса', growth: 'по росту вакансий', salary: 'по зарплате' } as const

function Catalog() {
  const [domain, setDomain] = useState<DomainId | 'all'>('all')
  const [sort, setSort] = useState<keyof typeof SORTS>('demand')
  const list = useMemo(
    () =>
      PROFESSIONS.filter((p) => domain === 'all' || p.domain === domain).sort((a, b) =>
        sort === 'salary' ? b.salary[1] - a.salary[1] : b[sort] - a[sort],
      ),
    [domain, sort],
  )
  const chip = (on: boolean) =>
    cn('border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors motion-reduce:transition-none', on ? 'border-violet bg-accent/50 text-violet' : 'border-rule text-ink-2 hover:border-violet/50')

  return (
    <>
      <PageHead kicker="Раздел II · Каталог" title="Профессии горизонта 2027–2030">
        <b className="text-ink">{PROFESSIONS.length}</b> специальностей, отобранных по прогнозируемому росту вакансий,
        государственным приоритетам и устойчивости к автоматизации. Нажмите на профессию, чтобы узнать, чем в ней
        занимаются.
      </PageHead>
      <div className="flex flex-wrap gap-2 py-6">
        <button type="button" className={chip(domain === 'all')} onClick={() => setDomain('all')}>Все сферы</button>
        {DOMAIN_LIST.map(([id, d]) => (
          <button key={id} type="button" className={chip(domain === id)} onClick={() => setDomain(id)}>{d.name}</button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="label mr-2">Сортировка</span>
        {(Object.keys(SORTS) as (keyof typeof SORTS)[]).map((k) => (
          <button key={k} type="button" className={chip(sort === k)} onClick={() => setSort(k)}>{SORTS[k]}</button>
        ))}
      </div>
      <ul className="divide-y divide-rule border-y border-rule">
        {list.map((p, i) => (
          <li key={p.slug}>
            <Link to="/professions/$slug" params={{ slug: p.slug }} className="group grid gap-3 py-5 transition-colors hover:bg-accent/20 sm:grid-cols-[3rem_1fr_7rem_6rem_8rem] sm:items-center sm:px-3 motion-reduce:transition-none">
              <span className="font-mono text-sm text-ink-3">{String(i + 1).padStart(2, '0')}</span>
              <span>
                <span className="block font-serif text-lg font-bold group-hover:text-violet">{p.title}</span>
                <span className="block text-sm text-muted-foreground">{p.summary}</span>
              </span>
              <span className="label">{DOMAINS[p.domain].code} · {DOMAINS[p.domain].name}</span>
              <span className="font-mono text-violet">{p.demand} <span className="text-ok">+{p.growth}%</span></span>
              <span className="font-mono text-sm text-ink-2">{p.salary[0]}–{p.salary[1]} тыс. ₽</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
