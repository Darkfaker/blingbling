import Taro from '@tarojs/taro'
import { isArticle, type Article } from './model'
import { readVersioned, taroStorage, writeVersioned } from '@/shared/platform/storage'

const SAMPLE: Article[] = [
  { id: 'welcome:1', title: '阅读模块已准备好', summary: '配置微信云环境并部署 syncReading 云函数后，这里会展示 Hacker News 的公开技术文章链接。当前示例不会发起网络请求。', url: 'https://github.com/HackerNews/API', source: 'BBL', publishedAt: null, fetchedAt: 0 },
]
const FAVORITES_KEY = 'bbl:reading:favorites:v1'
const isStringList = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string')

export async function listArticles(): Promise<Article[]> {
  if (!__CLOUD_ENV__ || !Taro.cloud) return SAMPLE
  const result = await Taro.cloud.database().collection('articles').orderBy('publishedAt', 'desc').limit(30).get()
  return result.data.map((x: any) => ({ id: x._id, title: x.title, summary: x.summary ?? '', url: x.canonicalUrl, source: x.sourceId, publishedAt: x.publishedAt == null ? null : Number(x.publishedAt), fetchedAt: Number(x.fetchedAt) })).filter(isArticle)
}

export function favoriteIds(): string[] { return readVersioned(taroStorage, FAVORITES_KEY, 1, isStringList) ?? [] }
export function setFavorite(id: string, favorite: boolean): boolean {
  const old = favoriteIds()
  return writeVersioned(taroStorage, FAVORITES_KEY, 1, favorite ? [...new Set([...old, id])] : old.filter((x) => x !== id))
}
