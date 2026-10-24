import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { DOMAINS, SUBJECTS } from '@/data/base'
import { COLLEGES, getSpecialty } from '@/data/colleges'
import { PROFESSIONS } from '@/data/professions'

export const Route = createFileRoute('/colleges/$slug')({
  loader: ({ params }) => {
    const s = getSpecialty(params.slug)
    if (!s) throw notFound()
    return s
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.title ?? 'Специальность'} — после 9 класса` }, { name: 'description', content: loaderData?.summary ?? '' }],
  }),
  component: SpecialtyPage,
})

function SpecialtyPage() {
  const s = Route.useLoaderData()
  const next = PROFESSIONS.filter((p) => p.spo.includes(s.slug))
  return (
    <article className="pt-10">
      <Link to="/colleges" className="label inline-flex items-center gap-1 hover:text-violet"><ArrowLeft className="size-3" /> После 9 класса</Link>
      <header className="rise mt-6 border-b border-rule pb-10">
        <p className="label text-violet">{s.code} · {DOMAINS[s.domain].name}</p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold leading-tight sm:text-5xl">{s.title}</h1>
        <p className="mt-5 max-w-reading text-lg text-ink-2">{s.summary}</p>
      </header>
      <div className="grid gap-12 py-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-12">
          <section>
            <h2 className="font-serif text-2xl font-bold">1. Чем предстоит заниматься</h2>
            <ol className="mt-5 space-y-3">
              {s.work.map((t, i) => (
                <li key={t} className="flex gap-4 border-t border-rule pt-3"><span className="font-mono text-sm text-violet">1.{i + 1}</span><span>{t}</span></li>
              ))}
            </ol>
          </section>
          <section className="grid gap-8 sm:grid-cols-2">
            <div>
              <h2 className="font-serif text-2xl font-bold">2. Что изучают</h2>
              <ul className="mt-4 space-y-2 text-ink-2">{s.study.map((t) => <li key={t}>— {t}</li>)}</ul>
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold">3. Кем работать</h2>
              <ul className="mt-4 space-y-2 text-ink-2">{s.jobs.map((t) => <li key={t}>— {t}</li>)}</ul>
              <p className="mt-4 font-mono text-violet">{s.salaryStart[0]}–{s.salaryStart[1]} тыс. ₽ на старте</p>
            </div>
          </section>
          <section>
            <h2 className="font-serif text-2xl font-bold">4. Где учиться</h2>
            <ul className="mt-5 divide-y divide-rule border-y border-rule">
              {[...s.colleges].sort((a, b) => b.score - a.score).map((c) => (
                <li key={c.college} className="flex items-center justify-between gap-4 py-3">
                  <span><b>{COLLEGES[c.college].short}</b><span className="block text-xs text-ink-3">{COLLEGES[c.college].name} · {COLLEGES[c.college].city}</span></span>
                  <span className="shrink-0 text-right font-mono text-violet">≈{c.score.toFixed(2)}<span className="label block">ср. балл</span></span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">Ориентировочный средний балл аттестата для поступления на бюджет в 2024–2025 гг.</p>
          </section>
          {next.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold">5. Куда расти дальше</h2>
              <p className="mt-2 text-sm text-muted-foreground">Профессии атласа, в которые ведёт эта специальность после вуза.</p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {next.map((p) => (
                  <li key={p.slug}>
                    <Link to="/professions/$slug" params={{ slug: p.slug }} className="panel flex justify-between gap-3 p-4 hover:glow">
                      <span className="font-medium">{p.title}</span><span className="font-mono text-violet">{p.demand}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="panel glow h-fit p-5 lg:sticky lg:top-24">
          <p className="label mb-4">Паспорт специальности</p>
          <dl className="space-y-4 text-sm">
            <div><dt className="label">Квалификация</dt><dd>{s.qualification}</dd></div>
            <div><dt className="label">Срок обучения</dt><dd className="font-mono">{s.duration}</dd></div>
            <div><dt className="label">Поступление</dt><dd>Конкурс аттестатов{s.extra ? ` + ${s.extra.toLowerCase()}` : ''}</dd></div>
            <div><dt className="label">Полезные ОГЭ</dt><dd>{s.oge.map((o) => SUBJECTS[o].name).join(', ')}</dd></div>
          </dl>
        </aside>
      </div>
    </article>
  )
}
