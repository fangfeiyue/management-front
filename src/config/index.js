const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  development: {
    baseApi: '/api'
  },
  production: {
    baseApi: ''
  }
};
export default {
  env: 'dev',
  mock: false,
  ...EnvConfig[env]
}
