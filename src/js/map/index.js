import './china'
import echarts from 'echarts'


var mydata = [
  { name: '北京', value: 2 },
  { name: '天津', value: 13 },
  { name: '上海', value: 1 },
  { name: '重庆', value: 1 },
];
export default {
  options: {
    backgroundColor: '#FFFFFF',
    title: {
      text: '一等奖分布',
      subtext: '',
      x: 'center'
    },
    tooltip: {
      trigger: 'item'
    },

    //左侧小导航图标
    visualMap: {
      show: true,
      x: 'right',
      y: 'center',
      splitList: [
        {
          start: 101,
          end: 1000,
        },
        {
          end: 100,
          start: 11,
        },
        {
          end: 10,
          start: 1,
        },
        {
          start: 0,
          end: 0,
        },
      ],
      color: ['#85daef', '#f33636', '#e6ac53', '#9fb5ea']
    },

    //配置属性
    series: [{
      name: '一等奖注数',
      type: 'map',
      mapType: 'china',
      roam: true,

      scaleLimit: { //滚轮缩放的极限控制
        min: 1,
        max: 2
      },

      label: {
        normal: {
          show: false  //省份名称  
        },
        emphasis: {
          show: false
        }
      },
      data: []  //数据
    }]
  },
  init(ele, data) {
    if (!ele) return null;
    this.options.series[0].data = data;
    const myChart = echarts.init(ele);
    myChart.setOption(this.options);
  },
};