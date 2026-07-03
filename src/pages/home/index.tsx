import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { findTool, tools, type ToolId } from '@/features/registry'
import { readVersioned, taroStorage, writeVersioned } from '@/shared/platform/storage'
import { Icon, type IconName } from '@/components/Icon'
import { Avatar, Cloud, DistantMountains, PaperPlane, SakuraPetal } from '@/components/Decor'
import './index.scss'

const RECENT_KEY = 'bbl:home:recent:v1'
const isRecent = (v: unknown): v is { toolId: ToolId; visitedAt: number } =>
  typeof v === 'object' && v !== null && typeof (v as any).toolId === 'string' && typeof (v as any).visitedAt === 'number'

const toolGradient: Record<ToolId, string> = {
  todos: 'linear-gradient(135deg, #FFD8A8 0%, #FF8E72 100%)',
  pomodoro: 'linear-gradient(135deg, #FFB5C8 0%, #E85D75 100%)',
  qrcode: 'linear-gradient(135deg, #B5E8EE 0%, #6FCFD5 100%)',
  reading: 'linear-gradient(135deg, #D4BFF0 0%, #9F7BD3 100%)',
}

const toolStickerText: Record<ToolId, string> = {
  todos: '晨光清单',
  pomodoro: '专注时刻',
  qrcode: '清晰通道',
  reading: '远山黄昏',
}

const greetingByPhase = {
  morning: '早安，世界在等你',
  noon: '正午阳光正好',
  dusk: '黄昏的天空很美',
  night: '晚安，月光还在',
} as const

const todayLabel = (): string => {
  const d = new Date()
  const week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()]
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · 星期${week}`
}

const phaseOf = (h: number): 'morning' | 'noon' | 'dusk' | 'night' => {
  if (h >= 5 && h < 11) return 'morning'
  if (h >= 11 && h < 14) return 'noon'
  if (h >= 14 && h < 18) return 'dusk'
  return 'night'
}

export default function HomePage() {
  const [recentId, setRecentId] = useState<ToolId | undefined>()
  const [phase, setPhase] = useState<'morning' | 'noon' | 'dusk' | 'night'>(phaseOf(new Date().getHours()))

  useDidShow(() => {
    setRecentId(readVersioned(taroStorage, RECENT_KEY, 1, isRecent)?.toolId)
    setPhase(phaseOf(new Date().getHours()))
  })

  const recent = findTool(recentId)
  const open = (tool: (typeof tools)[number]) => {
    writeVersioned(taroStorage, RECENT_KEY, 1, { toolId: tool.id, visitedAt: Date.now() })
    void Taro.navigateTo({ url: tool.route })
  }

  return (
    <View className='page home-page' data-phase={phase}>
      {/* HERO */}
      <View className='hero'>
        <View className='hero-clouds'>
          <Cloud size={120} className='hero-cloud hero-cloud--a' />
          <Cloud size={80}  className='hero-cloud hero-cloud--b' />
        </View>

        <View className='hero-top'>
          <View className='hero-text'>
            <View className='hero-eyebrow'>
              <Text className='hero-eyebrow-dot'>●</Text>
              <Text className='hero-eyebrow-text'>{todayLabel()}</Text>
            </View>
            <Text className='hero-title'>{greetingByPhase[phase]}</Text>
            <Text className='hero-sub'>在天空下，慢慢做事</Text>
          </View>
          <View className='hero-avatar'>
            <Avatar size={160} />
            <View className='hero-avatar-ring' />
          </View>
        </View>

        {/* 飘动樱花瓣 */}
        <SakuraPetal size={36} className='hero-sakura hero-sakura--1' />
        <SakuraPetal size={28} className='hero-sakura hero-sakura--2' />
        <PaperPlane size={56} className='hero-plane' />

        <View className='hero-mountains'>
          <DistantMountains />
        </View>
      </View>

      {/* 继续使用 */}
      {recent ? (
        <>
          <View className='section-title'>继续使用</View>
          <View
            className='recent-card card'
            style={{ background: toolGradient[recent.id] }}
            hoverClass='recent-card--hover'
            onClick={() => open(recent as any)}
          >
            <View className='recent-icon'>
              <Icon name={recent.icon as IconName} size={64} />
            </View>
            <View className='recent-body'>
              <View className='recent-sticker'>{toolStickerText[recent.id]}</View>
              <Text className='recent-title'>{recent.title}</Text>
              <Text className='recent-desc'>{recent.description}</Text>
            </View>
            <View className='recent-cta'>
              <Text className='recent-cta-text'>进入</Text>
              <Text className='recent-cta-arrow'>→</Text>
            </View>
          </View>
        </>
      ) : null}

      {/* 我的工具箱 */}
      <View className='section-title'>我的工具箱</View>
      <View className='grid'>
        {tools.map((tool) => (
          <View
            className='tool-card card'
            key={tool.id}
            hoverClass='tool-card--hover'
            onClick={() => open(tool)}
          >
            <View className='tool-icon' style={{ background: toolGradient[tool.id] }}>
              <Icon name={tool.icon as IconName} size={64} />
            </View>
            <View className='tool-meta'>
              <View className='tool-headline'>
                <Text className='tool-title'>{tool.title}</Text>
                {tool.availability === 'beta' ? <Text className='tool-badge'>Beta</Text> : null}
              </View>
              <Text className='tool-description'>{tool.description}</Text>
            </View>
            <View className='tool-sticker'>{toolStickerText[tool.id]}</View>
          </View>
        ))}
      </View>

      {/* 页脚 */}
      <View className='footer'>
        <View className='footer-pill' onClick={() => void Taro.navigateTo({ url: '/pages/settings/index' })}>
          <Text className='footer-pill-text'>设置与隐私</Text>
          <Text className='footer-pill-arrow'>→</Text>
        </View>
        <Text className='footer-version'>Komorebi v0.1.0</Text>
      </View>
    </View>
  )
}
