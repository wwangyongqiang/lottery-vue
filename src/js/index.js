import '../css/reset.css'
import '../css/index.scss'

import './tab'
import Carousel from './carousel'
import scrollNumber from './scrollNumber'



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



