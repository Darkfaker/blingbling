import { Button, Text, View } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import { isArticle, type Article } from '../model'
import { favoriteIds, setFavorite } from '../repository'
import { StateView } from '@/shared/ui/StateView'
import './reading.scss'

const accentBySource = (source: string): string => {
  const map: Record<string, string> = {
    HackerNews: 'linear-gradient(135deg, #fb923c 0%, #f43f5e 100%)',
    GitHub: 'linear-gradient(135deg, #1f2937 0%, #475569 100%)',
    Apple: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
    Example: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
  }
  return map[source] ?? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
}

const sourceInitial = (source: string): string => {
  const trimmed = source.replace(/[^A-Za-z一-龥]/g, '')
  if (!trimmed) return '文'
  return trimmed[0]!.toUpperCase()
}

export default function ReadingDetailPage() {
  const [article, setArticle] = useState<Article>()
  const [invalid, setInvalid] = useState(false)
  const [favorite, setFavoriteState] = useState(false)

  useLoad(({ article: raw }) => {
    try {
      const parsed: unknown = JSON.parse(decodeURIComponent(raw ?? ''))
      if (!isArticle(parsed)) throw new Error('invalid')
      setArticle(parsed)
      setFavoriteState(favoriteIds().includes(parsed.id))
    } catch {
      setInvalid(true)
    }
  })

  if (invalid)
    return (
      <View className='page'>
        <StateView kind='error' message='这篇内容已经失效' />
      </View>
    )

  if (!article)
    return (
      <View className='page'>
        <StateView kind='loading' />
      </View>
    )

  const toggle = () => {
    const next = !favorite
    if (setFavorite(article.id, next)) setFavoriteState(next)
  }

  return (
    <View className='page reading-detail-page'>
      <View className='detail-hero card'>
        <View className='detail-source-row'>
          <View className='detail-source-chip' style={{ background: accentBySource(article.source) }}>
            <Text>{sourceInitial(article.source)}</Text>
          </View>
          <Text className='detail-source-name'>{article.source}</Text>
        </View>
        <Text className='detail-title'>{article.title}</Text>
        {article.summary ? <Text className='detail-summary'>{article.summary}</Text> : <Text className='detail-summary muted'>该来源没有提供摘要。</Text>}
        <View className='detail-note-row'>
          <Text className='detail-note-icon'>i</Text>
          <Text className='detail-note'>为避免未经许可转载正文，BBL 只保存标题、链接和简短摘要。</Text>
        </View>
      </View>

      <View className='detail-actions'>
        <Button
          className='primary-button'
          hoverClass='action--hover'
          onClick={() => void Taro.setClipboardData({ data: article.url })}
        >
          <Text className='action-icon'>⎘</Text>
          <Text>复制原文链接</Text>
        </Button>
        <Button
          className={favorite ? 'danger-button' : 'secondary-button'}
          hoverClass='action--hover'
          onClick={toggle}
        >
          <Text className='action-icon'>{favorite ? '★' : '☆'}</Text>
          <Text>{favorite ? '取消收藏' : '收藏'}</Text>
        </Button>
      </View>
    </View>
  )
}
