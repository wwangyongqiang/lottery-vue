import '../css/info.scss'
import '../css/reset.css'
import utils from './components/utils'
import config from '../../user.config'
import axios from 'axios'
import dropdown from './components/dropdown'
import Select from './components/select'
import map from './map'
import authentication from './authentication'

import { dataOne, dataTwo } from './mock/ssq'


// 显示用户信息
authentication.init();

// 登出
const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', () => {
  authentication.logout();
});

// 选择彩种
const typeObj = {
  '双色球': 1,
  '超级大乐透': 2,
  '福彩3D': 3,
  '七乐彩': 4,
  '排列3': 5,
  '排列5': 6,
  '七星彩': 7,
  '胜负彩':8
};
let currentType = 1;
const TypeListEle = document.querySelector('#typeList');
TypeListEle.addEventListener('click', function (event) {
  if (event.target.tagName.toLowerCase() === 'a') {
    currentType = typeObj[event.target.innerText];
    lottery.update()
  }
})

// 获取彩票数据
let lottery = {
  currentDataNum: 0,
  getData () {
    return new Promise((res, rej) => {

      setTimeout(() => {
        if (this.currentDataNum === 0) {
          this.currentDataNum = 1;
          res(dataOne);
        } else {
          this.currentDataNum = 0;
          res(dataTwo);
        }
      }, Math.random() * 1000);
    });
  },

  updateView (data) {
    const openTime = document.querySelector('.period .open-time .time');
    const stopTime = document.querySelector('.period .stop-time .time');
    const redBallList = document.querySelector('.ball-number .ball-red-list .ball-list-wrapper');
    const blueBallList = document.querySelector('.ball-number .ball-blue-list .ball-list-wrapper');
    const redBallOrder = document.querySelector('.ball-order .ball-red-list .ball-list-wrapper');
    const blueBallOrder = document.querySelector('.ball-order .ball-blue-list .ball-list-wrapper');
    const bounsTotal = document.querySelector('.bouns .bouns-current .item');
    const bounsCurrent = document.querySelector('.bouns .bouns-total .item');
    const openBall = document.querySelector('.bouns .open-ball .item');
    const table = document.querySelector('.detail table')
    const firstPrize = table.querySelector('.first-prize')
    const secondPrize = table.querySelector('.second-prize')
    const thirdPrize = table.querySelector('.third-prize')
    const forthPrize = table.querySelector('.forth-prize')
    const fifthPrize = table.querySelector('.fifth-prize')
    const sixthPrize = table.querySelector('.sixth-prize')

    openTime.innerText = data.openTime;
    stopTime.innerText = data.deadlineAwardDate;

    function createBall (ele, data, color) {
      color = color || 'red';
      ele.innerHTML = '';
      let _arr = data.split(' ');

      _arr.forEach((item, index) => {
        let li = document.createElement('span');
        li.className = 'ball ball-' + color;
        li.innerText = item;
        ele.appendChild(li);
      });
    }

    createBall(redBallList, data.frontWinningNum, 'red');
    createBall(blueBallList, data.backWinningNum, 'blue');
    createBall(redBallOrder, data.seqFrontWinningNum, 'red');
    createBall(blueBallOrder, data.seqBackWinningNum, 'blue');
    bounsTotal.innerText = data.prizePoolMoney + '元';
    bounsCurrent.innerText = data.saleMoney + '元';
    openBall.innerText = `第${data.lotteryBallNum}套球`;

    function updateTable (ele, data) {
      let _arr = ele.querySelectorAll('td');
      let arr = Array.from(_arr);
      arr[2].innerText = data.baseBetWinner.awardMoney;
      arr[1].innerText = data.baseBetWinner.awardNum;
    }

    updateTable(firstPrize, data.winnerDetails[0])
    updateTable(secondPrize, data.winnerDetails[1])
    updateTable(thirdPrize, data.winnerDetails[2])
    updateTable(forthPrize, data.winnerDetails[3])
    updateTable(fifthPrize, data.winnerDetails[4])
    updateTable(sixthPrize, data.winnerDetails[5])
    console.log(data.winnerDetails)
  },

  update () {

    this.getData()
    .then(data => {
      this.updateView(data);
    })
  }
};

// 下拉菜单
const data = [
  {
    value: '2020058',
    text: '2020058',
  },
  {
    value: '2020057',
    text: '2020057',
  },
  {
    value: '2020056',
    text: '2020056',
  },
  {
    value: '2020055',
    text: '2020055',
  },
];
const select_one_ele = document.querySelector('#selectOne');
const fn = function (value, text) {
  lottery.update();
}
const select_one = new Select(select_one_ele, data, fn);
select_one.init()


// 地图
const mapEle = document.querySelector('#map-box');
map.init(mapEle, [
  {
    name: '北京',
    value: 1
  },
  {
    name: '浙江',
    value: 4
  },
  {
    name: '广东',
    value: 21
  }
]);




