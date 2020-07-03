import '../css/reset.css'
import '../css/index.scss'
import utils from './utils'
import axios from 'axios'

import './tab'
import dropdown from './dropdown'
import Carousel from './carousel'
import scrollNumber from './scrollNumber'
import config from '../../user.config'



// 轮播
const carouselEle = document.querySelector('#carouselBox');
const data = [
  {
    image: 'https://www.zhcw.com//upload/resources/image/2020/04/27/75035_740x300c.jpg',
    url: 'https://www.baidu.com',
    title: '图片1',
  },
  {
    image: 'https://www.zhcw.com/upload/resources/image/2020/06/24/80778_740x300c.jpg',
    url: 'https://www.baidu.com',
    title: '图片2',
  },
  {
    image: 'https://www.zhcw.com/upload/resources/image/2020/06/30/81191_740x300c.png',
    url: 'https://www.baidu.com',
    title: '图片3',
  },
  {
    image: 'https://www.zhcw.com/upload/resources/image/2020/06/30/81197_740x300c.jpg',
    url: 'https://www.baidu.com',
    title: '图片4',
  },
];
const carousel_one = new Carousel(carouselEle, data);
carousel_one.start();

// 奖池滚动
const scrollNumberEleOne = document.querySelector('#scrollNumberOne');
const scrollNumberEleTwo = document.querySelector('#scrollNumberTwo');
scrollNumber.init(scrollNumberEleOne);
scrollNumber.init(scrollNumberEleTwo);

// validate Token
axios.post(config.BASE_URL + '/user/token')
  .then(res => {
    console.log('validate token');
    updateUserInfo();
  }).catch(err => {
    console.log('ERROR IN AXIOS TOKEN', err);
  })

// 获取用户信息
function updateUserInfo() {
  const userPhone = utils.docCookies.getItem('uname');
  const infoEle = document.querySelector('#userInfo');
  const loginEle = document.querySelector('#login-form');
  const phoneEle = infoEle.querySelector('.user-phone')

  if (userPhone) {
    loginEle.style.display = 'none';
    infoEle.style.display = 'block';
    phoneEle.innerText = (userPhone);
  } else {
    loginEle.style.display = 'block';
    infoEle.style.display = 'none';
    phoneEle.innerText = '';
  }
}




const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', () => {
  axios.get(config.BASE_URL + '/user/logout')
  .then(res => {
    updateUserInfo();
  })
  .catch(err => {
    console.log('ERROR IN AXIOS LOGOUT', err)
  })
});




