import { Button, Canvas, Text, Textarea, View } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { createQrMatrix } from '../renderer'
import { validateQrInput } from '../model'
import { toAppError } from '@/shared/observability/AppError'
import './index.scss'

const CANVAS_ID = 'bbl-qrcode'
const SIZE = 640

function drawQr(value: string) {
  const matrix = createQrMatrix(value)
  const context = Taro.createCanvasContext(CANVAS_ID)
  context.setFillStyle('#ffffff')
  context.fillRect(0, 0, SIZE, SIZE)
  const quiet = 6
  const cell = SIZE / (matrix.size + quiet * 2)
  // 主体深色（紫蓝系，符合新海诚色）
  context.setFillStyle('rgba(31, 35, 71, 0.92)')
  matrix.dark.forEach((row, y) =>
    row.forEach((dark, x) => {
      if (dark) context.fillRect((x + quiet) * cell, (y + quiet) * cell, Math.ceil(cell), Math.ceil(cell))
    }),
  )
  // 三角定位点（薄荷青主色）
  context.setFillStyle('#2D3D6B')
  const positions: Array<[number, number]> = [
    [quiet, quiet],
    [matrix.size - 7 + quiet, quiet],
    [quiet, matrix.size - 7 + quiet],
  ]
  for (const [fx, fy] of positions) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const onBorder = x === 0 || x === 6 || y === 0 || y === 6
        const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4
        if (onBorder || inner) {
          context.fillRect((fx + x) * cell, (fy + y) * cell, Math.ceil(cell), Math.ceil(cell))
        }
      }
    }
  }
  context.draw()
}

export default function QrCodePage() {
  const [text, setText] = useState('')
  const [renderedText, setRenderedText] = useState('')
  const [error, setError] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const { valid, bytes, message } = validateQrInput(text)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    if (!valid) return
    timer.current = setTimeout(() => {
      try {
        drawQr(text)
        setRenderedText(text)
        setError('')
      } catch {
        setRenderedText('')
        setError('这段内容暂时无法生成二维码')
      }
    }, 250)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [text, valid, message])

  useDidShow(() => void 0)

  const copy = () => valid && void Taro.setClipboardData({ data: text })

  const save = async () => {
    if (!renderedText) return
    try {
      const result = await Taro.canvasToTempFilePath({
        canvasId: CANVAS_ID,
        destWidth: 1024,
        destHeight: 1024,
      })
      const auth = await Taro.getSetting()
      if (auth.authSetting['scope.writePhotosAlbum'] === false) {
        await Taro.showModal({
          title: '需要相册权限',
          content: '请在设置中允许访问相册以保存二维码。',
          confirmText: '前往设置',
          success: (modal) => { if (modal.confirm) void Taro.openSetting() },
        })
        return
      }
      await Taro.saveImageToPhotosAlbum({ filePath: result.tempFilePath })
      await Taro.showToast({ title: '已保存到相册', icon: 'success' })
    } catch (cause) {
      await Taro.showToast({ title: toAppError(cause).userMessage, icon: 'none' })
    }
  }

  const byteClass = bytes === 0 ? '' : bytes <= 300 ? 'byte-pill--ok' : bytes <= 500 ? 'byte-pill--warn' : 'byte-pill--over'

  return (
    <View className='page qr-page'>
      <View className='qr-input-card card'>
        <Textarea
          className='qr-input'
          value={text}
          onInput={(e) => setText(e.detail.value)}
          placeholder='把文字或链接放在这里…'
          placeholderClass='qr-input-placeholder'
        />
        <View className='qr-input-footer'>
          <View className={`byte-pill ${byteClass}`}>
            <Text className='byte-num'>{bytes}</Text>
            <Text className='byte-divider'>/</Text>
            <Text>500 字节</Text>
          </View>
        </View>
      </View>

      <View className='qr-preview card'>
        <View className='qr-preview-glow' />
        <View className='qr-canvas-wrap'>
          <Canvas className='qr-canvas' canvasId={CANVAS_ID} />
          {valid && renderedText === text ? (
            <View className='qr-badge'>
              <Text className='qr-badge-dot'>●</Text>
              <Text>已就绪</Text>
            </View>
          ) : (
            <View className='qr-placeholder'>
              <View className='qr-placeholder-icon'>
                <Text>QR</Text>
              </View>
              <Text className='qr-placeholder-text'>{message || error || '在这里，文字会变成一条通道'}</Text>
            </View>
          )}
        </View>
      </View>

      <View className='qr-actions'>
        <Button
          className='primary-button qr-action-primary'
          disabled={!valid || renderedText !== text}
          hoverClass='qr-action--hover'
          onClick={save}
        >
          保存到相册
        </Button>
        <Button
          className='secondary-button'
          disabled={!valid}
          hoverClass='qr-action--hover'
          onClick={copy}
        >
          复制原文
        </Button>
      </View>

      <View className='qr-tip-row'>
        <Text className='qr-tip-dot'>·</Text>
        <Text className='qr-tip'>内容只在本机生成，不会上传。</Text>
      </View>
    </View>
  )
}
