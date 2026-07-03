declare const defineAppConfig: <T>(config: T) => T
declare const definePageConfig: <T>(config: T) => T

namespace NodeJS {
  interface ProcessEnv {
    TARO_APP_CLOUD_ENV?: string
  }
}
