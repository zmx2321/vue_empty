<template>
  <section class="main_cont">
    123456
    <div id="chart0" class="chart_wrap"></div>
  </section>
</template>

<script>
export default {
  components: {
  },

  data() {
    return {
      ROOT_PATH: 'https://fastly.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data-gl/asset/data/buildings.json',
      chartData: null
    }
  },

  computed: {
    chartDom() {
      return document.getElementById('chart0')
    },
    chartOption() {
      return {}
    },
  },

  methods: {
    async initChart() {
      let aa = await this.getData()
      this.$echarts.registerMap('nh', aa);
      let myChart = this.$echarts.init(this.chartDom);

      myChart.setOption({
        // globe:{    // 地球组件
        //   environment: '#000'
        // },
        // geo:{     // 地理坐标系组件【需要下载地图】
        //   show:true,
        //   itemStyle:{
        //     borderWidth: 4,
        //     borderColor: "#ff0"
        //   }
        // },
        // xAxis3D:{    // 坐标系
        //   show:true
        // },

        series: [{
          type: 'map3D',            // 3D地图
          map: 'nh',                // registerMap的key
          environment: '#020E24',      // 背景色
          groundPlane: {            // 显示地面
            show: true,
          },
          instancing: true,          // 合并geometry，提高效率
          itemStyle: {               // 图形的样式
            color: '#0C3972',
            borderWidth: 3,
            opacity: 0.5,
            borderColor: '#3DB4DC'
          },
          emphasis: {                // 鼠标悬浮的样式
            label: {
              show: true,
              // distance:30,
              formatter: (params) => {   //标签格式化
                return params.name
              },
              textStyle: {
                color: '#fff'
              }
            }
          },
          shading: 'lambert'
        }]
      })

      this.chartOption && myChart.setOption(this.chartOption);
    },

    getData() {
      return new Promise((resolve, reject) => {
        this.axios.get(this.ROOT_PATH).then(res => {
          resolve(res.data)
        }).catch(err => {
          reject(err)
        })
      })
    },

    async resolveData() {
      let aa = await this.getData()
      console.log(aa)
    },

    initPage() {
      // this.resolveData()
    }
  },

  mounted() {
    this.initChart()
  },

  created() {
    this.initPage()
  }
}
</script>

<style lang="less" scoped>
.main_cont {
  padding: 0;
  .chart_wrap {
    width: 500px;
    height: 500px;
    background: #ff0;
  }
}
</style>