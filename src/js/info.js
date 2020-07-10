import '../css/info.scss'
import '../css/reset.css'
import dropdown from './components/dropdown'
import Select from './components/select'
import map from './map'
import authentication from './authentication'
import { idToName, nameToId } from './data/id'
import $lottery from './http/lottery'


let page = {
  caipiaoid: 11,
  issueno: 0,
  getQueryFromUrl() {
    let searchStr = location.search;
    console.log(searchStr)
    if (searchStr) {
      const queryObj = {};
      searchStr.slice(1).split('&').forEach(item => {
        let arr = item.split('=');
        queryObj[decodeURIComponent(arr[0])] = decodeURIComponent(arr[1]);
      });
      this.caipiaoid = queryObj.caipiaoid || this.caipiaoid;
      this.issueno = queryObj.issueno || this.issueno;
      return queryObj;
    } else {
      return null;
    }
  },
  initUser() {
    // 显示用户信息
    authentication.init();
    // 登出
    const logoutBtn = document.querySelector('#logoutBtn');
    logoutBtn.addEventListener('click', () => {
      authentication.logout();
    });
  },
  initToggleLotteryType() {
    // 选择彩种
    const TypeListEle = document.querySelector('#typeList');
    TypeListEle.addEventListener('click', event => {
      if (event.target.tagName.toLowerCase() === 'a') {
        this.issueno = 0;
        this.caipiaoid = nameToId[event.target.innerText];
        location.search = `caipiaoid=${this.caipiaoid}`;
        this.initToggleSelect();
      }
    })
  },
  initToggleSelect() {
    const selectEle = document.querySelector('#selectOne');
    $lottery.issueno(this.caipiaoid)
      .then(res => {
        let selectData = res.data.map(item => {
          if (this.issueno === item.issueno) {
            return {
              value: item.issueno,
              text: item.issueno,
              current: true,
            }
          } else {
            return {
              value: item.issueno,
              text: item.issueno
            }
          }

        });
        let that = this;
        let fn = function (value, text) {
          $lottery.query(that.caipiaoid, value)
            .then(res => {
              that.renderView(res.data);
            })
            .catch(err => { })
        }
        let select = new Select(selectEle, selectData, fn);
        select.init();
      })
      .catch(err => { });
  },
  initMap(data) {
    // 地图
    data = data || [];
    const mapEle = document.querySelector('#map-box');
    map.init(mapEle, data);
  },
  renderView(data) {
    const openTime = document.querySelector('.period .open-time .time');
    const stopTime = document.querySelector('.period .stop-time .time');
    const redBallList = document.querySelector('.ball-number .ball-red-list .ball-list-wrapper');
    const blueBallList = document.querySelector('.ball-number .ball-blue-list .ball-list-wrapper');
    const redBallOrder = document.querySelector('.ball-order .ball-red-list .ball-list-wrapper');
    const blueBallOrder = document.querySelector('.ball-order .ball-blue-list .ball-list-wrapper');
    const bounsCurrent = document.querySelector('.bouns .bouns-current .item');
    const bounsTotal = document.querySelector('.bouns .bouns-total .item');
    const openBall = document.querySelector('.bouns .open-ball .item');

    openTime.innerText = data.opendate;
    stopTime.innerText = data.deadline || '另行通知';

    function createBall(ele, data, color) {
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
    function formatMoney (money) {
      if (isNaN(Number(money))) {
        return '0元';
      }
      money = Number(money).toFixed(0);
      let part1 = money.slice(-4);
      if (Number(part1) === 0) {
        part1 = '';
      }
      let part2 = money.slice(-8, -4);
      let part3 = money.slice(0, -8);
      if (part3) {
        return `${part3}亿${part2}万${part1}元`;
      } else if (part2) {
        return `${part2}万${part1}元`;
      } else if (part1) {
        return `${part1}元`;
      } else {
        return '0元';
      }
    }
    createBall(redBallList, data.number, 'red');
    createBall(blueBallList, data.refernumber, 'blue');
    createBall(redBallOrder, data.number, 'red');
    createBall(blueBallOrder, data.refernumber, 'blue');
    bounsTotal.innerText = formatMoney(data.totalmoney);
    bounsCurrent.innerText = formatMoney(data.saleamount);

    let table = null;
    if (data.caipiaoid === '11') {
      table = document.querySelector('#ssq-table');
    } else if (data.caipiaoid === '14') {
      table = document.querySelector('#dlt-table');
    }
    table.style.display = 'table';

    let trList = table.querySelectorAll('tbody tr[class]');

    function updateTable(ele, data) {
      let arr = Array.from(ele);
      arr.forEach((item, index) => {
        console.log('render table')
        console.log(data[index])
        item.querySelector('.prize-num').innerText = data[index].num;
        item.querySelector('.single-bonus').innerText = formatMoney(data[index].singlebonus);
      });
    }
    updateTable(trList, data.prize);

    this.initMap([
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
    ])
  },

  start() {
    this.getQueryFromUrl();
    this.initToggleSelect();
    this.initToggleLotteryType();
    this.initUser();
  }
};

page.start();














