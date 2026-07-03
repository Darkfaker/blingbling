import { Button, Picker, Text, View } from '@tarojs/components'
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import { useEffect, useReducer, useRef, useState } from 'react'
import { defaultPomodoroState, isPomodoroState, pomodoroReducer, remainingMs } from '../model'
import { readVersioned, taroStorage, writeVersioned } from '@/shared/platform/storage'
import './index.scss'

const KEY = 'bbl:pomodoro:state:v1'
const durations = [1, 5, 15, 25, 30, 45, 60]

export default function PomodoroPage() {
  const stored = readVersioned(taroStorage, KEY, 1, isPomodoroState)
  const [state, dispatch] = useReducer(pomodoroReducer, stored ?? defaultPomodoroState())
  const [now, setNow] = useState(() => Date.now())
  const notifiedAt = useRef<number | null>(state.completedAt)
  const refresh = () => { const time = Date.now(); setNow(time); dispatch({ type: 'tick', now: time }) }
  useDidShow(refresh)
  useDidHide(() => writeVersioned(taroStorage, KEY, 1, state))
  useEffect(() => { const id = setInterval(refresh, 500); return () => clearInterval(id) }, [])
  useEffect(() => { writeVersioned(taroStorage, KEY, 1, state) }, [state])
  useEffect(() => {
    if (state.status === 'completed' && state.completedAt !== notifiedAt.current) {
      notifiedAt.current = state.completedAt
      void Taro.vibrateLong().catch(() => undefined)
      void Taro.showToast({ title: state.phase === 'focus' ? '专注完成' : '休息完成', icon: 'success' })
    }
  }, [state])
  const remaining = remainingMs(state, now)
  const minutes = Math.floor(remaining / 60_000).toString().padStart(2, '0')
  const seconds = Math.floor((remaining % 60_000) / 1000).toString().padStart(2, '0')
  const durationIndex = Math.max(0, durations.indexOf(Math.round(state.durationMs / 60_000)))
  return <View className='page pomodoro-page'>
    <Text className='phase'>{state.phase === 'focus' ? '专注' : '休息'}</Text>
    <Text className='timer'>{minutes}:{seconds}</Text>
    {state.status === 'idle' ? <Picker mode='selector' range={durations.map((x) => `${x} 分钟`)} value={durationIndex} onChange={(e) => dispatch({ type: 'setDuration', durationMs: durations[Number(e.detail.value)]! * 60_000 })}><View className='duration-picker'>选择时长 · 当前 {state.durationMs / 60_000} 分钟</View></Picker> : null}
    <View className='actions'>
      {state.status === 'idle' ? <Button className='primary-button' onClick={() => dispatch({ type: 'start', now: Date.now() })}>开始专注</Button> : null}
      {state.status === 'running' ? <Button className='secondary-button' onClick={() => dispatch({ type: 'pause', now: Date.now() })}>暂停</Button> : null}
      {state.status === 'paused' ? <Button className='primary-button' onClick={() => dispatch({ type: 'resume', now: Date.now() })}>继续</Button> : null}
      {state.status === 'completed' ? <Button className='primary-button' onClick={() => dispatch({ type: 'next', now: Date.now(), durationMs: state.phase === 'focus' ? 5 * 60_000 : 25 * 60_000 })}>开始{state.phase === 'focus' ? '休息' : '专注'}</Button> : null}
      {state.status !== 'idle' ? <Button className='danger-button' onClick={() => dispatch({ type: 'reset' })}>重置</Button> : null}
    </View>
    <Text className='hint'>退到后台也没关系，回来会按真实时间恢复。</Text>
  </View>
}
