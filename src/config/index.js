const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  dev: {
    baseApi: ''
  },
  prod: {
    baseApi: ''
  }
};
export default {
  env: 'dev',
  mock: true,
  ...EnvConfig[env]
}
