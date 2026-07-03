import type { PropsWithChildren } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import './app.scss'

export default function App({ children }: PropsWithChildren) {
  useLaunch(() => {
    const env = __CLOUD_ENV__
    if (env && Taro.cloud) Taro.cloud.init({ env, traceUser: false })
  })
  return children
}
