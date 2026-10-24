import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHead } from '@/components/atlas/layout'
import { DOMAINS, type DomainId } from '@/data/base'
import { COLLEGES, SPECIALTIES } from '@/data/colleges'
import { DOMAIN_LIST } from '@/lib/match'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/colleges/')({
  head: () => ({ meta: [{ title: 'После 9 класса: колледжи и специальности — Профессии·2030' }] }),
  component: Colleges,
})

function Colleges() {
  const [domain, setDomain] = useState<DomainId | 'all'>('all')
  const list = SPECIALTIES.filter((s) => domain === 'all' || s.domain === domain)
  const chip = (on: boolean) =>
    cn('border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors motion-reduce:transition-none', on ? 'border-violet bg-accent/50 text-violet' : 'border-rule text-ink-2 hover:border-violet/50')
  return (
    <>
      <PageHead kicker="Раздел III · После 9 класса" title="Колледжи и специальности СПО">
        <b className="text-ink">{SPECIALTIES.length}</b> специальностей в <b className="text-ink">{Object.keys(COLLEGES).length}</b> колледжах.
        Поступление — по среднему баллу аттестата, без ЕГЭ. После колледжа можно сразу работать или продолжить учёбу в вузе.
      </PageHead>
      <div className="flex flex-wrap gap-2 py-6">
        <button type="button" className={chip(domain === 'all')} onClick={() => setDomain('all')}>Все сферы</button>
        {DOMAIN_LIST.map(([id, d]) => (
          <button key={id} type="button" className={chip(domain === id)} onClick={() => setDomain(id)}>{d.name}</button>
        ))}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li key={s.slug}>
            <Link to="/colleges/$slug" params={{ slug: s.slug }} className="panel group flex h-full flex-col p-5 transition-shadow hover:glow motion-reduce:transition-none">
              <p className="label flex justify-between"><span>{s.code}</span><span>{DOMAINS[s.domain].code}</span></p>
              <p className="mt-3 font-serif text-lg font-bold leading-tight group-hover:text-violet">{s.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
              <p className="mt-auto pt-4 font-mono text-xs text-ink-2">
                {s.duration} · от {Math.min(...s.colleges.map((c) => c.score)).toFixed(2)} · {s.colleges.length} колл.
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
