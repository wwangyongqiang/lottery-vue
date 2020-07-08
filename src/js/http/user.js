import instance from './index'
const prefix = '/user'

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

const $getUserInfo = () => $.get('/userInfo');
const $checkPhone = (params) => $.get('/phone', params);
const $login = data => $.post('/login', data);
const $register = data => $.post('/register', data);

export {
  $getUserInfo,
  $checkPhone,
  $login,
  $register,
}