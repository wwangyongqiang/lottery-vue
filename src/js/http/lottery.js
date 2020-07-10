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
  issueno (caipiaoid) {
    return $.get('/issueno', {
      caipiaoid
    })
  }
}