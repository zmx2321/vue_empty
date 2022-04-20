<template>
  <!-- 弹窗 -->
  <el-dialog title="数据收集情况" :close-on-click-modal="false" :visible.sync="dataCollectVisible" append-to-body>
    <el-tabs tab-position="left" v-model="tabValue" @tab-click="setCollectData">
      <el-tab-pane :label="item.label" v-for="(item, index) in sideBarList" :key="index" :name="item.label">
        <!-- 内容 -->
        <info-detail ref="infoDetailRef" :dataInfoLabel="item.label" v-if="tabValue === item.label" />
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import InfoDetail from './InfoDetail'

import { getSideBarList } from '@/api/dataCollect'

export default {
  components: {
    InfoDetail
  },

  data () {
    return {
      dataCollectVisible: true,
      tabValue: "",

      sideBarList: [
        {
          id: '1',
          label: '门店铺位营收数据'
        },
        {
          id: '26',
          label: '服务区营收数据'
        },
        {
          id: '3',
          label: '人流量'
        },
        {
          id: '4',
          label: '车流量'
        },
      ]
    }
  },

  props: {
    /* url: {
      type: String,
      default: ''
    }, */
  },

  methods: {
    initPage() {
      this.tabValue = this.sideBarList[0].label

      // 获取侧栏数据
      getSideBarList().then(res=> {
        console.log(res)

        // this.sideBarList = []
      })
    },

    showData() {
      this.dataCollectVisible = true
    },

    setCollectData(tab) {
      // console.log(tab.name)
      // this.tabValue = this.sideBarList[0].label

      this.sideBarList.forEach(item=> {
        if(item.label === tab.label) {
          // 传值
          let timer = setTimeout(()=> {
            this.$refs.infoDetailRef.forEach(refItem=> {
              if(refItem.dataInfoLabel === item.label) {
                refItem.setDetail(item.id)  // 遍历ref，执行子组件方法，并传值给子组件
              }
            })

            setTimeout(timer)
          }, 0)
        }
      })
    },
  },

  created() {
    this.initPage()
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  // width: 65%;

  .el-dialog__header {
    padding: 0;
    height: 35px;
    background: #bfbfbf;
    margin-bottom: 10px;

    .el-dialog__title {
      line-height: 35px;
      padding-left: 20px;
      font-size: 16px;
      font-weight: bold;
    }

    .el-dialog__headerbtn {
      top: 8px;
    }
  }

  .el-dialog__body {
    padding: 0;

    .el-tabs {
      .el-tabs__header {
        background: #ededed;
        min-height: 444px;
      }

      .el-tabs__content {
        width: 80%;
        padding-left: 25px;

        .el-tabs {
          .el-tabs__header {
            min-height: initial;
            background: initial;
          }

          .el-tabs__content {
            width: initial;
            padding: 0;
          }
        }
      }
    }
  }
}
</style>
