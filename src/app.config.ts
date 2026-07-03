import { appPages } from './routes'

export default defineAppConfig({
  pages: [...appPages],
  window: {
    navigationBarBackgroundColor: '#FEF9F4',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'Komorebi 🌸',
    backgroundColor: '#FEF9F4',
    backgroundTextStyle: 'dark',
    enablePullDownRefresh: false,
  },
  lazyCodeLoading: 'requiredComponents',
})

