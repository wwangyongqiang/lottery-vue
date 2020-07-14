import '../css/reset.css'
import '../css/head.scss'
import '../css/chart.scss'

import Select from '../js/components/select'
import { nameToId } from '../js/data/id'
import $lottery from '../js/http/lottery'
import echarts from 'echarts'
import utils from './components/utils'

let page = {
  caipiaoid: 0,
  issuenoNum: 0,
  chartContent: '',
  chart: null,
  init() {
    this.initSelect();
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
          this.renderChart(res.data.data);
        })
        .catch(err => { });
    }

  },

  renderChart(userData) {
    const chartEle = document.querySelector('#chart-box');
    const myChart = echarts.init(chartEle);
    const saleamoountData = userData.map(item => Number(item.bigprizenum));
    const issuenoData = userData.map(item => item.issueno);
    // 绘制图表
    let option = {
      title: {
        text: '图表'
      },
      xAxis: {
        type: 'category',
        data: issuenoData
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter (value) {
            return utils.formatMoney(value);
          }
        },
        // min: function (value) {
        //   return value.min;
        // },
      },
      tooltip: {
        trigger: 'axis',
        padding: 16, 
        formatter(params) {
          let data = params[0];
          return `第${data.axisValue}期<br><br>${data.seriesName}：${utils.formatMoney(data.value)}`;
        },

      },
      series: [{
        name: '销售额',
        type: 'line',
        data: saleamoountData,
        markLine: {
          data: [{
            type: 'average',
            name: '平均值'
          }],
        },

      }]
    };
    myChart.setOption(option);
  }

};

page.init();