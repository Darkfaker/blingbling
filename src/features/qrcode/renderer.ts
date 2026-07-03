import qrcode from 'qrcode-generator'
import type { QrMatrix } from './model'

export function createQrMatrix(text: string): QrMatrix {
  const qr = qrcode(0, 'M')
  qr.addData(text, 'Byte')
  qr.make()
  const size = qr.getModuleCount()
  return { size, dark: Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => qr.isDark(row, col))) }
}
