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
  todos: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)',
  pomodoro: 'linear-gradient(135deg, #fb923c 0%, #f43f5e 100%)',
  qrcode: 'linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)',
  reading: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
}

const chipByTool: Record<ToolId, string> = {
  todos: '记下并完成重要小事',
  pomodoro: '专注一段完整时间',
  qrcode: '把文本变成二维码',
  reading: '稍后安静读一点东西',
}


const greeting = (): string => {
  const h = new Date().getHours()
  if (h < 5) return '夜深了'
  if (h < 11) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  if (h < 22) return '晚上好'
  return '夜深了'
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
            <Text className='hero-eyebrow'>{todayLabel()}</Text>
            <Text className='hero-greeting'>{greeting()}，</Text>
            <Text className='hero-title'>今天，要做点什么？</Text>
          </View>
          <View className='hero-orb' />
        </View>
        <View className='hero-stats'>
          <View className='stat'>
            <Text className='stat-num'>{tools.length}</Text>
            <Text className='stat-label'>个工具</Text>
          </View>
          <View className='stat-divider' />
          <View className='stat'>
            <Text className='stat-num'>{tools.filter((t) => t.availability === 'ready').length}</Text>
            <Text className='stat-label'>已就绪</Text>
          </View>
          <View className='stat-divider' />
          <View className='stat'>
            <Text className='stat-num'>0</Text>
            <Text className='stat-label'>同步中</Text>
          </View>
        </View>
      </View>

      {recent ? (
        <>
          <View className='section-title'>继续使用</View>
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
              <Text className='recent-cta-text'>打开</Text>
              <Text className='recent-cta-arrow'>→</Text>
            </View>
          </View>
        </>
      ) : null}

      <View className='section-title'>全部工具</View>
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
          <Text className='footer-pill-icon'>⚙</Text>
          <Text className='footer-pill-text'>设置与隐私</Text>
        </View>
        <Text className='footer-version'>v0.1.0 · 体验版</Text>
      </View>
    </View>
  )
}
