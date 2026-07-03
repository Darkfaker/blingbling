export interface Article {
  id: string
  title: string
  summary: string
  url: string
  source: string
  publishedAt: number | null
  fetchedAt: number
}

export function isSafeArticleUrl(value: string): boolean {
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:' } catch { return false }
}

export function isArticle(value: unknown): value is Article {
  if (!value || typeof value !== 'object') return false
  const v = value as Article
  return typeof v.id === 'string' && typeof v.title === 'string' && typeof v.summary === 'string' && typeof v.source === 'string' && isSafeArticleUrl(v.url) && (v.publishedAt === null || Number.isFinite(v.publishedAt)) && Number.isFinite(v.fetchedAt)
}

export function articleId(source: string, externalId: string | number): string {
  return `${source}:${String(externalId).replace(/[^a-zA-Z0-9_-]/g, '-')}`
}
