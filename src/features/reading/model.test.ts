import { articleId, isArticle, isSafeArticleUrl } from './model'

describe('reading model', () => {
  it('creates stable safe ids', () => expect(articleId('hn', '123/4')).toBe('hn:123-4'))
  it('allows only web URLs', () => { expect(isSafeArticleUrl('https://example.com')).toBe(true); expect(isSafeArticleUrl('javascript:alert(1)')).toBe(false) })
  it('rejects malformed articles', () => expect(isArticle({ id: 'x', title: 'x', url: 'javascript:x' })).toBe(false))
})
