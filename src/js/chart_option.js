import utils from './components/utils'

const saleamount = {
  title: {
    text: '销售额',
    left: 'center',
    top: '10px'
  },
  xAxis: {
    name: '期数',
    type: 'category',
    data: [],
  },
  yAxis: {
    name: '销售额',
    type: 'value',
    axisLabel: {
      formatter(value) {
        return utils.formatMoney(value);
      }
    },
  },
  dataZoom: [
    {
      type: 'slider'
    },
    {
      type: 'inside'
    }
  ],
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
    data: [],
    markLine: {
      label: {
        formatter: params => utils.formatMoney(params.value),
      },
      data: [
        {
          name: '最大值',
          type: 'max'
        },
      ],
    },
  }]
};

const totalmoney = {
  title: {
    text: '奖池奖金',
    left: 'center',
    top: '10px'
  },
  xAxis: {
    name: '期数',
    type: 'category',
    data: [],
  },
  yAxis: {
    name: '奖池奖金',
    type: 'value',
    axisLabel: {
      formatter(value) {
        return utils.formatMoney(value);
      }
    },
  },
  dataZoom: [
    {
      type: 'slider'
    },
    {
      type: 'inside'
    }
  ],
  tooltip: {
    trigger: 'axis',
    padding: 16,
    formatter(params) {
      let data = params[0];
      return `第${data.axisValue}期<br><br>${data.seriesName}：${utils.formatMoney(data.value)}`;
    },
  },
  series: [{
    name: '奖池奖金',
    type: 'line',
    data: [],
  }]
};

const bigprizenum = {
  title: {
    text: '一等奖注数',
    left: 'center',
    top: '10px'
  },
  xAxis: {
    name: '期数',
    type: 'category',
    data: [],
  },
  yAxis: {
    name: '注数',
    type: 'value',
    axisLabel: {
      formatter(value) {
        return value + '注';
      }
    },
  },
  dataZoom: [
    {
      type: 'slider'
    },
    {
      type: 'inside'
    }
  ],
  tooltip: {
    trigger: 'axis',
    padding: 16,
    formatter(params) {
      let data = params[0];
      return `第${data.axisValue}期<br><br>${data.seriesName}：${data.value}注`;
    },
  },
  series: [{
    name: '一等奖注数',
    type: 'line',
    data: [],
  }]
};

export default {
  saleamount,
  totalmoney,
  bigprizenum
}