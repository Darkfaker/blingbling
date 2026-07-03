import Taro from '@tarojs/taro'
import { isTodo, isTodoList, type Todo } from './model'
import { readVersioned, taroStorage, writeVersioned } from '@/shared/platform/storage'

export interface TodoRepository {
  list(): Promise<Todo[]>
  put(todo: Todo): Promise<void>
  remove(id: string): Promise<void>
}

const LOCAL_KEY = 'bbl:todos:local:v1'
export class LocalTodoRepository implements TodoRepository {
  async list() { return readVersioned(taroStorage, LOCAL_KEY, 1, isTodoList) ?? [] }
  async put(todo: Todo) { const items = await this.list(); const next = [...items.filter((x) => x.id !== todo.id), todo]; if (!writeVersioned(taroStorage, LOCAL_KEY, 1, next)) throw new Error('storage failed') }
  async remove(id: string) { if (!writeVersioned(taroStorage, LOCAL_KEY, 1, (await this.list()).filter((x) => x.id !== id))) throw new Error('storage failed') }
}

export class CloudTodoRepository implements TodoRepository {
  private collection() { return Taro.cloud.database().collection('todos') }
  async list(): Promise<Todo[]> {
    const result = await this.collection().orderBy('updatedAt', 'desc').get()
    return result.data.map((item: any) => ({ id: item._id, title: item.title, completed: item.completed, createdAt: Number(item.createdAt), updatedAt: Number(item.updatedAt) })).filter(isTodo)
  }
  async put(todo: Todo): Promise<void> {
    await this.collection().doc(todo.id).set({ data: { title: todo.title, completed: todo.completed, createdAt: todo.createdAt, updatedAt: todo.updatedAt, schemaVersion: 1 } })
  }
  async remove(id: string): Promise<void> { await this.collection().doc(id).remove({}) }
}

export function createTodoRepository(): { repository: TodoRepository; localOnly: boolean } {
  const localOnly = !__CLOUD_ENV__ || !Taro.cloud
  return { repository: localOnly ? new LocalTodoRepository() : new CloudTodoRepository(), localOnly }
}
