<template>
  <section class="app-container">
    <div class="detail_info">
      <ul>
        <li>表格标题: {{ tableinfo.title }}</li>
        <li>截止时间: {{ tableinfo.deadline }}</li>
        <li>表格说明: {{ tableinfo.remark }}</li>
      </ul>
    </div>

    <el-row :gutter="10" class="mb8"  style="float: left;margin-top: 5px;">
      <div class="btn_wrap" v-if="labelVal === 4">
        <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="reviewSuccess" :disabled="multiple" v-hasPermi="['report:table:remove']">通过并发回建表人审核</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="mini" @click="reviewSend" :disabled="multiple" v-hasPermi="['report:table:remove']">通过并继续转发审核</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" plain size="mini" @click="reviewFail" :disabled="multiple" v-hasPermi="['report:table:remove']">不通过并退回给填写人</el-button>
        </el-col>
      </div>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="globalInfo.downTable('/report/tableData/export', exportData, 'post')">导出</el-button>
      </el-col>
    </el-row>

    <!-- 右按钮 -->
    <el-button @click="goBack" style="float:right;margin-bottom:10px;margin-left:18px">返回</el-button>

    <el-table :data="tableData" v-loading="listLoading" @selection-change="getSelection" :span-method="fixTable">
      <el-table-column type="selection" width="55" align="center" v-if="labelVal === 4"></el-table-column>
      <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
      <el-table-column label="业务编号" align="center" prop="businessId" v-if="onlyView"></el-table-column>
      <el-table-column label="提交人" align="center" prop="nickName" v-if="onlyView"></el-table-column>
      <el-table-column label="提交部门" align="center" prop="deptName" v-if="onlyView"></el-table-column>
      <el-table-column label="提交时间" align="center" prop="examineTime" v-if="($route.query.filterBtn === 'examine_btn1')||($route.query.filterBtn === 'examine_btn2')||($route.query.filterBtn === 'examine_btn3')"></el-table-column>

      <!-- 成功/失败 -->
      <el-table-column label="审核时间" align="center" prop="examineTime" v-if="($route.query.filterBtn === 'examine_btn2')||($route.query.filterBtn === 'examine_btn3')"></el-table-column>
      <!-- 失败 -->
      <el-table-column label="不通过意见" align="center" prop="failOpinion" v-if="$route.query.filterBtn === 'examine_btn3' "></el-table-column>

      <el-table-column v-for="(item, index) in columns" :key="`${index}`" v-bind="item" align="center">
        <template slot-scope="{row}">
          <span v-if="item.attr.attribute==='1' || item.attr.attribute==='2'">{{ row[item['prop']] }}<!-- {{row}} --></span>
          <div class="file_wrap" v-else v-html="getFileValue(row, item)"></div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 保存并发送 -->
    <el-dialog :title="dialogTreeTitle" :close-on-click-modal="false" :visible.sync="sendVisible" width="550px" append-to-body>
      <!-- 表单 -->
      <send-table-dialog ref="sendTable"  :subStatus="subStatus" :reviewStatus="reviewStatus" :businessIdArr="businessIdArr"
                                          @hideVisible="hideVisible" @flushPage="initPage" />
    </el-dialog>
  </section>
</template>

<script>
import { tabledColDetail, tabledRecDetail, reviewSuccessSubmit  } from "@/api/manager/report";

// import BaseTable from './BaseTable/index_exp.vue'  // 表格控件
import sendTableDialog from './components/sendTableDialog.vue'  // 保存

import * as utils from '@/utils/utils'  // 工具

export default {
  name: "viewDicTable",

  components: { /* BaseTable, */ sendTableDialog },

  data () {
    return {
      /**
       * common
       */
      // 状态
      onlyView: true,  // 只读
      spanArr: [],//用于存放每一行记录的合并数

      // 传参
      queryId: this.$route.query.id,
      queryBusinessId: this.$route.query.businessId,
      preId: this.$route.query.preId,
      labelVal: parseInt(this.$route.query.labelVal), // 流转状态值

      // 作用于表格相关状态数据
      listLoading: true,  // 表格列loading
      colid: "valid_",  // 字段id前缀
      multiple: true,  // 非多个禁用

      // 表格数据
      tableinfo: {},
      selection: [],  // 表格选中项
      columns: [],  // 表格列数据
      tableData: [],  // 表格数据
      exportData: {},  // 导出参数

      /**
       * dialog
       */
      sendVisible: false,  // 保存发送界面

      /**
       * 树
       */
      dialogTreeTitle: "",  // 树弹出框标题
      subStatus: "",  // 发送接口状态（单选 single 多选 multiple)
      reviewStatus: "",  // 单选中需要判断类型  审核状态 success fail
      businessIdArr: [],  // 查阅业务id集合
    }
  },

  methods: {
    /**
     * tools
     */
    // 初始化页面
    initPage() {
      this.tableData = []
      this.columns = []

      // 处理初始化数据
      this.resolveInitData()

      // 获取动态表格数据
      this.getDicTableColData()

      // 表格记录
      this.getDicTableRecData()
    },
    // 处理初始化数据
    resolveInitData() {
      // 获取导出参数
      this.exportData = {
        businessId: this.queryBusinessId,
        id: this.queryId,
        labelVal: this.labelVal,
      }
    },
    // 校验
    judgePage(next) {
      // if(!this.queryId || !this.queryBusinessId) {
      if(!this.queryId) {
        next()

        return false
      } else {
        return true
      }
    },
    // dialog1 - 保存并发送
    hideVisible() {
      this.sendVisible = false
    },
    // 弹窗并调用子组件方法 - 树
    initSendComponent() {
      this.sendVisible = true

      // 发送接口状态（单选 single）
        this.subStatus = "single"

      // 调用子组件方法 - 在弹窗中需要使用异步
      let timer = setTimeout(()=>{
        this.$refs.sendTable.initPage()

        clearTimeout(timer)
      }, 0)
    },
    // 获取业务id集合
    getBusinessIds() {
      let businessIdArr = []

      this.selection.forEach(item=> {
        if(item.businessId) {
          businessIdArr.push(`${item.businessId}_${item.preId}`)
        }
      })

      this.businessIdArr = utils.uniqueArr(businessIdArr)
    },
    // 读取路径
    getFileValue(row, item) {
      let url = row[item['prop']]
      let tp = ""

      // 如果有地址
      if(url) {
        if(utils.isAssetTypeAnImage(utils.getFileprefix(url))) {
          // 图片
          // console.log(url)
          tp = `<img src='${url}' style="width:100px;height:100px" />`
        } else {
          // 文件
          // console.log(url)
          tp = `<a target="_blank" href='${url}'>点击下载</a>`
        }
      }

      return tp
    },
    // 返回
    goBack() {
      // this.$router.push(-1)
      // window.history.back(-1);

      // console.log(this.$route.query)

      this.$router.push({
        path: '/report/index',
        query: {
          filterBtn: this.$route.query.filterBtn,
          activeName: this.$route.query.activeName,
        }
      })
    },

    /**
     * 表格操作
     */
    // 表格操作
    getSpanArr(data) {
      // console.log(data)

      // data就是我们从后台拿到的数据
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].businessId === data[i - 1].businessId) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
        // console.log(this.spanArr);
      }
    },
    // 合并 label
    fixTable({ rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 1) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        // console.log(`rowspan:${_row} colspan:${_col}`);
        return {
          // [0,0] 表示这一行不显示， [2,1]表示行的合并数
          rowspan: _row,
          colspan: _col
        };
      }
    },

    /**
     * api toole
     */
    // 表格列
    getDicTableColData() {
      /* let id = this.$route.query.id  // 9
      let businessId = this.$route.query.businessId  // "20211202103513121322" */

      // 校验
      this.isHasIdFlag = this.judgePage(()=> {
        this.$message.warning("没有报表id，无法生成表格！")
        this.$router.push('/report/index')
      })
      // console.log(this.isHasIdFlag)

      // 校验
      // 如果不存在跳出方法
      if(!this.isHasIdFlag) {
        return
      }

      tabledColDetail(this.queryId, this.queryBusinessId).then(res=> {
        // console.log("view页面表格列", res)

        this.listLoading = false

        let { data } = res

        if(!data) {
          this.$message.warning("没有表格列数据或没有权限，请联系管理员")
          this.$router.push('/report/index')
          return
        }

        let { reportFormColumnList } = data
        // console.log(reportFormColumnList)

        this.tableinfo = {
          title: data.title,
          deadline: data.deadline,
          remark: data.remark,
        }

        // 渲染表格
        this.tableRender(reportFormColumnList)
      })
    },
    // 表格记录
    getDicTableRecData() {
      let id = this.$route.query.id
      let labelVal = this.$route.query.labelVal
      let filterBtn = this.$route.query.filterBtn

      let urlstr = `?id=${id}&labelVal=${labelVal}&filterBtn=${filterBtn}`

      // 校验
      // 如果不存在跳出方法
      if(!this.isHasIdFlag) {
        return
      }

      tabledRecDetail(urlstr).then(res=> {
        // console.log("view页面表格行", res)

        this.tableData = res.rows
        // console.log("行", this.tableData)
        // console.log("列", this.columns)

        this.getSpanArr(this.tableData)
      })
    },
    // 字典
    setDict(key) {
      return new Promise((resolve, reject)=> {
        this.getDicts(key).then(res=> {
          // console.log(res)

          let arr = []

          res.data.forEach(item=> {
            arr.push({
              label: item.dictLabel,
              value: item.dictCode
            })
          })

          resolve(arr)
        }).catch(err=> {
          reject(err)
        })
      })
    },

    /**
     * 业务
     */
    // 渲染表格
    tableRender(reportFormColumnList) {
      // console.log(reportFormColumnList)
      // this.columns.push(inputCol)

      reportFormColumnList.forEach(async item=> {
        // console.log("123", item)

        // 输入框
        let inputCol = {
          prop: this.colid+item.id,
          label: item.name,
          attr: {
            attribute: item.attribute,
            onlyView: true
          }
        }

        // 下拉框
        let selectCol = {
          prop: this.colid+item.id,
          label: item.name,
          attr: {
            attribute: item.attribute,
            colid: this.colid+item.id,
            dictlist: item.dataDictionaryType == null ? undefined : await this.setDict(item.dataDictionaryType),
            onlyView: true
          }
        }

        // 文件
        let fileCol = {
          prop: this.colid+item.id,
          label: item.name,
          attr: {
            attribute: item.attribute,
            onlyView: true
          }
        }

        switch(item.attribute) {
          // 输入框
          case '1':
            this.columns.push(inputCol)
            break
          // 下拉框
          case '2':
            this.columns.push(selectCol)
            break
          // 文件
          case '3':
            this.columns.push(fileCol)
        }
      })
    },
    // 获取选中项
    getSelection(val) {
      // console.log("获取选中项", val)

      this.multiple = !val.length

      this.selection = val
    },
    // 审核公共方法
    reviewBtnCommon() {
      this.getBusinessIds()
      // console.log(this.businessIdArr)

      // 弹窗并调用子组件方法
      this.initSendComponent()
    },
    // 审核成功
    reviewSuccess() {
      // console.log("审核成功", this.selection)

      this.getBusinessIds()  // 业务id

      let params = {
        reportFormNameId: this.$route.query.id,
        businessIds: this.businessIdArr,
        preId: this.preId,
      }
      // console.log(params)

      this.$confirm('确认审核成功？').then(() => {
        reviewSuccessSubmit(params).then(()=> {
          this.$message.success("审核成功")

          this.initPage()
        }).catch(()=> {
          this.$message.warning("审核失败")
        })
      }).catch(() => {});
    },
    // 审核并发送
    reviewSend() {
      // console.log("审核并发送", this.selection)

      // 审核公共方法
      this.reviewBtnCommon()

      this.dialogTreeTitle = "审核并发送"

      this.reviewStatus = "success"

      // this.initPage()
    },
    // 审核失败
    reviewFail() {
      // console.log("审核失败", this.selection)

      // 审核公共方法
      this.reviewBtnCommon()

      this.dialogTreeTitle = "审核失败并填写原因"

      this.reviewStatus = "fail"
    },
  },

  created() {
    // 初始化页面
    this.initPage()
  }
}
</script>

<style lang="scss" scoped>
@import "./scss/report.scss";

.btn_wrap {
  display: inline;
}

::v-deep .el-table {


  thead {


    th.el-table_1_column_2, th.el-table_1_column_3, th.el-table_1_column_4, th.el-table_1_column_5 {
      .cell {
        color: #000;
      }
    }
  }
}
</style>
