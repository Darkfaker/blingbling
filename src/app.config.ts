import { appPages } from './routes'

export default defineAppConfig({
  pages: [...appPages],
  window: {
    navigationBarBackgroundColor: '#f7f8fa',
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'BBL 工具箱',
    backgroundColor: '#f7f8fa',
  },
  lazyCodeLoading: 'requiredComponents',
})
