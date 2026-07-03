import { appPages } from './routes'

export default defineAppConfig({
  pages: [...appPages],
  window: {
    navigationBarBackgroundColor: '#FFB5A7',
    navigationBarTextStyle: 'white',
    navigationBarTitleText: 'Komorebi',
    backgroundColor: '#FFB5A7',
    backgroundTextStyle: 'light',
    enablePullDownRefresh: false,
  },
  lazyCodeLoading: 'requiredComponents',
})
