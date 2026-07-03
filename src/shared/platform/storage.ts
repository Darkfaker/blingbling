import Taro from '@tarojs/taro'
import type { StorageDriver } from './versioned-storage'

export { readVersioned, writeVersioned } from './versioned-storage'

export const taroStorage: StorageDriver = {
  get: (key) => Taro.getStorageSync(key),
  set: (key, value) => Taro.setStorageSync(key, value),
  remove: (key) => Taro.removeStorageSync(key),
}
