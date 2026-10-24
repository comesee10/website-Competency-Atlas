import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHead } from '@/components/atlas/layout'
import { examLabel } from '@/data/base'
import { PROFESSIONS } from '@/data/professions'
import { UNIVERSITIES, type UniId } from '@/data/universities'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/universities')({
  head: () => ({ meta: [{ title: 'Вузы и проходные баллы — Профессии·2030' }] }),
  component: Universities,
})

const rows = PROFESSIONS.flatMap((p) => p.programs.map((pr) => ({ ...pr, profession: p })))
const unis = (Object.keys(UNIVERSITIES) as UniId[])
  .map((id) => {
    const list = rows.filter((r) => r.uni === id).sort((a, b) => b.budget - a.budget)
    return { id, ...UNIVERSITIES[id], list, avg: list.length ? Math.round(list.reduce((n, r) => n + r.budget, 0) / list.length) : 0 }
  })
  .filter((u) => u.list.length)
  .sort((a, b) => b.avg - a.avg)
const cities = [...new Set(unis.map((u) => u.city))]

function Universities() {
  const [city, setCity] = useState('all')
  const chip = (on: boolean) =>
    cn('border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors motion-reduce:transition-none', on ? 'border-violet bg-accent/50 text-violet' : 'border-rule text-ink-2 hover:border-violet/50')
  return (
    <>
      <PageHead kicker="Раздел IV · Вузы" title="Вузы и проходные баллы">
        <b className="text-ink">{unis.length}</b> университетов из {cities.length} городов, ведущих подготовку по профессиям атласа.
        Упорядочены по среднему проходному баллу на бюджет.
      </PageHead>
      <div className="flex flex-wrap gap-2 py-6">
        <button type="button" className={chip(city === 'all')} onClick={() => setCity('all')}>Все города</button>
        {cities.map((c) => <button key={c} type="button" className={chip(city === c)} onClick={() => setCity(c)}>{c}</button>)}
      </div>
      <div className="space-y-6">
        {unis.filter((u) => city === 'all' || u.city === city).map((u) => (
          <section key={u.id} className="panel p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="label">{u.city}</p>
                <h2 className="font-serif text-2xl font-bold">{u.short}</h2>
                <p className="text-sm text-muted-foreground">{u.name}</p>
              </div>
              <p className="text-right"><span className="font-serif text-3xl font-bold text-violet">≈{u.avg}</span><span className="label block">средний балл на бюджет</span></p>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead><tr className="label text-left"><th className="py-2 font-normal">Направление</th><th className="font-normal">Профессия</th><th className="font-normal">ЕГЭ</th><th className="text-right font-normal">Бюджет</th><th className="text-right font-normal">Платно</th></tr></thead>
                <tbody>
                  {u.list.map((r) => (
                    <tr key={r.name + r.profession.slug} className="border-t border-rule">
                      <td className="py-2">{r.name}<span className="block font-mono text-xs text-ink-3">{r.code}</span></td>
                      <td><Link to="/professions/$slug" params={{ slug: r.profession.slug }} className="text-ink-2 hover:text-violet">{r.profession.title}</Link></td>
                      <td className="font-mono text-xs text-ink-2">{examLabel(r.exams)}</td>
                      <td className="text-right font-mono text-violet">≈{r.budget}</td>
                      <td className="text-right font-mono text-ink-2">≈{r.paid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
