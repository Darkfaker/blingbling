import { Button, Text, View } from '@tarojs/components'

type Props = { kind: 'loading' | 'empty' | 'error' | 'forbidden'; message?: string; onRetry?: () => void }

export function StateView({ kind, message, onRetry }: Props) {
  const defaults = { loading: '正在准备…', empty: '这里还没有内容', error: '暂时没能加载', forbidden: '没有访问权限' }
  return <View className='card' style={{ textAlign: 'center', padding: '56rpx 28rpx' }}>
    <Text className='muted'>{message ?? defaults[kind]}</Text>
    {kind === 'error' && onRetry ? <Button className='secondary-button' style={{ marginTop: '24rpx' }} onClick={onRetry}>重试</Button> : null}
  </View>
}
