import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SUBJECTS, SUBJECT_IDS, type DomainId, type SubjectId } from '@/data/base'
import { UNIVERSITIES } from '@/data/universities'
import { CHANCE, DOMAIN_LIST, matchProfessions, sensitivity, type Scores } from '@/lib/match'
import { cn } from '@/lib/utils'

const STEPS = ['Предметы ЕГЭ', 'Ожидаемые баллы', 'Сферы интересов']

export function Quiz11() {
  const [step, setStep] = useState(0)
  const [subjects, setSubjects] = useState<SubjectId[]>(['rus'])
  const [scores, setScores] = useState<Scores>({ rus: 80 })
  const [interests, setInterests] = useState<DomainId[]>([])
  const [done, setDone] = useState(false)

  const picked: Scores = useMemo(
    () => Object.fromEntries(subjects.map((s) => [s, scores[s] ?? 70])),
    [subjects, scores],
  )
  const results = useMemo(() => (done ? matchProfessions(picked, interests) : []), [done, picked, interests])
  const hints = useMemo(
    () => (done ? sensitivity(picked, interests, SUBJECT_IDS.filter((s) => !subjects.includes(s))).slice(0, 3) : []),
    [done, picked, interests, subjects],
  )

  const toggle = (s: SubjectId) => {
    if (s === 'rus') return
    setSubjects((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))
  }
  const need = Math.max(0, 3 - subjects.length)

  if (done) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label text-violet">Отчёт</p>
            <h3 className="mt-2 font-serif text-3xl font-bold">
              {results.length ? `Подходящих профессий: ${results.length}` : 'Подходящих программ не найдено'}
            </h3>
          </div>
          <Button variant="outline" onClick={() => { setDone(false); setStep(0) }}>
            <ArrowLeft /> Изменить ответы
          </Button>
        </div>
        {hints.length > 0 && (
          <div className="panel p-4 text-sm">
            <span className="label mr-2 text-orchid">Совет</span>
            {hints.map((h, i) => (
              <span key={h.subject}>
                {i > 0 && '; '}
                «{SUBJECTS[h.subject].name}» откроет ещё <b className="text-ink">{h.gain}</b>
              </span>
            ))}
            {' '}— подумайте о дополнительном экзамене.
          </div>
        )}
        {!results.length && (
          <p className="text-muted-foreground">Попробуйте добавить профильную математику, информатику, физику или биологию — большинство программ атласа требуют один из этих экзаменов.</p>
        )}
        <ol className="grid gap-4 md:grid-cols-2">
          {results.slice(0, 10).map((m, i) => (
            <li key={m.profession.slug} className="panel rise flex flex-col p-5" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <Link to="/professions/$slug" params={{ slug: m.profession.slug }} className="font-serif text-xl font-bold leading-tight hover:text-violet">
                  {m.profession.title}
                </Link>
                <div className="text-right">
                  <p className="font-mono text-2xl text-violet">{m.index}</p>
                  <p className="label">соответствие</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {m.programs.slice(0, 3).map(({ program, sum, chance }) => (
                  <li key={program.uni + program.name} className="flex justify-between gap-3 border-t border-rule pt-1.5">
                    <span className="text-ink-2">
                      <b className="text-ink">{UNIVERSITIES[program.uni].short}</b> · {program.name}
                    </span>
                    <span className={cn('shrink-0 font-mono text-xs', CHANCE[chance].tone)}>
                      {sum}/{program.budget} · {CHANCE[chance].label}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/professions/$slug" params={{ slug: m.profession.slug }} className="label mt-auto pt-4 text-violet hover:text-orchid">
                Чем заниматься →
              </Link>
            </li>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div>
      <ol className="mb-8 grid grid-cols-3 gap-2">
        {STEPS.map((s, i) => (
          <li key={s} className={cn('border-t-2 pt-2', i <= step ? 'border-violet' : 'border-rule')}>
            <p className="label">Шаг 0{i + 1}</p>
            <p className={cn('text-sm', i === step ? 'text-ink' : 'text-ink-3')}>{s}</p>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div>
          <h3 className="font-serif text-2xl font-bold">Какие экзамены вы сдаёте?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Русский язык обязателен. Отметьте ещё минимум два предмета.</p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {SUBJECT_IDS.map((s) => {
              const on = subjects.includes(s)
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  disabled={s === 'rus'}
                  onClick={() => toggle(s)}
                  className={cn(
                    'flex items-center gap-3 border px-3 py-3 text-left text-sm transition-colors motion-reduce:transition-none',
                    on ? 'glow border-violet bg-accent/50' : 'border-rule hover:border-violet/50',
                    s === 'rus' && 'cursor-default',
                  )}
                >
                  <span className="font-mono text-[10px] text-violet">{SUBJECTS[s].short.toUpperCase()}</span>
                  <span className="flex-1">{SUBJECTS[s].name}</span>
                  {on && <Check className="size-4 text-violet" />}
                </button>
              )
            })}
          </div>
          <p className="label mt-4">Выбрано: {subjects.length}{need > 0 && ` · выберите ещё ${need}`}</p>
        </div>
      )}

      {step === 1 && (
        <div>
          <h3 className="font-serif text-2xl font-bold">Сколько баллов вы ожидаете?</h3>
          <div className="mt-6 space-y-5">
            {subjects.map((s) => (
              <label key={s} className="block">
                <span className="flex justify-between text-sm">
                  <span>{SUBJECTS[s].name}</span>
                  <span className="font-mono text-violet">{picked[s]}</span>
                </span>
                <input
                  type="range" min={40} max={100} value={picked[s]}
                  onChange={(e) => setScores((c) => ({ ...c, [s]: Number(e.target.value) }))}
                  className="mt-2 w-full accent-[var(--violet)]"
                />
              </label>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3 className="font-serif text-2xl font-bold">Что вам интересно?</h3>
          <p className="mt-2 text-sm text-muted-foreground">Можно пропустить — тогда учтём все сферы одинаково.</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {DOMAIN_LIST.map(([id, d]) => {
              const on = interests.includes(id)
              return (
                <button
                  key={id} type="button" aria-pressed={on}
                  onClick={() => setInterests((c) => (on ? c.filter((x) => x !== id) : [...c, id]))}
                  className={cn('border p-4 text-left transition-colors motion-reduce:transition-none', on ? 'glow border-violet bg-accent/50' : 'border-rule hover:border-violet/50')}
                >
                  <span className="label text-violet">{d.code}</span>
                  <p className="mt-1 font-medium">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft /> Назад
        </Button>
        {step < 2 ? (
          <Button disabled={need > 0} onClick={() => setStep((s) => s + 1)}>
            Далее <ArrowRight />
          </Button>
        ) : (
          <Button onClick={() => setDone(true)}>
            Показать профессии <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  )
}

