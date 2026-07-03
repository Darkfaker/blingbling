export const MAX_QR_BYTES = 500

export function utf8ByteLength(value: string): number {
  let bytes = 0
  for (const character of value) {
    const point = character.codePointAt(0)!
    bytes += point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4
  }
  return bytes
}

export function validateQrInput(value: string): { valid: boolean; bytes: number; message?: string } {
  const bytes = utf8ByteLength(value)
  if (!value.trim()) return { valid: false, bytes, message: '输入一些文字或网址' }
  if (bytes > MAX_QR_BYTES) return { valid: false, bytes, message: `内容超过 ${MAX_QR_BYTES} 字节` }
  return { valid: true, bytes }
}

export interface QrMatrix { size: number; dark: boolean[][] }
