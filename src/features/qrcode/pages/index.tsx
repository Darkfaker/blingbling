import { Button, Canvas, Text, Textarea, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import { createQrMatrix } from '../renderer'
import { validateQrInput } from '../model'
import './index.scss'

const CANVAS_ID = 'bbl-qrcode'
const SIZE = 640

function drawQr(value: string) {
  const matrix = createQrMatrix(value)
  const context = Taro.createCanvasContext(CANVAS_ID)
  context.setFillStyle('#ffffff'); context.fillRect(0, 0, SIZE, SIZE)
  const quiet = 4
  const cell = SIZE / (matrix.size + quiet * 2)
  context.setFillStyle('#111827')
  matrix.dark.forEach((row, y) => row.forEach((dark, x) => { if (dark) context.fillRect((x + quiet) * cell, (y + quiet) * cell, Math.ceil(cell), Math.ceil(cell)) }))
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
      try { drawQr(text); setRenderedText(text); setError('') } catch { setRenderedText(''); setError('这段内容暂时无法生成二维码') }
    }, 250)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [text, valid, message])
  const copy = () => valid && void Taro.setClipboardData({ data: text })
  const save = async () => {
    if (!renderedText) return
    try {
      const result = await Taro.canvasToTempFilePath({ canvasId: CANVAS_ID, width: SIZE, height: SIZE, destWidth: 1024, destHeight: 1024, fileType: 'png', quality: 1 })
      await Taro.saveImageToPhotosAlbum({ filePath: result.tempFilePath })
      await Taro.showToast({ title: '已保存到相册', icon: 'success' })
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause)
      if (message.includes('auth') || message.includes('authorize')) {
        const confirm = await Taro.showModal({ title: '需要相册权限', content: '请在设置中允许保存图片到相册。', confirmText: '去设置' })
        if (confirm.confirm) await Taro.openSetting()
      } else await Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
    }
  }
  return <View className='page qr-page'>
    <View className='card'><Textarea className='qr-input' maxlength={600} placeholder='输入文字或网址' value={text} onInput={(e) => setText(e.detail.value)} /><Text className={bytes > 500 ? 'byte-count over' : 'byte-count'}>{bytes} / 500 字节</Text></View>
    <View className='canvas-wrap'><Canvas className='qr-canvas' canvasId={CANVAS_ID} />{valid && renderedText === text ? null : <View className='qr-placeholder'>{message || error || '二维码会出现在这里'}</View>}</View>
    <View className='qr-actions'><Button className='primary-button' disabled={!valid || renderedText !== text} onClick={save}>保存到相册</Button><Button className='secondary-button' disabled={!valid} onClick={copy}>复制原文</Button></View>
    <Text className='muted qr-tip'>内容只在本机生成，不会上传。</Text>
  </View>
}
