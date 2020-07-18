import '../css/reset.css'
import '../css/index.scss'
import $news from './http/news'
import $lottery from './http/lottery'
import './components/tab'
import dropdown from './components/dropdown'
import Carousel from './components/carousel'
import scrollNumber from './components/scrollNumber'
import config from '../../user.config'
import authentication from './authentication'

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
$lottery.query('11')
  .then(res => {
    const ssqEle = document.querySelector('.hot-item.ssq');
    const dataEle = ssqEle.querySelector('.date');
    const periodEle = ssqEle.querySelector('.period');
    const scrollNumberEle = document.querySelector('#scrollNumberOne');
    const redBallListEle = ssqEle.querySelectorAll('.ball.red');
    const blueBallEle = ssqEle.querySelector('.ball.blue');
    const linkDetailEle = ssqEle.querySelector('.link-detail');
    
    const data = res.data;
    console.log(data)
    dataEle.innerText = data.opendate.slice(5);
    periodEle.innerText = `第${data.issueno}期`;
    let numTarget = Number(data.totalmoney).toFixed();
    let part1 = numTarget.slice(-4);
    let part2 = numTarget.slice(-8, -4)
    let part3 = numTarget.slice(0, -8);
    let numTargetStr = part3 ? `${part3}亿${part2}万${part1}元` : `${part2}万${part1}元`;
    scrollNumberEle.dataset.target = numTargetStr;
    let redBall = data.number.split(' ');
    [].forEach.call(redBallListEle, (item, index) => {
      item.innerText = redBall[index];
    });
    blueBallEle.innerText = data.refernumber;
    scrollNumber.init(scrollNumberEle);
    linkDetailEle.setAttribute('href', `/html/info.html?caipiaoid=${data.caipiaoid}`);
  })
  .catch(err => {
    console.log(err);
  })

  $lottery.query('14')
  .then(res => {
    const ssqEle = document.querySelector('.hot-item.dlt');
    const dataEle = ssqEle.querySelector('.date');
    const periodEle = ssqEle.querySelector('.period');
    const scrollNumberEle = document.querySelector('#scrollNumberTwo');
    const redBallListEle = ssqEle.querySelectorAll('.ball.red');
    const blueBallListEle = ssqEle.querySelector('.ball.blue');
    const linkDetailEle = ssqEle.querySelector('.link-detail');
    
    const data = res.data;
    dataEle.innerText = data.opendate.slice(5);
    periodEle.innerText = `第${data.issueno}期`;
    let numTarget = Number(data.totalmoney).toFixed();
    let part1 = numTarget.slice(-4);
    let part2 = numTarget.slice(-8, -4)
    let part3 = numTarget.slice(0, -8);
    let numTargetStr = part3 ? `${part3}亿${part2}万${part1}元` : `${part2}万${part1}元`;
    scrollNumberEle.dataset.target = numTargetStr;
    let redBall = data.number.split(' ');
    let blueBall = data.refernumber.split(' ');
    [].forEach.call(redBallListEle, (item, index) => {
      item.innerText = redBall[index];
    });
    [].forEach.call(blueBallListEle, (item, index) => {
      item.innerText = blueBall[index];
    });
    scrollNumber.init(scrollNumberEle);
    linkDetailEle.setAttribute('href', `/html/info.html?caipiaoid=${data.caipiaoid}`);
  })
  .catch(err => {
    console.log(err);
  })

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
    $news(this.page, this.size)
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
    liEle.querySelector('.title .text').innerText = data.shortTitle;
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
      document.documentElement.style.scrollBehavior = 'smooth';
      document.body.style.scrollBehavior = 'smooth';
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

    });


    window.addEventListener('scroll', () => {

      const clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight, document.body.clientHeight);
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

  createLoading(text) {
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

  removeLoading() {
    const loadingEle = document.querySelector('.news .news-loading');
    if (!loadingEle) return;
    loadingEle.remove();
  }

  init() {
    this.update();
    this.loadMore();
  }

}
const newsClient = new News();
newsClient.init();



// 显示用户信息
authentication.init();
// 登出
const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', () => {
  authentication.logout();
});









