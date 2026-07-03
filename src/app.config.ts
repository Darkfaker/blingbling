import { appPages } from './routes'

export default defineAppConfig({
  pages: [...appPages],
  window: {
    navigationBarBackgroundColor: '#ffffff',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'BBL 工具箱',
    backgroundColor: '#f4f5fb',
    backgroundTextStyle: 'dark',
    enablePullDownRefresh: false,
  },
  lazyCodeLoading: 'requiredComponents',
})
