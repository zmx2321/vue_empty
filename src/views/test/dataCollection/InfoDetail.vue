<template>
  <el-tabs v-model="tabValue">
    <el-tab-pane label="数据分析" name="数据分析">
      <div id="chartContent" class="chart_cont">
        <data-collect-chart ref="chartRef" :dataInfoLabel="dataInfoLabel" :chart-data="dataCollectChartData" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="数据列表" name="数据列表">
      <!-- 搜索 -->
      <div class="search_wrap">
        <el-date-picker
          v-model="collectDate"
          type="daterange"
          range-separator="至"
          start-placeholder="选择起始时间"
          end-placeholder="选择结束时间"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getQueryDate" />

        <div class="btn_wrap">
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button type="primary" plain @click="resetQuery">重置</el-button>
        </div>
      </div>

      <el-table :data="collectTabelData">
        <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
        <el-table-column prop="date" label="日期"> </el-table-column>
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
          class="f-fr pagination"
          v-show="page_arg.total>0"
          :current-page.sync='page_arg.page_index'
          :layout="page_arg.layout"
          :total="page_arg.total"
          @current-change='handleCurrentChange'
          @size-change='handleSizeChange' />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getSideBarList } from '@/api/dataCollect'

import DataCollectChart from './DataCollectChart'

export default {
  data () {
    return {
      // 分页参数
      page_arg: {
        page_index: 1, // 当前位于哪页
        total: 1, // 总数
        layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },

      tabValue: "数据分析",
      dataCollectChartData: {
        fieldData: ['2012', '2013', '2014', '2015', '2016'],
        y1Data: [320, 332, 301, 334, 390],
        y2Data: [220, 182, 191, 234, 290]
      },
      collectDate: [],
      collectTabelData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },

  components: {
    DataCollectChart
  },

  props: {
    dataInfoLabel: {
      type: String,
      default: ''
    },
  },

  methods: {
    /**
     * 接口
     */
    // 获取图表数据
    getChartData(params) {
      return new Promise((resolve, reject)=> {
        getSideBarList(params).then(res=> {
          resolve(res.data)
        }).catch(err=> {
          reject(err)
        })
      })
    },

    // 获取表格数据
    getTableList(params) {
      return new Promise((resolve, reject)=> {
        getSideBarList(params).then(res=> {
          resolve(res.data)
        }).catch(err=> {
          reject(err)
        })
      })
    },

    /**
     * 业务
     */
    // 父组件执行事件,传值id,调接口,主入口方法
    async setDetail(dataInfoId) {
      console.log("数据id", dataInfoId, this.dataInfoLabel)

      this.tabValue = "数据分析"

      // 调接口
      // ...
      let chartData = await this.getChartData()
      let tabelData = await this.getTableList()

      // 设置图表数据
      this.setChart(chartData)

      // 设置表格数据
      this.setTabel(tabelData)
    },

    // 设置图表数据
    setChart(chartData) {
     /*  this.dataCollectChartData = {
        fieldData: [],
        y1Data: [],
        y2Data: []
      } */

      let timer = setTimeout(()=> {
        chartData.forEach(item=> {
          /* this.dataCollectChartData.fieldData.push(item.xx)
          this.dataCollectChartData.y1Data.push(item.xx)
          this.dataCollectChartData.y2Data.push(item.xx) */
        })
        this.$refs.chartRef.resetChart()

        clearTimeout(timer)
      }, 0)
    },

    // 设置表格数据
    setTabel(tabelData) {
      // this.collectTabelData = []
    },

    /**
     * table
     */
    // 时间选择器
    getQueryDate(val) {
      // console.log(val)

      if(val) {
        this.queryParams.startTime = val[0]  // 开始时间
        this.queryParams.endTime = val[1]
      } else {
        this.queryParams.startTime = undefined
        this.queryParams.endTime = undefined
      }
    },
    // 点击页码
    handleCurrentChange(pageNum) {
      // console.log("点击页码", pageNum)

      this.queryParams.pageNum = pageNum
      this.getTableList()
    },
    // 设置每页条数
    handleSizeChange(pageSize) {
      // console.log("设置每页条数", page_size)

      this.queryParams.pageSize = pageSize
      this.getTableList()
    },
    // 查询
    handleQuery() {
      console.log(this.queryParams)

      // this.getTableList(this.queryParams)
    },
    // 重置
    resetQuery() {
      this.collectDate = []
    },
  },
}
</script>

<style lang="scss" scoped>
.search_wrap {
  margin-bottom: 26px;

  .btn_wrap {
    display: inline;
    margin-left: 88px;
  }
}

.el-table {
  margin-bottom: 20px;
  max-height: 255px;
  overflow-y: auto;
}
</style>
