import '../css/carousel.scss'
import utils from './utils'

class Carousel {
  constructor(element, data) {
    this.element = element;
    this.data = data;
    this.width = 0;
    this.height = 0;
    this.imgList = null;
    this.navList = null;
    this.slideBtn = null;
    this.activeIndex = 0;
    this.preIndex = -1;
    this.length = data.length;
    this.duration = 2;
    this.timer = null;
    this.throttleMove = null;
  }

  getSize() {
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
  }

  createImgItemTemplate(data) {
    // <li>
    //   <a href="javascript:void(0)">
    //     <img src="./image/carousel-1.jpg" alt="">
    //   </a>
    // </li>
    const liEle = document.createElement('li');
    const linkEle = document.createElement('a');
    const imgEle = document.createElement('img');
    
    liEle.appendChild(linkEle);
    linkEle.appendChild(imgEle);
    linkEle.setAttribute('href', data.url);
    imgEle.setAttribute('src', data.image);
    return liEle;
  }

  createImgListTemplate () {
    const imgList = document.createElement('ul');
    imgList.className = 'carousel-img-list clearfix';
    imgList.style.width = `${(this.length + 1) * this.width}px`;
    imgList.style.height = `${this.height}px`;
    imgList.style.transition = 'all .5s linear';

    this.data.forEach((item, index) => {
      // 图片
      const liEle = this.createImgItemTemplate(item);
      imgList.appendChild(liEle);
    });

    // 末尾添加第一张图片
    const lastLiEle = this.createImgItemTemplate(this.data[0]);
    imgList.appendChild(lastLiEle);

    return imgList;
  }

  createNavTemplate () {
    const navList = document.createElement('ul');
    navList.className = 'carousel-nav-list clearfix';
    for(let i=0; i<this.length; i++) {
      const liEle = document.createElement('li');
      const linkEle = document.createElement('a');
      if (i === this.activeIndex) {
        linkEle.className = 'active';
      }
      linkEle.setAttribute('href', 'javascript:void(0)');
      linkEle.dataset.index = i;
      liEle.appendChild(linkEle);
      navList.appendChild(liEle);
    }
    return navList;
  }

  createSlideBtn () {
    const leftBtn = document.createElement('a');
    const rightBtn = document.createElement('a');
    const fragment = document.createDocumentFragment();
    leftBtn.className = 'carousel-slide-btn carousel-slide-btn-left';
    rightBtn.className = 'carousel-slide-btn carousel-slide-btn-right';
    fragment.appendChild(leftBtn);
    fragment.appendChild(rightBtn);
    this.slideBtn = [leftBtn, rightBtn];
    return fragment;
  }

  createDom () {
  //   <div class="carousel-wrapper">
  //   <ul class="carousel-img-list clearfix">
  //     <li></li>
  //   </ul>
  // </div>

    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';
    
    const imgList = this.createImgListTemplate();
    this.imgList = imgList;

    const navList = this.createNavTemplate();
    this.navList = navList;

    const slideBtn = this.createSlideBtn();


    wrapper.appendChild(navList);
    wrapper.appendChild(imgList);
    wrapper.appendChild(slideBtn);

    // 添加至页面
    this.element.appendChild(wrapper);
  }

  moveTo(index) {
    index = parseInt(index); // dataset string => number
    this.preIndex = this.activeIndex;
    if (this.preIndex === this.length) {
      this.preIndex = 0;
    }
    this.activeIndex = index;
    
    this.navList.querySelectorAll('a')[this.preIndex].className = '';
    this.navList.querySelectorAll('a')[this.activeIndex].className = 'active';
    this.imgList.style.left = `-${this.width * this.activeIndex}px`;
  }

  eventCenter () {
    // 鼠标移入停止轮播
    this.element.addEventListener('mouseenter',  () => {
      this.stopAutoPlay();
    });
    this.element.addEventListener('mouseleave', () => {
      this.autoPlay();
    });

    // 点击 nav
    this.navList.addEventListener('click',  (event) => {
      let target = event.target;
      if (target.tagName.toLowerCase() !== 'a') {
        return 0;
      }
      this.moveTo(target.dataset.index);
    });

    // 点击 slideBtn
    this.slideBtn.forEach((item, index) => {

      item.addEventListener('click', event => {
        const target = event.target;
        if (!this.throttleMove) {
          this.throttleMove = utils.throttle(this.moveOneStep, 500);
        }
        
        if (target.className.includes('left')) {
          this.throttleMove(this, -1);
        } else if (target.className.includes('right')) {
          this.throttleMove(this, 1);
        }
      });
    });
  }
  /**
   * 
   * @param {number} direction 正数正向 负数反向 
   */
  moveOneStep (direction) {
    direction = direction || 1;
    this.preIndex = this.activeIndex;
    if (this.preIndex == this.length) {
      this.preIndex = 0;
    }
    // 正向
    if (direction > 0) {

      if (this.activeIndex === this.length) {
        this.activeIndex = 0;
        this.imgList.style.transition = 'none';
        this.imgList.style.left = `0px`;
        this.imgList.offsetLeft; // 立即渲染
      }
      this.activeIndex += 1;

    } else {
      // 反向
      if (this.activeIndex === 0) {
        this.activeIndex = this.length;
        this.imgList.style.transition = 'none';
        this.imgList.style.left = `-${this.length * this.width}px`;
        this.imgList.offsetLeft; // 立即渲染

      }
      this.activeIndex -= 1;
    }

    const navListItemArr =  this.navList.querySelectorAll('a');
    if (this.preIndex >= 0) {
      navListItemArr[this.preIndex].className = '';
    }
    if (this.activeIndex === this.length) {
      navListItemArr[0].className = 'active';
    } else {
      navListItemArr[this.activeIndex].className = 'active';
    }

    this.imgList.style.transition = 'all .8s';
    this.imgList.style.left = `-${this.width * this.activeIndex}px`;
  }

  autoPlay () {
    const play = () => {
      this.timer = setTimeout(() => {
        this.moveOneStep(1);
        play();
      }, this.duration * 1000);
    };
    play();
  }

  stopAutoPlay () {
    clearTimeout(this.timer);
  }

  start () {
        this.getSize();
        this.createDom();
        this.autoPlay();
        this.eventCenter();
  }

}

export default Carousel;