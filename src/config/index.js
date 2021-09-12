const env = import.meta.env.MODE || 'prod'
const EnvConfig = {
  development: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/b46065055327379e219cff11b2c64178/api'
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
