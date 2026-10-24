import { createFileRoute, Link } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Quiz11 } from '@/components/atlas/quiz11'
import { Quiz9 } from '@/components/atlas/quiz9'
import { DemandBar } from '@/components/atlas/layout'
import { DOMAINS } from '@/data/base'
import { PROFESSIONS, PROFESSIONS_BY_DEMAND } from '@/data/professions'
import { SPECIALTIES, COLLEGES } from '@/data/colleges'
import { UNIVERSITIES } from '@/data/universities'
import { DOMAIN_LIST } from '@/lib/match'

export const Route = createFileRoute('/')({
  component: Home,
})

const programCount = PROFESSIONS.reduce((n, p) => n + p.programs.length, 0)
const growth = DOMAIN_LIST.map(([id, d]) => {
  const ps = PROFESSIONS.filter((p) => p.domain === id)
  return { id, name: d.name, value: Math.round(ps.reduce((n, p) => n + p.growth, 0) / ps.length) }
})
const maxGrowth = Math.max(...growth.map((g) => g.value))

function Home() {
  return (
    <>
      <section className="grid gap-12 border-b border-rule pb-14 pt-14 lg:grid-cols-[1.5fr_1fr]">
        <div className="rise">
          <p className="label flex flex-wrap gap-x-6 gap-y-1">
            <span className="text-violet">Препринт · Выпуск 2027</span>
            <span>Горизонт прогноза: 2027–2030</span>
            <span>УДК 331.5:378</span>
          </p>
          <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl">
            Профессии, которые будут востребованы в{' '}
            <span className="bg-gradient-to-r from-violet to-orchid bg-clip-text italic text-transparent">2027–2030</span> годах
          </h1>
          <div className="mt-8 max-w-reading border-l-2 border-violet pl-5">
            <p className="label mb-2">Аннотация</p>
            <p className="text-ink-2">
              Атлас сопоставляет предметы ЕГЭ и ОГЭ с профессиями, спрос на которые растёт быстрее рынка труда.
              Короткий опросник подбирает подходящие профессии, вузы после 11 класса или колледжи после 9 класса
              и показывает ориентировочные проходные баллы.
            </p>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-4 gap-4">
            {[
              [PROFESSIONS.length, 'профессий'],
              [Object.keys(UNIVERSITIES).length, 'вузов'],
              [programCount, 'программ'],
              [Object.keys(COLLEGES).length, 'колледжей'],
            ].map(([n, l]) => (
              <div key={l} className="border-t border-rule pt-2">
                <dt className="font-serif text-4xl font-bold text-ink">{n}</dt>
                <dd className="label">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="panel rise self-end p-6" style={{ animationDelay: '150ms' }}>
          <p className="label mb-4">Рис. 1 · Δ вакансий к 2030, %</p>
          <ul className="space-y-3">
            {growth.map((g) => (
              <li key={g.id}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-2">{g.name}</span>
                  <span className="font-mono text-violet">+{g.value}</span>
                </div>
                <div className="mt-1 h-2 bg-muted">
                  <div className="h-full bg-gradient-to-r from-violet-deep to-violet" style={{ width: `${(g.value / maxGrowth) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <figcaption className="mt-4 text-xs text-muted-foreground">
            Средний прогнозируемый прирост вакансий по сферам. Источник: сводные отраслевые оценки, см.{' '}
            <Link to="/methodology" className="text-violet underline-offset-2 hover:underline">методологию</Link>.
          </figcaption>
        </figure>
      </section>

      <section id="quiz" className="border-b border-rule py-14">
        <p className="label text-violet">§ 1</p>
        <h2 className="mt-2 font-serif text-4xl font-bold">Опросник абитуриента</h2>
        <p className="mt-3 max-w-reading text-ink-2">
          Выберите, после какого класса поступаете. Данные не сохраняются: расчёт выполняется в браузере.
        </p>
        <Tabs defaultValue="11" className="mt-8">
          <TabsList>
            <TabsTrigger value="11">После 11 класса · ЕГЭ → вуз</TabsTrigger>
            <TabsTrigger value="9">После 9 класса · аттестат → колледж</TabsTrigger>
          </TabsList>
          <TabsContent value="11" className="panel mt-4 p-6 sm:p-8"><Quiz11 /></TabsContent>
          <TabsContent value="9" className="panel mt-4 p-6 sm:p-8"><Quiz9 /></TabsContent>
        </Tabs>
      </section>

      <section className="py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label text-violet">§ 2</p>
            <h2 className="mt-2 font-serif text-4xl font-bold">Лидеры по индексу востребованности</h2>
          </div>
          <Link to="/professions" className="label text-violet hover:text-orchid">Весь каталог →</Link>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROFESSIONS_BY_DEMAND.slice(0, 4).map((p, i) => (
            <li key={p.slug}>
              <Link to="/professions/$slug" params={{ slug: p.slug }} className="panel group flex h-full flex-col p-5 transition-shadow hover:glow motion-reduce:transition-none">
                <p className="label flex justify-between"><span>№ {i + 1}</span><span>{DOMAINS[p.domain].code}</span></p>
                <p className="mt-6 font-serif text-5xl font-bold text-violet">{p.demand}</p>
                <p className="label">индекс спроса</p>
                <p className="mt-4 font-medium group-hover:text-violet">{p.title}</p>
                <div className="mt-auto pt-4"><DemandBar value={p.demand} /></div>
              </Link>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-sm text-muted-foreground">
          После 9 класса? Смотрите{' '}
          <Link to="/colleges" className="text-violet hover:underline">{SPECIALTIES.length} специальностей колледжей</Link>.
        </p>
      </section>
    </>
  )
}
