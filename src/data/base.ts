// Справочники атласа: предметы ЕГЭ/ОГЭ и сферы профессий.

export const SUBJECTS = {
  rus: { name: 'Русский язык', short: 'Рус' },
  math: { name: 'Математика (профиль)', short: 'Мат' },
  phys: { name: 'Физика', short: 'Физ' },
  inf: { name: 'Информатика', short: 'Инф' },
  chem: { name: 'Химия', short: 'Хим' },
  bio: { name: 'Биология', short: 'Био' },
  soc: { name: 'Обществознание', short: 'Общ' },
  hist: { name: 'История', short: 'Ист' },
  lit: { name: 'Литература', short: 'Лит' },
  eng: { name: 'Иностранный язык', short: 'Ин.яз' },
  geo: { name: 'География', short: 'Гео' },
} as const

export type SubjectId = keyof typeof SUBJECTS
export const SUBJECT_IDS = Object.keys(SUBJECTS) as SubjectId[]

/** Вступительный экзамен: один предмет или выбор из нескольких. */
export type Exam = SubjectId | SubjectId[]

export const DOMAINS = {
  it: {
    name: 'ИТ и данные',
    code: 'D-01',
    description: 'Искусственный интеллект, анализ данных, разработка, кибербезопасность',
  },
  eng: {
    name: 'Инженерия и технологии',
    code: 'D-02',
    description: 'Робототехника, беспилотники, микроэлектроника, космос, строительство',
  },
  bio: {
    name: 'Медицина и биотех',
    code: 'D-03',
    description: 'Генетика, фармацевтика, медтехника, персонализированная медицина',
  },
  eco: {
    name: 'Энергетика и экология',
    code: 'D-04',
    description: 'ВИЭ, атомная энергетика, климат, агротехнологии',
  },
  soc: {
    name: 'Общество и управление',
    code: 'D-05',
    description: 'Право, финансы, продукт, логистика, психология',
  },
  hum: {
    name: 'Коммуникации и язык',
    code: 'D-06',
    description: 'Лингвистика, UX, маркетинг, образование',
  },
} as const

export type DomainId = keyof typeof DOMAINS
export const DOMAIN_IDS = Object.keys(DOMAINS) as DomainId[]

export function examLabel(exams: Exam[]) {
  return exams
    .map((e) =>
      Array.isArray(e) ? e.map((s) => SUBJECTS[s].short).join(' / ') : SUBJECTS[e].short,
    )
    .join(' + ')
}

export function pluralRu(n: number, one: string, few: string, many: string) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}
