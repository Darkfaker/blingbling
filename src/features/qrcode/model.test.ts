import { utf8ByteLength, validateQrInput } from './model'

describe('QR input', () => {
  it('counts UTF-8 bytes', () => { expect(utf8ByteLength('abc')).toBe(3); expect(utf8ByteLength('中')).toBe(3); expect(utf8ByteLength('😀')).toBe(4) })
  it('rejects empty input', () => expect(validateQrInput('  ').valid).toBe(false))
  it('accepts exactly 500 bytes', () => expect(validateQrInput('a'.repeat(500)).valid).toBe(true))
  it('rejects values over 500 bytes', () => expect(validateQrInput('a'.repeat(501)).valid).toBe(false))
})
