import { Button, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default function SettingsPage() {
  const clear = () => {
    for (const key of Taro.getStorageInfoSync().keys) if (key.startsWith('bbl:')) Taro.removeStorageSync(key)
    void Taro.showToast({ title: '本地缓存已清理', icon: 'success' })
  }
  return <View className='page'>
    <View className='card'><Text style={{ display: 'block', fontWeight: 650 }}>数据与隐私</Text><Text className='muted' style={{ display: 'block', marginTop: '16rpx', lineHeight: 1.6 }}>番茄钟和二维码内容只保存在本机。待办使用你的微信云身份隔离，不读取昵称或头像。诊断日志不记录待办、二维码或文章正文。</Text></View>
    <View className='section-title'>本地数据</View>
    <Button className='danger-button' onClick={clear}>清理本地缓存</Button>
    <View className='section-title'>版本</View>
    <View className='card'><Text>BBL v0.1.0</Text><Text className='muted' style={{ display: 'block', marginTop: '12rpx' }}>微信个人工具箱体验版</Text></View>
  </View>
}
