import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import path from 'node:path'
import dev from './dev'
import prod from './prod'

export default defineConfig<'webpack5'>(async (merge) => {
  const base: UserConfigExport<'webpack5'> = {
    projectName: 'bbl',
    date: '2026-07-03',
    designWidth: 750,
    deviceRatio: { 750: 1 },
    sourceRoot: 'src',
    outputRoot: 'dist',
    framework: 'react',
    compiler: 'webpack5',
    alias: { '@': path.resolve(process.cwd(), 'src') },
    defineConstants: {
      __CLOUD_ENV__: JSON.stringify(process.env.TARO_APP_CLOUD_ENV ?? ''),
    },
    cache: { enable: true },
    mini: { postcss: { pxtransform: { enable: true }, cssModules: { enable: false } } },
  }
  if (process.env.NODE_ENV === 'development') {
    return merge({}, base, dev)
  }
  return merge({}, base, prod)
})
