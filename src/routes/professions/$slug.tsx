import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { DemandBar } from '@/components/atlas/layout'
import { DOMAINS, examLabel } from '@/data/base'
import { COLLEGES, getSpecialty } from '@/data/colleges'
import { getProfession, relatedProfessions } from '@/data/professions'
import { UNIVERSITIES } from '@/data/universities'

export const Route = createFileRoute('/professions/$slug')({
  loader: ({ params }) => {
    const p = getProfession(params.slug)
    if (!p) throw notFound()
    return p
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? 'Профессия'} — Профессии·2030` }, { name: 'description', content: loaderData?.summary ?? '' }],
  }),
  component: ProfessionPage,
})

function ProfessionPage() {
  const p = Route.useLoaderData()
  const d = DOMAINS[p.domain]
  const specs = p.spo.map(getSpecialty).filter((s) => s !== undefined)
  return (
    <article className="pt-10">
      <Link to="/professions" className="label inline-flex items-center gap-1 hover:text-violet"><ArrowLeft className="size-3" /> Каталог профессий</Link>
      <header className="rise mt-6 border-b border-rule pb-10">
        <p className="label text-violet">{d.code} · {d.name}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-6xl">{p.title}</h1>
        <p className="mt-5 max-w-reading text-lg text-ink-2">{p.summary}</p>
      </header>

      <div className="grid gap-12 py-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-bold">1. Чем занимается специалист</h2>
            <ol className="mt-5 space-y-3">
              {p.tasks.map((t, i) => (
                <li key={t} className="flex gap-4 border-t border-rule pt-3">
                  <span className="font-mono text-sm text-violet">1.{i + 1}</span><span>{t}</span>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">2. Типичный рабочий день</h2>
            <ol className="relative mt-5 space-y-5 border-l border-violet/40 pl-6">
              {p.day.map((s) => (
                <li key={s.time} className="relative">
                  <span className="absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full bg-violet shadow-[0_0_12px_var(--violet)]" />
                  <span className="font-mono text-sm text-violet">{s.time}</span>
                  <p className="text-ink-2">{s.text}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-bold">3. Инструменты</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tools.map((t) => <li key={t} className="border border-rule px-2.5 py-1 font-mono text-xs text-ink-2">{t}</li>)}
              </ul>
              <h3 className="label mt-6">Ключевые компетенции</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.skills.map((t) => <li key={t} className="bg-accent/60 px-2.5 py-1 text-xs">{t}</li>)}
              </ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">4. Кому подойдёт</h2>
              <ul className="mt-4 space-y-2 text-ink-2">
                {p.fit.map((t) => <li key={t}>— {t}</li>)}
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">5. Карьера и зарплата</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
              {p.career.map((c, i) => (
                <li key={c.step} className="panel p-4">
                  <p className="label">Этап {i + 1} · {c.years}</p>
                  <p className="mt-2 font-medium">{c.step}</p>
                  <p className="mt-2 font-mono text-violet">{c.salary} тыс. ₽</p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">6. Почему растёт спрос</h2>
            <ul className="mt-4 space-y-2 text-ink-2">{p.drivers.map((t) => <li key={t}>— {t}</li>)}</ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold">7. Где учиться после 11 класса</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="label text-left"><th className="py-2 font-normal">Вуз</th><th className="font-normal">Направление</th><th className="font-normal">ЕГЭ</th><th className="text-right font-normal">Бюджет</th><th className="text-right font-normal">Платно</th></tr>
                </thead>
                <tbody>
                  {[...p.programs].sort((a, b) => b.budget - a.budget).map((pr) => (
                    <tr key={pr.uni + pr.name} className="border-t border-rule">
                      <td className="py-2.5"><b>{UNIVERSITIES[pr.uni].short}</b><span className="block text-xs text-ink-3">{UNIVERSITIES[pr.uni].city}</span></td>
                      <td>{pr.name}<span className="block font-mono text-xs text-ink-3">{pr.code}</span></td>
                      <td className="font-mono text-xs text-ink-2">{examLabel(pr.exams)}</td>
                      <td className="text-right font-mono text-violet">≈{pr.budget}</td>
                      <td className="text-right font-mono text-ink-2">≈{pr.paid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Сумма трёх ЕГЭ (макс. 300), ориентировочно по приёмным кампаниям 2024–2025 гг.</p>
          </section>

          {specs.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold">8. Путь после 9 класса</h2>
              <p className="mt-2 text-sm text-muted-foreground">Можно начать в колледже, а затем продолжить в вузе по профилю.</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {specs.map((s) => (
                  <li key={s.slug}>
                    <Link to="/colleges/$slug" params={{ slug: s.slug }} className="panel block p-4 hover:glow">
                      <p className="label">{s.code} · {s.duration}</p>
                      <p className="mt-1 font-medium">{s.title}</p>
                      <p className="mt-1 text-xs text-ink-3">{s.colleges.slice(0, 3).map((c) => COLLEGES[c.college].short).join(', ')}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="panel glow p-5">
            <p className="label mb-4">Паспорт профессии</p>
            <dl className="space-y-4">
              <div><dt className="label">Индекс спроса</dt><dd className="font-serif text-4xl font-bold text-violet">{p.demand}<span className="text-base text-ink-3">/100</span></dd><DemandBar value={p.demand} /></div>
              <div><dt className="label">Рост вакансий к 2030</dt><dd className="font-mono text-xl text-ok">+{p.growth}%</dd></div>
              <div><dt className="label">Зарплата, тыс. ₽/мес</dt><dd className="font-mono text-xl">{p.salary[0]}–{p.salary[1]}</dd></div>
              <div><dt className="label">Программ в атласе</dt><dd className="font-mono text-xl">{p.programs.length}</dd></div>
            </dl>
            <Link to="/" hash="quiz" className="mt-5 block bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90">Проверить свои шансы</Link>
          </div>
          <div>
            <p className="label mb-3">Смежные профессии</p>
            <ul className="space-y-2">
              {relatedProfessions(p).map((r) => (
                <li key={r.slug}>
                  <Link to="/professions/$slug" params={{ slug: r.slug }} className="flex items-center justify-between gap-3 border-t border-rule pt-2 text-sm hover:text-violet">
                    <span>{r.title}</span><span className="font-mono text-violet">{r.demand}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  )
}
