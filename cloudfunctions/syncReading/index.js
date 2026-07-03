'use strict'

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const API = 'https://hacker-news.firebaseio.com/v0'

function articleFromItem(item, fetchedAt) {
  if (!item || item.type !== 'story' || !item.title) return null
  const id = `hn:${item.id}`
  return {
    _id: id,
    sourceId: 'Hacker News',
    externalId: String(item.id),
    title: String(item.title).slice(0, 240),
    summary: `${Number(item.score || 0)} points · by ${String(item.by || 'unknown')}`,
    canonicalUrl: item.url || `https://news.ycombinator.com/item?id=${item.id}`,
    publishedAt: Number(item.time || 0) * 1000,
    fetchedAt,
    schemaVersion: 1,
  }
}

exports.main = async () => {
  const fetchedAt = Date.now()
  const idsResponse = await fetch(`${API}/topstories.json`)
  if (!idsResponse.ok) throw new Error(`HN list failed: ${idsResponse.status}`)
  const ids = (await idsResponse.json()).slice(0, 30)
  const items = await Promise.all(ids.map(async (id) => {
    const response = await fetch(`${API}/item/${id}.json`)
    return response.ok ? articleFromItem(await response.json(), fetchedAt) : null
  }))
  const articles = items.filter(Boolean)
  for (const article of articles) await db.collection('articles').doc(article._id).set({ data: article })
  return { ok: true, count: articles.length, fetchedAt }
}

exports.articleFromItem = articleFromItem
