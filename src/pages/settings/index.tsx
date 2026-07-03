import { Button, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

import './index.scss'
export default function SettingsPage() {
  const clear = () => {
    for (const key of Taro.getStorageInfoSync().keys) if (key.startsWith('bbl:')) Taro.removeStorageSync(key)
    void Taro.showToast({ title: '本地缓存已清理', icon: 'success' })
  }

  return (
    <View className='page settings-page'>
      <View className='settings-hero card'>
        <View className='settings-hero-icon'>🌸</View>
        <View className='settings-hero-text'>
          <Text className='settings-hero-title'>设置与隐私</Text>
          <Text className='settings-hero-sub'>小而透明：默认不收集额外信息。</Text>
        </View>
      </View>

      <View className='section-title'>数据与隐私</View>
      <View className='card settings-card'>
        <View className='settings-row'>
          <View className='settings-bullet' />
          <Text className='settings-row-text'>番茄钟、二维码内容只保存在本机。</Text>
        </View>
        <View className='settings-row'>
          <View className='settings-bullet' />
          <Text className='settings-row-text'>待办使用你的微信云身份隔离，不读取昵称或头像。</Text>
        </View>
        <View className='settings-row'>
          <View className='settings-bullet' />
          <Text className='settings-row-text'>诊断日志不记录待办、二维码或文章正文。</Text>
        </View>
      </View>

      <View className='section-title'>本地数据</View>
      <Button className='danger-button' hoverClass='action--hover' onClick={clear}>
        清理本地缓存
      </Button>

      <View className='section-title'>版本</View>
      <View className='card settings-version-card'>
        <View>
          <Text className='settings-version-name'>Komorebi 🌸</Text>
          <Text className='settings-version-tag'>体验版</Text>
        </View>
        <Text className='settings-version-num'>v0.1.0</Text>
      </View>
    </View>
  )
}

