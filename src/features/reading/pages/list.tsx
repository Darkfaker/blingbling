import { Text, View } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useState } from 'react'
import { listArticles, favoriteIds } from '../repository'
import type { Article } from '../model'
import { StateView } from '@/shared/ui/StateView'
import { toAppError } from '@/shared/observability/AppError'
import './reading.scss'

export default function ReadingListPage() {
  const [items, setItems] = useState<Article[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const load = async () => { setLoading(true); setError(''); try { setItems(await listArticles()); setFavorites(favoriteIds()) } catch (cause) { setError(toAppError(cause).userMessage) } finally { setLoading(false); Taro.stopPullDownRefresh() } }
  useDidShow(() => void load())
  usePullDownRefresh(() => void load())
  const visible = onlyFavorites ? items.filter((item) => favorites.includes(item.id)) : items
  const open = (article: Article) => void Taro.navigateTo({ url: `/features/reading/pages/detail?article=${encodeURIComponent(JSON.stringify(article))}` })
  return <View className='page'>
    <View className='reading-filter'><Text className={!onlyFavorites ? 'active' : ''} onClick={() => setOnlyFavorites(false)}>全部</Text><Text className={onlyFavorites ? 'active' : ''} onClick={() => setOnlyFavorites(true)}>已收藏</Text></View>
    {loading ? <StateView kind='loading' /> : error ? <StateView kind='error' message={error} onRetry={load} /> : visible.length === 0 ? <StateView kind='empty' message={onlyFavorites ? '还没有收藏' : '暂时没有文章'} /> : <View className='article-list'>{visible.map((article) => <View className='article-card card' key={article.id} onClick={() => open(article)}><Text className='article-source'>{article.source}{favorites.includes(article.id) ? ' · ★' : ''}</Text><Text className='article-title'>{article.title}</Text><Text className='article-summary'>{article.summary || '打开查看原文链接'}</Text></View>)}</View>}
  </View>
}
