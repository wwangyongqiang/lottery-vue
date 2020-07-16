import instance from './index'
const prefix = '/lottery'

const $  = {
  post (url, data) {
    return instance.post(`${prefix}${url}`, data);
  },
  get (url, params) {
    return instance.get(`${prefix}${url}`, {
      params
    });
  },
};

export default {
  query (caipiaoid, issueno) {
    return $.get('/query', {
      caipiaoid,
      issueno
    })
  },
  /**
   * 获取指定彩票的期数数据
   * @param {string|number} caipiaoid 彩票id
   */
  issueno (caipiaoid) {
    return $.get('/issueno', {
      caipiaoid
    })
  },

  chart (caipiaoid, chartcontent, issuenonum) {
    return $.get('/chart', {
      caipiaoid,
      chartcontent,
      issuenonum,
    })
  },

  history (caipiaoid, num) {
    return $.get('/history', {
      caipiaoid,
      num
    })
  }
}