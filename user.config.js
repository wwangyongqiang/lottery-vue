
let serverPublicPath = 'https://buluoge.work/';
let serverApi = 'https://buluoge.work/api/';
const env = process.env.NODE_ENV;

module.exports = {
  publicPath: env === 'development' ? '/' : serverPublicPath,
  api: env === 'development' ? '/dev/api' : serverApi,
  BASE_URL: '/api',
  NEWS_BASE_URL: 'https://in.zhcw.com//focus/0/15145,16038,16039,16040,16041,16042,16043,16044,16046,15148,15149,15152,15153,16030,16032,16033,16034,16035,16036,16037,15157,15974,15159,16085,16086,16087,16088,15164,15167,15956,16103,15957/',
};