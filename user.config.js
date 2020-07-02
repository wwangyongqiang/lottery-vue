
let serverPublicPath = 'https://buluoge.work/';
let serverApi = 'https://buluoge.work/api/';

module.exports = {
  publicPath: process.env.NODE_ENV === 'development' ? '/' : serverPublicPath,
  api: process.env.NODE_ENV === 'development' ? 'localhost:4000/api/' : serverApi,
};