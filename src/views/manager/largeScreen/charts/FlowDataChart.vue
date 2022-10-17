<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import * as echarts from "echarts";
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100px'
    },
    chartFontColor: {
      type: String,
      default: '#000'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    },
    txtFontSize: {
      type: Number,
      default: 15
    },
  },
  data() {
    return {
      chart: null,
      legendItem: 8,
      titleTxt: {
        color: "#fff",
        fontSize: 12,
        align: "center",
        fontWeight: 400
      },
      borderWidth: 3,
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    // 初始化图表
    resetChart() {
      // console.log("初始化图表", this.chart)
      // 图表不存在跳出
      if (!this.chart) {
        return
      }

      // 销毁图表
      this.chart.dispose()
      this.chart = null

      // 重新启动图表
      this.initChart()
    },
    initChart() {
      // console.log(echarts)
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ fieldData } = {}) {
      this.chart.setOption(
        // option-start
        {
          tooltip: {
            trigger: 'item',
            textStyle: {
              color: '#fff',
              fontSize: 10,
            },
          },
          title: {
            text: "今日入区",
            subtext: "车型分析",
            left: "31.5%",
            top: "38.5%",
            textAlign: "center",
            textStyle: this.titleTxt,
            subtextStyle: this.titleTxt
          },
          legend: {
            orient: 'vertical',
            itemGap: 15,  // 间距
            itemWidth: this.legendItem,
            itemHeight: this.legendItem,
            icon: "rect",
            top: 0,
            bottom: 0,
            right: 0,
            padding: [30, 25],
            height: '100%',
            textStyle: {
              color: '#fff',
              fontSize: '10px'
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              left: 0,
              radius: ['65%', '80%'], // 两值的差就是饼图的宽，第一个是内部饼图直径，第二个是外部饼图的直径，因为外部饼图没有数据展示为空，所以形成了圆环
              center: ['33%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: '#173669',
                borderWidth: this.borderWidth
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false
              },
              data: fieldData
            },
            /* {
              name: '',
              type: 'pie',
              left: 0,
              radius: ['50%', '65%'], // 两值的差就是饼图的宽，第一个是内部饼图直径，第二个是外部饼图的直径，因为外部饼图没有数据展示为空，所以形成了圆环
              center: ['33%', '50%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderColor: '#173669',
                borderWidth: this.borderWidth
              },
              label: {
                show: false,
              },
              labelLine: {
                show: false
              },
              data: fieldData
            }, */
          ]
        }
        // option-end
      )
    }
  }
}
</script>