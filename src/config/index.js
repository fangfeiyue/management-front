const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/c1c302e8baed9894c48c17e4738c092e/api'
  },
  production: {
    baseApi: ''
  }
};
export default {
  env: 'dev',
  mock: true,
  ...EnvConfig[env]
}
