import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { findTool, tools, type ToolId } from '@/features/registry'
import { readVersioned, taroStorage, writeVersioned } from '@/shared/platform/storage'
import './index.scss'

const RECENT_KEY = 'bbl:home:recent:v1'
const isRecent = (v: unknown): v is { toolId: ToolId; visitedAt: number } =>
  typeof v === 'object' && v !== null && typeof (v as any).toolId === 'string' && typeof (v as any).visitedAt === 'number'

const accentByTool: Record<ToolId, string> = {
  todos: 'linear-gradient(135deg, #FFB3C6 0%, #FF7B9C 100%)',
  pomodoro: 'linear-gradient(135deg, #FFCC80 0%, #FF8A65 100%)',
  qrcode: 'linear-gradient(135deg, #81D4FA 0%, #CE93D8 100%)',
  reading: 'linear-gradient(135deg, #A5D6A7 0%, #80CBC4 100%)',
}

const chipByTool: Record<ToolId, string> = {
  todos: '收集日常碎片，保持有序',
  pomodoro: '让番茄精灵陪你专注',
  qrcode: '把文字变成魔法阵',
  reading: '树荫下的安静阅读时光',
}


const greeting = (): string => {
  const h = new Date().getHours()
  if (h < 5) return '夜色柔柔的 ✦'
  if (h < 11) return '元气满满'
  if (h < 14) return '午后小憩时光'
  if (h < 18) return '下午好呀'
  if (h < 22) return '晚风轻轻'
  return '今夜星光很美 ✧'
}

const todayLabel = (): string => {
  const d = new Date()
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · 星期${week}`
}

export default function HomePage() {
  const [recentId, setRecentId] = useState<ToolId | undefined>()
  useDidShow(() => setRecentId(readVersioned(taroStorage, RECENT_KEY, 1, isRecent)?.toolId))
  const recent = findTool(recentId)
  const open = (tool: (typeof tools)[number]) => {
    writeVersioned(taroStorage, RECENT_KEY, 1, { toolId: tool.id, visitedAt: Date.now() })
    void Taro.navigateTo({ url: tool.route })
  }

  return (
    <View className='page home-page'>
      <View className='hero'>
        <View className='hero-top'>
          <View>
            <Text className='hero-eyebrow'>{todayLabel()}  ✦</Text>
            <Text className='hero-greeting'>{greeting()}，</Text>
            <Text className='hero-title'>今天想做什么呢？</Text>
          </View>
          <View className='hero-orb' />
        </View>
        <View className='hero-stats'>
          <View className='stat'>
            <Text className='stat-num'>{tools.length}</Text>
            <Text className='stat-label'>个小工具</Text>
          </View>
          <View className='stat-divider' />
          <View className='stat'>
            <Text className='stat-num'>{tools.filter((t) => t.availability === 'ready').length}</Text>
            <Text className='stat-label'>已开放</Text>
          </View>
          <View className='stat-divider' />
          <View className='stat'>
            <Text className='stat-num'>✨</Text>
            <Text className='stat-label'>进行中</Text>
          </View>
        </View>
      </View>

      {recent ? (
        <>
          <View className='section-title'>刚刚用过的</View>
          <View
            className='recent-card card'
            style={{ background: accentByTool[recent.id] }}
            onClick={() => open(recent as any)}
          >
            <View className='recent-icon'>
              <Text>{recent.icon}</Text>
            </View>
            <View className='recent-body'>
              <Text className='recent-title'>{recent.title}</Text>
              <Text className='recent-desc'>{chipByTool[recent.id]}</Text>
            </View>
            <View className='recent-cta'>
              <Text className='recent-cta-text'>进入</Text>
              <Text className='recent-cta-arrow'>→</Text>
            </View>
          </View>
        </>
      ) : null}

      <View className='section-title'>我的工具箱</View>
      <View className='grid'>
        {tools.map((tool) => (
          <View
            className='tool-card card'
            key={tool.id}
            hoverClass='tool-card--hover'
            onClick={() => open(tool)}
          >
            <View className='tool-icon' style={{ background: accentByTool[tool.id] }}>
              <Text>{tool.icon}</Text>
            </View>
            <View className='tool-meta'>
              <View className='tool-headline'>
                <Text className='tool-title'>{tool.title}</Text>
                {tool.availability === 'beta' ? <Text className='tool-badge'>Beta</Text> : null}
              </View>
              <Text className='tool-description'>{tool.description}</Text>
            </View>
            <View className='tool-arrow'>›</View>
          </View>
        ))}
      </View>

      <View className='footer'>
        <View className='footer-pill' onClick={() => void Taro.navigateTo({ url: '/pages/settings/index' })}>
          <Text className='footer-pill-icon'>🌸</Text>
          <Text className='footer-pill-text'>设置与隐私</Text>
        </View>
        <Text className='footer-version'>v0.1.0 · komorebi 体验版</Text>
      </View>
    </View>
  )
}

