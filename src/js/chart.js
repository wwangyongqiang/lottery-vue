import '../css/reset.css'
import '../css/head.scss'
import '../css/chart.scss'

import Select from '../js/components/select'
import { nameToId } from '../js/data/id'
import $lottery from '../js/http/lottery'
import echarts from 'echarts'
import chartOptions from './chart_option'
import authentication from './authentication'

let page = {
  caipiaoid: 0,
  issuenoNum: 0,
  chartContent: '',
  myChart: null,
  init() {
    this.initSelect();
    this.initUser();
  },

  initSelect() {
    const lotterySelectEle = document.querySelector('#lottery-select');
    const issuenoSelectEle = document.querySelector('#issueno-select');
    const contentSelectEle = document.querySelector('#content-select');

    // content select
    let contentData = [
      {
        value: 'saleamount',
        text: '销售额',
      },
      {
        value: 'totalmoney',
        text: '奖池总额',
      },
      {
        value: 'bigprizenum',
        text: '一等奖注数',
      },
    ];
    const contentCallback = (contentValue, contentText) => {
      this.chartContent = contentValue;
      this.getDataFromServer();
    }

    let contentSelect = new Select(contentSelectEle, contentData, contentCallback);
    contentSelect.init();

    // type select
    let lotteryData = [];
    for (let key in nameToId) {
      lotteryData.push({
        value: nameToId[key],
        text: key,
        current: nameToId[key] == '11' ? true : false,
      });
    }
    const lotteryCallback = (caipiaoidValue, text) => {
      this.caipiaoid = caipiaoidValue;
      this.getDataFromServer();
    }
    const selectLottery = new Select(lotterySelectEle, lotteryData, lotteryCallback);
    selectLottery.init();

    // issueno select
    let issuenoData = [
      {
        value: '30',
        text: '30期',
      },
      {
        value: '50',
        text: '50期',
      },
      {
        value: '100',
        text: '100期',
      },
      {
        value: 'all',
        text: '全部',
      },
    ];
    const issuenoCallback = (value, text) => {
      this.issuenoNum = value;
      this.getDataFromServer();
    }
    const selectIssueno = new Select(issuenoSelectEle, issuenoData, issuenoCallback);
    selectIssueno.init();
  },

  getDataFromServer() {
    if (this.caipiaoid && this.chartContent && this.issuenoNum) {
      $lottery.chart(this.caipiaoid, this.chartContent, this.issuenoNum)
        .then(res => {
          this.renderChart(res.data.result);
        })
        .catch(err => { });
    }
  },

  renderChart(userData) {
    
    if (!this.myChart) {
      const chartEle = document.querySelector('#chart-box');
      this.myChart = echarts.init(chartEle);
    }
    console.log(userData)
    const xAxisData = userData.data.xAxisData;
    const yAxisData = userData.data.yAxisData;
    let type = userData.type;
    console.log(type)
    let userOption = chartOptions[type];
    console.log(userOption)
    userOption.title.text = userData.title;
    userOption.xAxis.data = xAxisData;
    userOption.series[0].data = yAxisData;
    

    this.myChart.setOption(userOption);
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
};

page.init();