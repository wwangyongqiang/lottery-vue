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

// 登出
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

// 加载新闻
class News {
  constructor(size = 15) {
    this.size = size;
    this.page = 1;
    this.url = config.NEWS_BASE_URL;
    this.newsListEle = document.querySelector('.news-list');
    this.canLoading = true;
  }

  update() {

    this.createLoading('加载中···');
    this.canLoading = false;
    axios.get(`${this.url}${this.page}/${this.size}`)
      .then(res => {     
        if (res.data.status === '000000') {
          if (res.data.message === '成功') {
            this.canLoading = true;
            const newsList = res.data.data.data;
            const fragment = document.createDocumentFragment();
            newsList.forEach(item => {
              let liEle = this.createSingleNewsTemplate(item);
              fragment.appendChild(liEle);
            });
            this.newsListEle.appendChild(fragment);
            this.removeLoading();
          } else {
            this.removeLoading();
            this.createLoading('没有了');
          }
         
        } else {
          console.log('获取新闻失败');
          console.log(res.data)
        }
      })
      .catch(err => {
        console.log('Error In Axios With News!');
        console.log(err);
      })

  }

  createSingleNewsTemplate(data) {
    const liEle = document.createElement('li');
    liEle.className = 'news-item';
    const template = `
      <a href="javascript:void(0)" class="clearfix">
        <div class="left">
          <img src="./image/news/80400.jpg" alt="">
        </div>
        <div class="right">
          <div class="title"><span class="badge">双色球</span><span class="text">彩精讲双色球命中6红 qinyour888再中5红</span></div>
          <div class="summary">双色球名家彩精讲命中6红！乐乐购彩、联名彩神、飞雪绒花均顺利命中6红。</div>
          <div class="info clearfix">
            <div class="from">来源：中国福彩网</div>
            <div class="time"><i class="iconfont icon-clock"></i><span class="text">十小时前</span></div>
          </div>
        </div>
      </a>`

    liEle.innerHTML = template;
    liEle.querySelector('a').setAttribute('href', data.link);
    liEle.querySelector('.left img').setAttribute('src', data.logoFile);
    liEle.querySelector('.title .text').innerText = data.title;
    liEle.querySelector('.summary').innerText = data.summary;
    liEle.querySelector('.from').innerText = `来源：${data.source}`;
    liEle.querySelector('.time .text').innerText = data.publishDate;

    if (data.metaValue) {
      let badge = JSON.parse(data.metaValue);
      liEle.querySelector('.title .badge').innerText = badge.lx;
    }

    return liEle;
  }

  loadMore() {
    const btnToTopEle = document.querySelector('#btnToTop');

    btnToTopEle.addEventListener('click', () => {
      console.log(document.body.scrollTop)
      document.documentElement.style.scrollBehavior = 'smooth';
      document.body.style.scrollBehavior = 'smooth';
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

    });


    window.addEventListener('scroll', () => {

      const clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight,document.body.clientHeight);
      const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      if (scrollHeight - scrollTop - clientHeight <= 5) {
        if (this.canLoading === false) return 0;
        this.page += 1;
        this.update();
      }

       // 回到顶部按钮
       if (scrollTop > 2 * clientHeight) {
          btnToTopEle.style.display = 'block';
       } else {
         btnToTopEle.style.display = 'none';
       }


    })
  }

  createLoading (text) {
    const liEle = document.createElement('li');
    liEle.className = 'news-item news-loading';

    const template = `
    <span class="loading-item">
      ${text}
    </span>
    `;
    liEle.innerHTML = template;
    this.newsListEle.appendChild(liEle);
  }

  removeLoading () {
    const loadingEle = document.querySelector('.news .news-loading');
    if (!loadingEle) return null;
    loadingEle.remove();
  }

  init () {
    this.update();
    this.loadMore();
  }

}
const newsClient = new News();
newsClient.init();







