export type PublicationRecord = Record<string, any>

const coerceYear = (year: unknown): number | null => {
  if (typeof year === 'number' && Number.isFinite(year)) {
    return year
  }
  if (typeof year === 'string') {
    const parsed = Number.parseInt(year, 10)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return null
}

export const ensureIsoDate = (date: unknown, year: unknown): string | null => {
  if (typeof date === 'string' && date) {
    return date
  }
  const parsedYear = coerceYear(year)
  if (parsedYear) {
    return `${parsedYear}-01-01`
  }
  return null
}

export const formatPublishedLabel = (isoString: string | null): string | null => {
  if (!isoString) return null
  const parsedDate = new Date(isoString)
  if (Number.isNaN(parsedDate.getTime())) return null
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(parsedDate)
}

export const normalizePublication = (publication: PublicationRecord) => {
  const publishedDate = ensureIsoDate(publication.date, publication.year)
  return {
    ...publication,
    summary: publication.summary || publication.description || publication.excerpt || '',
    publishedDate,
    publishedLabel: formatPublishedLabel(publishedDate)
  }
}

const dateScore = (value: PublicationRecord): number => {
  if (value?.publishedDate) {
    const score = new Date(value.publishedDate).getTime()
    if (!Number.isNaN(score)) {
      return score
    }
  }
  const year = coerceYear(value?.year)
  return year ? new Date(`${year}-01-01`).getTime() : 0
}

export const sortPublications = <T extends PublicationRecord>(items: T[]): T[] => {
  return [...(items || [])].sort((a, b) => {
    const timeB = dateScore(b)
    const timeA = dateScore(a)
    if (timeB !== timeA) return timeB - timeA

    const yearB = coerceYear(b?.year) ?? 0
    const yearA = coerceYear(a?.year) ?? 0
    if (yearB !== yearA) return yearB - yearA

    const titleB = (b?.title || '').toString().toLowerCase()
    const titleA = (a?.title || '').toString().toLowerCase()
    return titleA.localeCompare(titleB)
  })
}
