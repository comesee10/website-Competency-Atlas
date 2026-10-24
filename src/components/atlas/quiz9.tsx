import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { type DomainId } from '@/data/base'
import { COLLEGES, COLLEGE_CHANCE, SPECIALTIES, collegeChance } from '@/data/colleges'
import { DOMAIN_LIST } from '@/lib/match'
import { cn } from '@/lib/utils'

export function Quiz9() {
  const [avg, setAvg] = useState(4.3)
  const [interests, setInterests] = useState<DomainId[]>([])
  const [done, setDone] = useState(false)

  const results = useMemo(
    () =>
      SPECIALTIES.filter((s) => !interests.length || interests.includes(s.domain))
        .map((s) => {
          const offers = s.colleges
            .map((c) => ({ ...c, chance: collegeChance(avg, c.score) }))
            .sort((a, b) => b.score - a.score)
          return { s, offers, ok: offers.filter((o) => o.chance !== 'low').length }
        })
        .sort((a, b) => b.ok - a.ok),
    [avg, interests],
  )

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
        <div>
          <h3 className="font-serif text-2xl font-bold">Средний балл аттестата</h3>
          <p className="mt-2 text-sm text-muted-foreground">Колледжи принимают на бюджет по среднему баллу аттестата за 9 класс.</p>
          <p className="mt-6 font-mono text-5xl text-violet">{avg.toFixed(2)}</p>
          <input
            type="range" min={3} max={5} step={0.05} value={avg}
            onChange={(e) => setAvg(Number(e.target.value))}
            aria-label="Средний балл аттестата"
            className="mt-3 w-full accent-[var(--violet)]"
          />
          <div className="label flex justify-between"><span>3.0</span><span>5.0</span></div>
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold">Сферы интересов</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {DOMAIN_LIST.map(([id, d]) => {
              const on = interests.includes(id)
              return (
                <button
                  key={id} type="button" aria-pressed={on}
                  onClick={() => setInterests((c) => (on ? c.filter((x) => x !== id) : [...c, id]))}
                  className={cn('border px-3 py-2.5 text-left text-sm transition-colors motion-reduce:transition-none', on ? 'glow border-violet bg-accent/50' : 'border-rule hover:border-violet/50')}
                >
                  <span className="label mr-2 text-violet">{d.code}</span>{d.name}
                </button>
              )
            })}
          </div>
          <Button className="mt-6" onClick={() => setDone(true)}>Подобрать колледж</Button>
        </div>
      </div>

      {done && (
        <div className="mt-10 border-t border-rule pt-8">
          <p className="label text-violet">Найдено специальностей: {results.length}</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {results.map(({ s, offers }) => (
              <li key={s.slug} className="panel flex flex-col p-5">
                <p className="label">{s.code} · {s.duration}</p>
                <Link to="/colleges/$slug" params={{ slug: s.slug }} className="mt-1 font-serif text-lg font-bold leading-tight hover:text-violet">
                  {s.title}
                </Link>
                <p className="mt-1 text-sm text-muted-foreground">{s.qualification}</p>
                <ul className="mt-3 space-y-1 text-sm">
                  {offers.slice(0, 3).map((o) => (
                    <li key={o.college} className="flex justify-between gap-3 border-t border-rule pt-1">
                      <span className="text-ink-2">{COLLEGES[o.college].short} · {COLLEGES[o.college].city}</span>
                      <span className={cn('shrink-0 font-mono text-xs', COLLEGE_CHANCE[o.chance].tone)}>
                        ≈{o.score.toFixed(2)} · {COLLEGE_CHANCE[o.chance].label}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/colleges/$slug" params={{ slug: s.slug }} className="label mt-auto pt-4 text-violet hover:text-orchid">
                  Чем заниматься →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
