import './state-view.scss'
import { Button, Text, View } from '@tarojs/components'

type Props = { kind: 'loading' | 'empty' | 'error' | 'forbidden'; message?: string; onRetry?: () => void }

const glyph: Record<Props['kind'], string> = {
  loading: '·',
  empty: '·',
  error: '!',
  forbidden: '×',
}

export function StateView({ kind, message, onRetry }: Props) {
  const defaults = { loading: '正在准备', empty: '这里还没有内容', error: '暂时没能加载', forbidden: '没有访问权限' }
  return (
    <View className='card state-view'>
      <View className='state-view-glyph'>
        <Text>{glyph[kind]}</Text>
      </View>
      <Text className='state-view-msg'>{message ?? defaults[kind]}</Text>
      {kind === 'error' && onRetry ? (
        <Button className='secondary-button state-view-retry' onClick={onRetry}>
          再试一次
        </Button>
      ) : null}
    </View>
  )
}
