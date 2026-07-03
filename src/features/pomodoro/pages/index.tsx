import { Button, Picker, Text, View } from '@tarojs/components'
import Taro, { useDidShow, useDidHide } from '@tarojs/taro'
import { useEffect, useReducer, useRef, useState } from 'react'
import { defaultPomodoroState, isPomodoroState, pomodoroReducer, remainingMs } from '../model'
import { readVersioned, taroStorage, writeVersioned } from '@/shared/platform/storage'
import { Icon } from '@/components/Icon'
import './index.scss'

const KEY = 'bbl:pomodoro:state:v1'
const durations = [1, 5, 15, 25, 30, 45, 60]

const phaseLabel: Record<'focus' | 'break', string> = {
  focus: '专注时刻',
  break: '休息时光',
}
const phaseHint: Record<'focus' | 'break', string> = {
  focus: '屏蔽干扰，一次只做一件事',
  break: '离开屏幕，让眼睛和大脑放空',
}

export default function PomodoroPage() {
  const stored = readVersioned(taroStorage, KEY, 1, isPomodoroState)
  const [state, dispatch] = useReducer(pomodoroReducer, stored ?? defaultPomodoroState())
  const [now, setNow] = useState(() => Date.now())
  const notifiedAt = useRef<number | null>(state.completedAt)

  const refresh = () => {
    const time = Date.now()
    setNow(time)
    dispatch({ type: 'tick', now: time })
  }

  useDidShow(refresh)
  useDidHide(() => writeVersioned(taroStorage, KEY, 1, state))
  useEffect(() => {
    const id = setInterval(refresh, 500)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    writeVersioned(taroStorage, KEY, 1, state)
  }, [state])
  useEffect(() => {
    if (state.status === 'completed' && state.completedAt !== notifiedAt.current) {
      notifiedAt.current = state.completedAt
      void Taro.vibrateLong().catch(() => undefined)
      void Taro.showToast({
        title: state.phase === 'focus' ? '专注完成' : '休息结束',
        icon: 'success',
      })
    }
  }, [state])

  const remaining = remainingMs(state, now)
  const totalMs = state.durationMs || 1
  const progress = Math.min(1, Math.max(0, 1 - remaining / totalMs))
  const minutes = Math.floor(remaining / 60_000).toString().padStart(2, '0')
  const seconds = Math.floor((remaining % 60_000) / 1000).toString().padStart(2, '0')
  const durationIndex = Math.max(0, durations.indexOf(Math.round(state.durationMs / 60_000)))

  const statusBadge = (() => {
    if (state.status === 'running') return { text: '进行中', kind: 'running' }
    if (state.status === 'paused') return { text: '已暂停', kind: 'paused' }
    if (state.status === 'completed') return { text: '本轮结束', kind: 'completed' }
    return { text: '准备开始', kind: 'idle' }
  })()

  const pageClass = `page pomodoro-page phase-${state.phase} status-${state.status}`

  return (
    <View className={pageClass}>
      <View className='pomodoro-topline'>
        <View className={`status-pill status-pill--${statusBadge.kind}`}>
          <Text className='status-dot'>●</Text>
          <Text>{statusBadge.text}</Text>
        </View>
      </View>

      <View className='pomodoro-phase'>
        <View className='phase-icon'>
          <Icon name={state.phase === 'focus' ? 'icon-tomato' : 'icon-leaf'} size={56} />
        </View>
        <Text className='phase-label'>{phaseLabel[state.phase]}</Text>
        <Text className='phase-hint'>{phaseHint[state.phase]}</Text>
      </View>

      <View
        className='ring'
        style={{
          background: `conic-gradient(var(--ring) ${progress * 360}deg, var(--ring-track) 0)`,
        }}
      >
        <View className='ring-inner'>
          <Text className='timer'>{minutes}</Text>
          <Text className='timer-sep'>:</Text>
          <Text className='timer'>{seconds}</Text>
          <Text className='timer-sub'>本轮 {state.durationMs / 60_000} 分钟</Text>
        </View>
      </View>

      {state.status === 'idle' ? (
        <View className='duration-row card'>
          <Text className='duration-label'>选择时长</Text>
          <Picker
            mode='selector'
            range={durations.map((x) => `${x} 分钟`)}
            value={durationIndex}
            onChange={(e) => dispatch({ type: 'setDuration', durationMs: durations[Number(e.detail.value)]! * 60_000 })}
          >
            <View className='duration-picker'>
              <Text className='duration-value'>{state.durationMs / 60_000}</Text>
              <Text className='duration-unit'>分钟</Text>
              <Text className='duration-arrow'>▾</Text>
            </View>
          </Picker>
        </View>
      ) : null}

      <View className='actions'>
        {state.status === 'idle' ? (
          <Button className='primary-button' hoverClass='action--hover' onClick={() => dispatch({ type: 'start', now: Date.now() })}>
            开始专注
          </Button>
        ) : null}
        {state.status === 'running' ? (
          <Button className='secondary-button' hoverClass='action--hover' onClick={() => dispatch({ type: 'pause', now: Date.now() })}>
            暂停
          </Button>
        ) : null}
        {state.status === 'paused' ? (
          <Button className='primary-button' hoverClass='action--hover' onClick={() => dispatch({ type: 'resume', now: Date.now() })}>
            继续专注
          </Button>
        ) : null}
        {state.status === 'completed' ? (
          <Button
            className='primary-button'
            hoverClass='action--hover'
            onClick={() =>
              dispatch({ type: 'next', now: Date.now(), durationMs: state.phase === 'focus' ? 5 * 60_000 : 25 * 60_000 })
            }
          >
            开始{state.phase === 'focus' ? '休息' : '专注'}
          </Button>
        ) : null}
        {state.status !== 'idle' ? (
          <Button className='danger-button' hoverClass='action--hover' onClick={() => dispatch({ type: 'reset' })}>
            重置
          </Button>
        ) : null}
      </View>

      <View className='hint-row'>
        <Text className='hint-dot'>·</Text>
        <Text className='hint'>退到后台也没关系，回来会按真实时间恢复。</Text>
      </View>
    </View>
  )
}
