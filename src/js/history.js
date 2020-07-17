import '../css/reset.css'
import '../css/head.scss'
import '../css/history.scss'

import $lottery from './http/lottery'

import Select from './components/select'
import utils from './components/utils'
import Pagination from './components/pagination'

const page = {
  caipiaoid: 11,
  pagination: null,
  size: 10,
  init() {
    this.initSelect();
    // this.createTrDom();
    // this.getData();
    // this.initPagination();
  },
  initSelect() {
    const selectEle = document.querySelector('#lottery-select');
    const openWeekDayEle = document.querySelector('.open-weekday');
    const selectData = [
      {
        value: '11',
        text: '双色球',
        openWeekDay: '每周二、四、日开奖',
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
    const fn = (value, text, currentLiEle) => {
      this.caipiaoid = value;
      $lottery.count(this.caipiaoid)
        .then(res => {
          if (!this.pagination) {
            this.initPagination(res.data.data.num, this.size);
          } else {
            this.pagination.update(res.data.data.num, this.size);
          }
        })
        .catch(err => { })
    }
    let selectOne = new Select(selectEle, selectData, fn);
    selectOne.init();
  },
  createTrDom(data) {
    if (Number(this.caipiaoid) === 11) {
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
      trEle.querySelector('.td-saleamount').innerText = data.saleamount ? utils.formatMoney(data.saleamount) : '暂无数据';
      trEle.querySelector('.td-prize-first-num').innerText = data.prize[0].num || '暂无数据';
      trEle.querySelector('.td-prize-first-bonus').innerText = data.prize[0].singlebonus ? utils.formatMoney(data.prize[0].singlebonus) : '暂无数据';
      trEle.querySelector('.td-prize-second-num').innerText = data.prize[1].num || '暂无数据';
      trEle.querySelector('.td-prize-second-bonus').innerText = data.prize[1].singlebonus ? utils.formatMoney(data.prize[1].singlebonus) : '暂无数据';
      trEle.querySelector('.td-prize-third-num').innerText = data.prize[2].num || '暂无数据';
      trEle.querySelector('.td-prize-third-bonus').innerText = data.prize[2].singlebonus ? utils.formatMoney(data.prize[2].singlebonus) : '暂无数据';
      trEle.querySelector('.td-totalmoney').innerText = data.totalmoney ? utils.formatMoney(data.totalmoney) : '暂无数据';
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
    }

    if (Number(this.caipiaoid) === 14) {
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
        <td class="td-prize-first-add-num"></td>
        <td class="td-prize-first-add-bonus"></td>
        <td class="td-prize-second-num"></td>
        <td class="td-prize-second-bonus"></td>
        <td class="td-prize-second-add-num"></td>
        <td class="td-prize-second-add-bonus"></td>
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
      trEle.querySelector('.td-saleamount').innerText = data.saleamount ? utils.formatMoney(data.saleamount) : '暂无数据';
      trEle.querySelector('.td-prize-first-num').innerText = data.prize[0].num || '暂无数据';
      trEle.querySelector('.td-prize-first-bonus').innerText = data.prize[0].singlebonus ? utils.formatMoney(data.prize[0].singlebonus) : '暂无数据';
      trEle.querySelector('.td-prize-first-add-num').innerText = data.prize[1].num || '暂无数据';
      trEle.querySelector('.td-prize-first-add-bonus').innerText = data.prize[1].singlebonus ? utils.formatMoney(data.prize[1].singlebonus) : '暂无数据';
      trEle.querySelector('.td-prize-second-num').innerText = data.prize[2].num || '暂无数据';
      trEle.querySelector('.td-prize-second-bonus').innerText = data.prize[2].singlebonus ? utils.formatMoney(data.prize[2].singlebonus) : '暂无数据';
      trEle.querySelector('.td-prize-second-add-num').innerText = data.prize[3].num || '暂无数据';
      trEle.querySelector('.td-prize-second-add-bonus').innerText = data.prize[3].singlebonus ? utils.formatMoney(data.prize[3].singlebonus) : '暂无数据';
      trEle.querySelector('.td-totalmoney').innerText = data.totalmoney ? utils.formatMoney(data.totalmoney) : '暂无数据';
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
    }
  },
  createTable(data) {
    //thead
    let theadEle = Array.from(document.querySelectorAll('.lottery-table-box thead'));
    if (Number(this.caipiaoid) === 11) {
      theadEle.forEach(item => {
        if (item.className.includes('ssq')) {
          utils.addClass(item, 'active');
        } else {
          utils.removeClass(item, 'active');
        }
      })
    } else if (Number(this.caipiaoid) === 14) {
      theadEle.forEach(item => {
        if (item.className.includes('dlt')) {
          utils.addClass(item, 'active');
        } else {
          utils.removeClass(item, 'active');
        }
      })
    }

    // tobdy
    let tbodyEle = document.querySelector('.lottery-table-box table tbody');
    let fragment = document.createDocumentFragment();
    data.forEach(item => {
      let trEle = this.createTrDom(item);
      fragment.appendChild(trEle);
    });
    tbodyEle.innerHTML = '';
    tbodyEle.appendChild(fragment);
  },
  getData() {
    $lottery.history(11, 30)
      .then(res => {
        this.createTable(res.data.data);
      })
  },
  initPagination(total, size) {
    const pageWrapperEle = document.querySelector('#pagination-wrapper');
    const cb = (page, size) => {
      $lottery.history(this.caipiaoid, size, page)
        .then(res => {
          this.createTable(res.data.data);
        })
        .catch(err => { })
    };
    this.pagination = new Pagination(pageWrapperEle, total, this.size, cb);
  },
};

page.init();