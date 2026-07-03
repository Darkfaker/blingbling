import { Button, Input, Text, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useMemo, useState } from 'react'
import { createTodo, sortTodos, validateTitle, type Todo } from '../model'
import { createTodoRepository } from '../repository'
import { StateView } from '@/shared/ui/StateView'
import { toAppError } from '@/shared/observability/AppError'
import './index.scss'

export default function TodosPage() {
  const { repository, localOnly } = useMemo(createTodoRepository, [])
  const [items, setItems] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const load = async () => { setLoading(true); setError(''); try { setItems(sortTodos(await repository.list())) } catch (cause) { setError(toAppError(cause).userMessage) } finally { setLoading(false) } }
  useDidShow(() => void load())
  const save = async () => {
    const invalid = validateTitle(title); if (invalid) { await Taro.showToast({ title: invalid, icon: 'none' }); return }
    const todo = createTodo(title); setSaving(true)
    try { await repository.put(todo); setTitle(''); setItems((old) => sortTodos([...old, todo])) } catch (cause) { await Taro.showToast({ title: toAppError(cause).userMessage, icon: 'none' }) } finally { setSaving(false) }
  }
  const update = async (todo: Todo) => { const next = { ...todo, completed: !todo.completed, updatedAt: Date.now() }; try { await repository.put(next); setItems((old) => sortTodos(old.map((x) => x.id === next.id ? next : x))) } catch (cause) { void Taro.showToast({ title: toAppError(cause).userMessage, icon: 'none' }) } }
  const remove = async (todo: Todo) => {
    const confirm = await Taro.showModal({ title: '删除待办？', content: todo.title, confirmColor: '#d64545' }); if (!confirm.confirm) return
    try { await repository.remove(todo.id); setItems((old) => old.filter((x) => x.id !== todo.id)) } catch (cause) { void Taro.showToast({ title: toAppError(cause).userMessage, icon: 'none' }) }
  }
  return <View className='page'>
    {localOnly ? <View className='local-banner'>当前是本机模式；配置云环境后自动启用多设备同步。</View> : null}
    <View className='add-row card'><Input className='todo-input' maxlength={120} value={title} placeholder='记下一件事' onInput={(e) => setTitle(e.detail.value)} confirmType='done' onConfirm={save} /><Button className='primary-button add-button' loading={saving} disabled={saving} onClick={save}>添加</Button></View>
    <View className='section-title'>清单</View>
    {loading ? <StateView kind='loading' /> : error ? <StateView kind='error' message={error} onRetry={load} /> : items.length === 0 ? <StateView kind='empty' message='还没有待办，轻松开局。' /> : <View className='todo-list'>{items.map((todo) => <View className='todo-row card' key={todo.id}><View className={todo.completed ? 'check done' : 'check'} onClick={() => void update(todo)}>{todo.completed ? '✓' : ''}</View><Text className={todo.completed ? 'todo-title completed' : 'todo-title'} onClick={() => void update(todo)}>{todo.title}</Text><Text className='delete' onClick={() => void remove(todo)}>删除</Text></View>)}</View>}
  </View>
}
