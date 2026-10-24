import { DOMAINS, type DomainId, type Exam, type SubjectId } from '@/data/base'
import { PROFESSIONS, type Profession, type Program } from '@/data/professions'

export type Scores = Partial<Record<SubjectId, number>>

/** Сумма трёх экзаменов программы или null, если абитуриент не допущен. */
export function programSum(exams: Exam[], scores: Scores) {
  let sum = 0
  for (const e of exams) {
    const opts = Array.isArray(e) ? e : [e]
    const best = Math.max(...opts.map((s) => scores[s] ?? -1))
    if (best < 0) return null
    sum += best
  }
  return sum
}

export type Chance = 'budget' | 'edge' | 'paid' | 'low'
export const CHANCE = {
  budget: { label: 'Бюджет вероятен', tone: 'text-ok' },
  edge: { label: 'Пограничная зона', tone: 'text-warn' },
  paid: { label: 'Платное обучение', tone: 'text-violet' },
  low: { label: 'Ниже порога', tone: 'text-bad' },
} as const

export function chance(sum: number, p: Program): Chance {
  if (sum >= p.budget) return 'budget'
  if (sum >= p.budget - 10) return 'edge'
  if (sum >= p.paid) return 'paid'
  return 'low'
}

export type Match = {
  profession: Profession
  index: number
  programs: { program: Program; sum: number; chance: Chance }[]
}

export function matchProfessions(scores: Scores, interests: DomainId[]): Match[] {
  return PROFESSIONS.map((profession) => {
    const programs = profession.programs.flatMap((program) => {
      const sum = programSum(program.exams, scores)
      return sum === null ? [] : [{ program, sum, chance: chance(sum, program) }]
    })
    const C = programs.length / profession.programs.length
    const P = programs.length
      ? Math.max(...programs.map((x) => Math.min(1, Math.max(0, 1 - (x.program.budget - x.sum) / 60))))
      : 0
    const D = interests.length ? (interests.includes(profession.domain) ? 1 : 0) : 0.5
    const S = profession.demand / 100
    const index = Math.round(100 * (0.45 * C + 0.25 * P + 0.15 * D + 0.15 * S))
    programs.sort((a, b) => b.sum - b.program.budget - (a.sum - a.program.budget))
    return { profession, index, programs }
  })
    .filter((m) => m.programs.length > 0)
    .sort((a, b) => b.index - a.index)
}

/** Сколько профессий откроет каждый ещё не выбранный предмет (с условным баллом 70). */
export function sensitivity(scores: Scores, interests: DomainId[], candidates: SubjectId[]) {
  const base = matchProfessions(scores, interests).length
  return candidates
    .map((s) => ({ subject: s, gain: matchProfessions({ ...scores, [s]: 70 }, interests).length - base }))
    .filter((x) => x.gain > 0)
    .sort((a, b) => b.gain - a.gain)
}

export const DOMAIN_LIST = Object.entries(DOMAINS) as [DomainId, (typeof DOMAINS)[DomainId]][]
