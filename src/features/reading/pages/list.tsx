import { Text, View } from '@tarojs/components'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { useState } from 'react'
import { listArticles, favoriteIds } from '../repository'
import type { Article } from '../model'
import { StateView } from '@/shared/ui/StateView'
import { toAppError } from '@/shared/observability/AppError'
import './reading.scss'

const accentBySource = (source: string): string => {
  const map: Record<string, string> = {
    HackerNews: 'linear-gradient(135deg, #FFCC80 0%, #FF8A65 100%)',
    GitHub: 'linear-gradient(135deg, #6B5040 0%, #B8A088 100%)',
    Apple: 'linear-gradient(135deg, #81D4FA 0%, #CE93D8 100%)',
    Example: 'linear-gradient(135deg, #FFB3C6 0%, #FF7B9C 100%)',
  }
  return map[source] ?? 'linear-gradient(135deg, #FFB3C6 0%, #FF7B9C 100%)'
}

const sourceInitial = (source: string): string => {
  const trimmed = source.replace(/[^A-Za-z一-龥]/g, '')
  if (!trimmed) return '📖'
  return trimmed[0]!.toUpperCase()
}

export default function ReadingListPage() {
  const [items, setItems] = useState<Article[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(await listArticles())
      setFavorites(favoriteIds())
    } catch (cause) {
      setError(toAppError(cause).userMessage)
    } finally {
      setLoading(false)
      Taro.stopPullDownRefresh()
    }
  }

  useDidShow(() => void load())
  usePullDownRefresh(() => void load())

  const visible = onlyFavorites ? items.filter((item) => favorites.includes(item.id)) : items

  const open = (article: Article) =>
    void Taro.navigateTo({
      url: `/features/reading/pages/detail?article=${encodeURIComponent(JSON.stringify(article))}`,
    })

  return (
    <View className='page reading-page'>
      <View className='reading-hero card'>
        <View className='reading-hero-top'>
          <View>
            <Text className='reading-eyebrow'>每日精选</Text>
            <Text className='reading-title'>树荫下的阅读 ✦</Text>
            <Text className='reading-sub'>技术、设计与思考</Text>
          </View>
          <View className='reading-hero-icon'>📖</View>
        </View>
      </View>

      <View className='reading-filter'>
        <View
          className={`reading-chip ${!onlyFavorites ? 'is-active' : ''}`}
          hoverClass='reading-chip--hover'
          hoverStayTime={50}
          onClick={() => setOnlyFavorites(false)}
        >
          <Text>全部</Text>
          <Text className='reading-chip-count'>{items.length}</Text>
        </View>
        <View
          className={`reading-chip ${onlyFavorites ? 'is-active' : ''}`}
          hoverClass='reading-chip--hover'
          hoverStayTime={50}
          onClick={() => setOnlyFavorites(true)}
        >
          <Text>已收藏</Text>
          <Text className='reading-chip-count'>{favorites.length}</Text>
        </View>
      </View>

      {loading ? (
        <StateView kind='loading' />
      ) : error ? (
        <StateView kind='error' message={error} onRetry={load} />
      ) : visible.length === 0 ? (
        <View className='empty card'>
          <Text className='empty-icon'>📚</Text>
          <Text className='empty-title'>{onlyFavorites ? '还没有收藏' : '暂时没有文章'}</Text>
          <Text className='empty-desc'>{onlyFavorites ? '在详情页点击收藏，把喜欢的内容留下。' : '下拉刷新，或稍后再来看看。'}</Text>
        </View>
      ) : (
        <View className='article-list'>
          {visible.map((article) => {
            const isFav = favorites.includes(article.id)
            return (
              <View
                className='article-card card'
                key={article.id}
                hoverClass='article-card--hover'
                onClick={() => open(article)}
              >
                <View className='article-source-row'>
                  <View className='article-source-chip' style={{ background: accentBySource(article.source) }}>
                    <Text>{sourceInitial(article.source)}</Text>
                  </View>
                  <Text className='article-source'>{article.source}</Text>
                  {isFav ? <Text className='article-fav'>⭐ 已收藏</Text> : <View className='article-fav-spacer' />}
                </View>
                <Text className='article-title'>{article.title}</Text>
                <Text className='article-summary'>{article.summary || '打开查看原文链接'}</Text>
                <View className='article-foot'>
                  <Text className='article-foot-link'>阅读原文</Text>
                  <Text className='article-foot-arrow'>→</Text>
                </View>
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

