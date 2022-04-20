<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from '@/utils/mixins/resize'

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
      default: '350px'
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
    dataInfoLabel: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      chart: null,
      barWidth: 16,
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
      console.log(this.dataInfoLabel)
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
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions({ fieldData, y1Data, y2Data } = {}) {
      this.chart.setOption(
        // option-start
        {
          tooltip: {},
          title: {
            text: this.dataInfoLabel,
            top: 15,
            textStyle: {
              color: '#000',
              fontSize: 18,
              fontWeight: '400',
            }
          },
          legend: {
            itemGap: 50,
            top: "10%"
          },
          grid: {
            left: '1.8%',
            right: '3%',
            bottom: '1%',
            height: '68%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: fieldData
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '当月',
              type: 'bar',
              barGap: 0,
              barWidth: this.barWidth,
              emphasis: {
                focus: 'series'
              },
              itemStyle: {
                    color: '#0090FF'
                  },
              data: y1Data
            },
            {
              name: '去年同月',
              type: 'bar',
              barWidth: this.barWidth,
              itemStyle: {
                    color: '#FF6F00'
                  },
              emphasis: {
                focus: 'series'
              },
              data: y2Data
            }
          ]
        }
        // option-end
      )
    }
  }
}
</script>
