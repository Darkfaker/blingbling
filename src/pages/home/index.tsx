import { Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import { findTool, tools, type ToolId } from '@/features/registry'
import { readVersioned, taroStorage, writeVersioned } from '@/shared/platform/storage'
import './index.scss'

const RECENT_KEY = 'bbl:home:recent:v1'
const isRecent = (v: unknown): v is { toolId: ToolId; visitedAt: number } => typeof v === 'object' && v !== null && typeof (v as any).toolId === 'string' && typeof (v as any).visitedAt === 'number'

export default function HomePage() {
  const [recentId, setRecentId] = useState<ToolId | undefined>()
  useDidShow(() => setRecentId(readVersioned(taroStorage, RECENT_KEY, 1, isRecent)?.toolId))
  const recent = findTool(recentId)
  const open = (tool: (typeof tools)[number]) => {
    writeVersioned(taroStorage, RECENT_KEY, 1, { toolId: tool.id, visitedAt: Date.now() })
    void Taro.navigateTo({ url: tool.route })
  }
  return <View className='page'>
    <View className='hero'><Text className='eyebrow'>PERSONAL TOOLBOX</Text><Text className='title'>今天，需要什么？</Text><Text className='muted'>小工具，少一点绕路。</Text></View>
    {recent ? <><View className='section-title'>继续使用</View><View className='recent card' onClick={() => open(recent as any)}><Text className='recent-icon'>{recent.icon}</Text><View><Text className='tool-title'>{recent.title}</Text><Text className='tool-description'>{recent.description}</Text></View></View></> : null}
    <View className='section-title'>全部工具</View>
    <View className='grid'>{tools.map((tool) => <View className='tool-card card' key={tool.id} onClick={() => open(tool)}><Text className='tool-icon'>{tool.icon}</Text><Text className='tool-title'>{tool.title}{tool.availability === 'beta' ? ' · Beta' : ''}</Text><Text className='tool-description'>{tool.description}</Text></View>)}</View>
    <View className='settings-link' onClick={() => void Taro.navigateTo({ url: '/pages/settings/index' })}>设置与隐私</View>
  </View>
}
