import { Button, Input, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import { createTodo, sortTodos, validateTitle, type Todo } from '../model'
import { createTodoRepository } from '../repository'
import { StateView } from '@/shared/ui/StateView'
import { toAppError } from '@/shared/observability/AppError'
import { Icon } from '@/components/Icon'
import { Cloud, Horizon } from '@/components/Decor'
import './index.scss'

const formatTime = (timestamp: number): string => {
  const d = new Date(timestamp)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  if (sameDay) return `${hh}:${mm}`
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function TodosPage() {
  const { repository, localOnly } = useMemo(createTodoRepository, [])
  const [items, setItems] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setItems(sortTodos(await repository.list()))
    } catch (cause) {
      setError(toAppError(cause).userMessage)
    } finally {
      setLoading(false)
    }
  }

  useDidShow(() => void load())

  const save = async () => {
    const invalid = validateTitle(title)
    if (invalid) {
      await Taro.showToast({ title: invalid, icon: 'none' })
      return
    }
    const todo = createTodo(title)
    setSaving(true)
    try {
      await repository.put(todo)
      setTitle('')
      setItems((old) => sortTodos([...old, todo]))
    } catch (cause) {
      await Taro.showToast({ title: toAppError(cause).userMessage, icon: 'none' })
    } finally {
      setSaving(false)
    }
  }

  const update = async (todo: Todo) => {
    const next = { ...todo, completed: !todo.completed, updatedAt: Date.now() }
    try {
      await repository.put(next)
      setItems((old) => sortTodos(old.map((x) => (x.id === next.id ? next : x))))
    } catch (cause) {
      void Taro.showToast({ title: toAppError(cause).userMessage, icon: 'none' })
    }
  }

  const remove = async (todo: Todo) => {
    const confirm = await Taro.showModal({ title: '删除待办？', content: todo.title, confirmColor: '#E85D75' })
    if (!confirm.confirm) return
    try {
      await repository.remove(todo.id)
      setItems((old) => old.filter((x) => x.id !== todo.id))
    } catch (cause) {
      void Taro.showToast({ title: toAppError(cause).userMessage, icon: 'none' })
    }
  }

  const remaining = items.filter((t) => !t.completed).length
  const done = items.length - remaining

  return (
    <View className='page todos-page'>
      {localOnly ? (
        <View className='local-banner'>
          <Text className='local-banner-dot'>●</Text>
          <Text className='local-banner-text'>当前是本机模式；配置云环境后自动启用多设备同步。</Text>
        </View>
      ) : null}

      {/* 顶部统计卡 */}
      <View className='todos-summary card'>
        <View className='todos-summary-bg'>
          <Cloud size={140} className='todos-summary-cloud todos-summary-cloud--1' />
          <Cloud size={100} className='todos-summary-cloud todos-summary-cloud--2' />
        </View>
        <View className='todos-summary-content'>
          <View className='todos-summary-left'>
            <Text className='todos-summary-num'>{remaining}</Text>
            <Text className='todos-summary-label'>{remaining === 0 ? '今日已清空' : '件待办'}</Text>
          </View>
          <View className='todos-summary-right'>
            <View className='todos-progress'>
              <View
                className='todos-progress-bar'
                style={{ width: items.length === 0 ? '0%' : `${Math.round((done / items.length) * 100)}%` }}
              />
            </View>
            <Text className='todos-progress-text'>已完成 {done} / {items.length}</Text>
          </View>
        </View>
        <View className='todos-summary-sticker'>
          <Icon name='icon-feather' size={32} className='todos-summary-feather' />
        </View>
      </View>

      {/* 输入行 */}
      <View className={`add-row card ${focused ? 'is-focused' : ''}`}>
        <View className='add-icon'>
          <Text className='add-icon-text'>＋</Text>
        </View>
        <Input
          className='todo-input'
          maxlength={120}
          value={title}
          placeholder='把今早想到的那件事记下来…'
          placeholderClass='todo-input-placeholder'
          onInput={(e) => setTitle(e.detail.value)}
          confirmType='done'
          onConfirm={save}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Button
          className='primary-button add-button'
          loading={saving}
          disabled={saving || !title.trim()}
          onClick={save}
        >
          写下
        </Button>
      </View>

      <View className='section-title'>清单</View>

      {loading ? (
        <StateView kind='loading' />
      ) : error ? (
        <StateView kind='error' message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <View className='empty card'>
          <View className='empty-icon'>
            <Text>✓</Text>
          </View>
          <Text className='empty-title'>清晨的清单很安静</Text>
          <Text className='empty-desc'>写下第一件事，晨光就开始工作了</Text>
          <View className='empty-horizon'>
            <Horizon />
          </View>
        </View>
      ) : (
        <View className='todo-list'>
          {items.map((todo) => (
            <View
              className={`todo-row card ${todo.completed ? 'is-done' : ''}`}
              key={todo.id}
              hoverClass='todo-row--hover'
            >
              <View
                className={`check ${todo.completed ? 'is-done' : ''}`}
                hoverClass='check--hover'
                onClick={() => void update(todo)}
              >
                {todo.completed ? <Text className='check-mark'>✓</Text> : null}
              </View>
              <View className='todo-body'>
                <Text className={`todo-title ${todo.completed ? 'is-done' : ''}`}>{todo.title}</Text>
                <Text className='todo-meta'>{formatTime(todo.updatedAt)}</Text>
              </View>
              <View className='todo-actions'>
                <View className='delete' hoverClass='delete--hover' onClick={() => void remove(todo)}>
                  <Text>删掉</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
