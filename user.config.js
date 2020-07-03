
let serverPublicPath = 'https://buluoge.work/';
let serverApi = 'https://buluoge.work/api/';
const env = process.env.NODE_ENV;

module.exports = {
  publicPath: env === 'development' ? '/' : serverPublicPath,
  api: env === 'development' ? '/dev/api' : serverApi,
  BASE_URL: '/api'
};