import '../css/reset.css'
import '../css/head.scss'
import '../css/history.scss'

import $lottery from './http/lottery'

import Select from './components/select'
import utils from './components/utils'

const page = {
  init () {
    this.initSelect();
    // this.createTrDom();
    this.getData();
  },
  initSelect () {
    const selectEle = document.querySelector('#lottery-select');
    const openWeekDayEle = document.querySelector('.open-weekday');
    const selectData = [
      {
        value: '11',
        text: '双色球',
        openWeekDay: '每周二、四、日开奖'
      },
      {
        value: '14',
        text: '超级大乐透',
        openWeekDay: '每周一、三、六开奖'
      },
      {
        value: '12',
        text: '福彩3D',
        openWeekDay: '每日开奖'
      },
      {
        value: '13',
        text: '七乐彩',
        openWeekDay: '每日开奖'
      },
      {
        value: '15',
        text: '七星彩',
        openWeekDay: '每日开奖'
      },
      {
        value: '16',
        text: '排列三',
        openWeekDay: '每日开奖'
      },
      {
        value: '17',
        text: '排列五',
        openWeekDay: '每日开奖'
      },
      {
        value: '18',
        text: '胜负彩',
        openWeekDay: '每日开奖'
      },
    ];
    function fn (value, text, currentLiEle) {
      let data = JSON.parse(currentLiEle.dataset.data);
      openWeekDayEle.innerText = data.openWeekDay;
      console.log(`彩票id:${value}，彩票名称${text}`);
    }
    let selectOne = new Select(selectEle, selectData, fn);
    selectOne.init();
  },
  createTrDom (data) {
    let template = `
    <td class="td-issueno"></td>
    <td class="td-opendate"></td>
    <td class="td-number">
    </td>
    <td class="td-refernumber">
    </td>
    <td class="td-saleamount"></td>
    <td class="td-prize-first-num"></td>
    <td class="td-prize-first-bonus"></td>
    <td class="td-prize-second-num"></td>
    <td class="td-prize-second-bonus"></td>
    <td class="td-prize-third-num"></td>
    <td class="td-prize-third-bonus"></td>
    <td class="td-totalmoney"></td>
    <td class="td-more">
      <a href="javascript:void(0)">
        <span class="iconfont icon-chaxun"></span>
      </a>
    </td>`;
  let trEle = document.createElement('tr');
  trEle.innerHTML = template;

  trEle.querySelector('.td-issueno').innerText = data.issueno || '暂无数据';
  trEle.querySelector('.td-opendate').innerText = data.opendate || '暂无数据';
  trEle.querySelector('.td-saleamount').innerText = utils.formatMoney(data.saleamount) || '暂无数据';
  trEle.querySelector('.td-prize-first-num').innerText = data.prize[0].num || '暂无数据';
  trEle.querySelector('.td-prize-first-bonus').innerText = utils.formatMoney(data.prize[0].singlebonus) || '暂无数据';
  trEle.querySelector('.td-prize-second-num').innerText = data.prize[1].num || '暂无数据';
  trEle.querySelector('.td-prize-second-bonus').innerText = utils.formatMoney(data.prize[1].singlebonus) || '暂无数据';
  trEle.querySelector('.td-prize-third-num').innerText = data.prize[2].num || '暂无数据';
  trEle.querySelector('.td-prize-third-bonus').innerText = utils.formatMoney(data.prize[2].singlebonus) || '暂无数据';
  trEle.querySelector('.td-totalmoney').innerText = utils.formatMoney(data.totalmoney) || '暂无数据';
  trEle.querySelector('.td-more a').setAttribute('href', `/html/info.html?caipiaoid=${data.caipiaoid}&issueno=${data.issueno}`);
  let refernumberEle = trEle.querySelector('.td-refernumber');
  let numberEle = trEle.querySelector('.td-number');
  let numberArr = data.number.split(' ');
  let refernumberArr = data.refernumber.split(' ');
  numberArr.forEach(item => {
    let spanEle = document.createElement('span');
    spanEle.className = 'ball ball-red';
    spanEle.innerText = item;
    numberEle.appendChild(spanEle);
  });
  refernumberArr.forEach(item => {
    let spanEle = document.createElement('span');
    spanEle.className = 'ball ball-blue';
    spanEle.innerText = item;
    refernumberEle.appendChild(spanEle);
  });
  return trEle;
  },
  createTable (data) {
    let tbodyEle = document.querySelector('.lottery-table-box table tbody');
    let fragment = document.createDocumentFragment();
    data.forEach(item => {
      let trEle = this.createTrDom(item);
      fragment.appendChild(trEle);
    });
    tbodyEle.appendChild(fragment);
  },
  getData () {
    $lottery.history(11, 30)
    .then(res => {
      this.createTable(res.data.data);
    })
  }

};

page.init();