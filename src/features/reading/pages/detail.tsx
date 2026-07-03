import { Button, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { isArticle, type Article } from '../model'
import { favoriteIds, setFavorite } from '../repository'
import { StateView } from '@/shared/ui/StateView'
import './reading.scss'

export default function ReadingDetailPage() {
  const [article, setArticle] = useState<Article>()
  const [invalid, setInvalid] = useState(false)
  const [favorite, setFavoriteState] = useState(false)
  useLoad(({ article: raw }) => {
    try { const parsed: unknown = JSON.parse(decodeURIComponent(raw ?? '')); if (!isArticle(parsed)) throw new Error('invalid'); setArticle(parsed); setFavoriteState(favoriteIds().includes(parsed.id)) } catch { setInvalid(true) }
  })
  if (invalid) return <View className='page'><StateView kind='error' message='这篇内容已经失效' /></View>
  if (!article) return <View className='page'><StateView kind='loading' /></View>
  const toggle = () => { const next = !favorite; if (setFavorite(article.id, next)) setFavoriteState(next) }
  return <View className='page'><View className='card detail-card'><Text className='article-source'>{article.source}</Text><Text className='detail-title'>{article.title}</Text><Text className='detail-summary'>{article.summary || '该来源没有提供摘要。'}</Text><Text className='muted detail-note'>为避免未经许可转载正文，BBL 只保存标题、链接和简短摘要。</Text></View><Button className='primary-button' onClick={() => void Taro.setClipboardData({ data: article.url })}>复制原文链接</Button><Button className='secondary-button' onClick={toggle}>{favorite ? '取消收藏' : '收藏'}</Button></View>
}
