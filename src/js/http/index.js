import axios from 'axios'
import config from '../../../user.config'

const instance = axios.create({
  baseURL: config.BASE_URL,
  timeout: 2000,
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('token');
    console.log(token)
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
  });

export default instance