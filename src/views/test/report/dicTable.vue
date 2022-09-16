<template>
  <section class="app-container">
    <div class="detail_info">
      <ul>
        <li>表格标题: {{ tableinfo.title }}</li>
        <li>截止时间: {{ tableinfo.deadline }}</li>
        <li>表格说明: {{ tableinfo.remark }}</li>
      </ul>
    </div>

    <!-- 左按钮 -->
    <!-- <el-row class="mb8" style="float: left;margin-top: 5px;" v-if="labelVal === 0 || labelVal === -1 "> -->
    <el-row class="mb8" style="float: left;margin-top: 5px;">
      <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增行</el-button>
      <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDelete" :disabled="multiple">删除行</el-button>
    </el-row>

    <!-- 右按钮 -->
    <el-button @click="goBack" style="float:right;margin-bottom:10px;margin-left:18px">返回</el-button>
    <el-button @click="sendTable" style="float:right;margin-bottom:10px;margin-left:18px" :loading="saveBtnFlag" v-if="labelVal !== 3">转发填写</el-button>
    <el-button @click="saveAsModel" style="float:right;margin-bottom:10px;margin-left:18px" v-if="current === 'preview'">{{ modelBtnMsg }}</el-button>

    <!-- 【草稿：0】【撤回：-1】进入详情后，不展示按钮【保存】【保存并发送审核】 -->
    <div class="save_btn_wrap" v-if="labelVal!==0 && labelVal !== -1 && labelVal !== 1">
      <el-button @click="saveTableAndReview" style="float:right;margin-bottom:10px;margin-left:18px" :loading="saveBtnFlag">保存并发送审核</el-button>
      <el-button @click="saveTable" style="float:right;margin-bottom:10px" :loading="saveBtnFlag">保存</el-button>
    </div>

    <!-- 表格 -->
    <base-table :columns="columns" :data="tableData" :listLoading="listLoading"
                @getFile="getFile" @delfile="delfile" @getSelection="getSelection" @handleDelete="handleDelete" @showEditUpload="showEditUpload" />


    <!-- 保存并发送 -->
    <el-dialog :title="dialogTreeTitle" :close-on-click-modal="false" :visible.sync="sendVisible" width="550px" append-to-body>
      <!-- 表单 -->
      <send-table-dialog ref="sendTable" :subStatus="subStatus"
                                          @hideVisible="hideVisible" @flushPage="flushPage" />
    </el-dialog>

    <!-- 编辑文件 -->
    <!-- <el-dialog title="编辑文件" :close-on-click-modal="false" :visible.sync="editFileVisible" width="500px">
      <option-upload :fileList='fileListEdit'
                      @getFile="getFile" @delfile="delfile" />

      <div class="edfile_wap">
        <el-button type="primary" @click="editFileSubmit()">提交</el-button>
        <el-button @click="editFileVisible = false">取 消</el-button>
      </div>
    </el-dialog> -->
  </section>
</template>

<script>
import { dictableSubmit, tabledRecDetail, tabledColDetail, tabModel } from "@/api/manager/report";

import BaseTable from './BaseTable/index.vue'  // 表格控件
import sendTableDialog from './components/sendTableDialog.vue'  // 保存
import optionUpload from './components/optionUpload.vue'  // 上传

export default {
  name: "editTable",

  components: {
    BaseTable,
    sendTableDialog,
    optionUpload
  },

  data () {
    return {
      /**
       * common tools
       */
      multiple: true,  // 非多个禁用
      saveBtnFlag: false,  // 保存按钮loading
      isHasIdFlag: false,  // 是否含有id（查询行列）
      labelVal: parseInt(this.$route.query.labelVal), // 流转状态值
      state: this.$route.query.state,

      modelBtnMsg: '存为常用模板',

      // 父级传参
      queryId: this.$route.query.id,
      queryBusinessId: this.$route.query.businessId,
      preId: this.$route.query.preId,
      current: this.$route.query.current,

      /**
       * 表格相关
       */
      // 页面显示文件列表 - 用于显示 - 弹窗
      fileListEdit: [
        // {name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'},
        // {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}
      ],
      fileListSave: [],  // 文件列表 - 用于提交
      tableinfo: {},  // 表格说明
      filerow: "",  // 文件列名

      // 作用于表格相关数据
      listLoading: true,  // 表格列loading
      columns: [],  // 表格列数据
      tableData: [],  // 表格数据

      // 表格数据
      colid: "valid_",  // 字段id前缀
      fileprefix: "fileData_",  // 字段id前缀
      dicList: [],  // 字典列表
      selection: [],  // 表格选中项

      tablerecode: 1,  // 行号，索引

      /**
       * dialog
       */
      sendVisible: false,  // 保存发送界面
      editFileVisible: false,  // 编辑上传文件界面

      /**
       * 树
       */
      dialogTreeTitle: "",  // 树弹出框标题
      subStatus: "",  // 发送接口状态（单选 single 多选 multiple)
    }
  },

  computed: {
  },

  mounted() {

  },

  methods: {
    /**
     * tools
     */
    // 初始化页面
    initPage() {
      this.tableData = []
      this.columns = []

      // 获取动态表格数据
      this.getDicTableColData()

      // 表格记录
      this.getDicTableRecData()

      // 预览
      if(this.current === 'preview') {
        console.log(this.$route.query)
      }
      // if queryId
    },
    // 返回
    goBack() {
      // this.$router.push(-1)
      // window.history.back(-1);

      this.$router.push({
        path: '/report/index',
        query: {
          filterBtn: this.$route.query.filterBtn,
          activeName: this.$route.query.activeName,
        }
      })
    },
    // 删除提示
    delInfo(done) {
      this.$confirm('确认删除文件？').then(() => {
        done();
      }).catch(() => {});
    },
    // 文件限制
    handleExceed() {
      this.$message.warning("只能上传一个文件")
    },
    // 对象数组根据对象属性删除文件
    removefileByValue(arr, value) {
      for(var i in arr){
        if(arr[i].file.uid === value) {
          arr.splice(i,1);
        }
      }
    },
    // 对象数组根据对象属性删除字段
    removeColByValue(arr, value) {
      // console.log(arr, value)
      for(var i in arr){
        if(arr[i].index === value) {
          arr.splice(i,1);
        }
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
    // 处理数据 - 校验
    resolveTabData() {
      // console.log("处理数据", this.tableData, this.fileListSave)

      let rocordFlagArr = []  // 表格记录校验集合

      this.tableData.forEach((item, i)=> {
        // 对象属性个数
        let objLength = Object.keys(item).length

        // 如果item里面的index字段存在，且item对象中只有一个属性
        if(item.index && objLength === 1) {
          // 记录
          rocordFlagArr.push(false)
        }

        // 如果item对象中不止一个属性，但值均为空
        if(item.index && objLength !== 1) {
          // 遍历对象，判断对象中所有值，但要除去index
          // 除了index，如果其余属性值都为空，则删除
          // 即对象中如果只有一个属性有值，则删除

          // 判断行
          if(item.index === i+1) {
            // 计数器，判定对象中属性值非空的数量
            let objAttrNum = 0;
            Object.keys(item).filter(v=> {
              // !item[v] 有值为false，没有值为true，至少有两个false，当前行才能判定正确
              // 取反，即至少两个true才正确
              if(item[v]) {
                objAttrNum ++
              }
            })
            // console.log(objAttrNum)
            if(objAttrNum>=2) {
              // 记录成功
              rocordFlagArr.push(true)
            } else {
              // 只要有一次判定，则为失败
              rocordFlagArr.push(false)
            }
            // console.log(rocordFlagArr)
          }
        }
      })
      // console.log(rocordFlagArr)
      // console.log(rocordFlagArr.indexOf(false))

      if(rocordFlagArr.indexOf(false) === -1) {
        return true
      } else {
        return false
      }
    },
    // dialog1 - 保存并发送
    hideVisible() {
      this.sendVisible = false
    },
    // dialog2 - 编辑上传的文件
    showEditUpload(dataObj) {
      // console.log("编辑上传的文件page", dataObj)

      this.delInfo(()=> {
        // console.log("删除")

        this.filerow = dataObj.col.attr.fileprefix + dataObj.row.index + "_" + dataObj.col.attr.filecolid
        // console.log(this.filerow)

        // 删除文件
        this.delfile()
      })

      /* this.filerow = dataObj.col.attr.fileprefix + dataObj.row.index + "_" + dataObj.col.attr.filecolid

      this.fileListEdit = []

      // 判断当前列，并把地址提取出来
      let curCol = dataObj.col.attr.filecolid

      // 遍历行，提取
      for(let item in dataObj.row) {
        // console.log(item)

        // 匹配提取
        if(item.indexOf(curCol) !== -1) {
          // console.log(dataObj.row[item])

          // this.fileListEdit.push(dataObj.row[item])
          this.fileListEdit.push({
            name: dataObj.col.prop,
            url: dataObj.row[item]
          })
        }
      }

      this.editFileVisible = true */
    },
    // 提交编辑文件
    editFileSubmit() {
      console.log(this.fileListSave)

      this.editFileVisible = false
    },
    // 弹窗并调用子组件方法 - 树
    initSendComponent() {
      this.sendVisible = true

      // 调用子组件方法 - 在弹窗中需要使用异步
      let timer = setTimeout(()=>{
        this.$refs.sendTable.initPage()

        clearTimeout(timer)
      }, 0)
    },
    // 子组件点保存后操作
    flushPage() {
      this.initPage()

      this.$router.push('/report/index')
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
      // console.log(this.queryBusinessId)

      // 校验
      // 如果不存在跳出方法
      if(!this.isHasIdFlag) {
        return
      }

      // 表格列接口
      tabledColDetail(this.queryId, this.queryBusinessId).then(res=> {
        // console.log(res)

        this.listLoading = false

        let { data } = res
        // console.log(data)
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
      let id = this.$route.query.id  // 9
      let businessId = this.$route.query.businessId  // "20211202103513121322"
      let filterBtn = this.$route.query.filterBtn

      let urlstr = `?businessId=${businessId}&id=${id}&filterBtn=${filterBtn}`

      // 校验
      // 如果不存在跳出方法
      if(!this.isHasIdFlag) {
        return
      }

      // 表格记录接口
      tabledRecDetail(urlstr).then(res=> {
        // console.log(res.rows)

        this.tableData = res.rows
        // console.log(this.tableData)
        this.tableData.forEach((item, i)=> {
          item.index = i+1
        })
        // console.log(this.tableData)
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
    // 提交表格接口
    saveSubmit(next) {
      // 保存前做数据处理
      let saveFlag = this.resolveTabData()
      // console.log(saveFlag)

      if(!saveFlag) {
        this.$message.warning("每行至少有一个输入项")
        return
      }

      this.saveBtnFlag = true

      let formData = new FormData();
      formData.append('reportFormDataList', JSON.stringify(this.tableData));
      formData.append('businessId', this.queryBusinessId);
      formData.append('reportFormNameId', this.queryId);
      formData.append('preId', this.preId);
      // console.log(this.dicData.fileData)

      this.fileListSave.forEach(item=> {
        formData.append(item.fileName, item.file);
      })

      // 获取所有值
      /* for (let keys of formData.values()) {
        console.log("遍历formData", keys);
      } */

      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      // 保存
      // this.saveBtnFlag = false
      dictableSubmit(formData, config).then(()=> {
        // console.log(res)

        // 初始化
        this.initPage()

        // 保存成功后操作
        next()
      }).catch({}).finally(()=> {
        this.saveBtnFlag = false
      })
    },
    // 存为常用模板
    saveAsModel() {
      // console.log('存为常用模板')

      let params = {
        id: this.queryId,
        modelType: '1'
      }

      if(this.modelBtnMsg === '存为常用模板') {
          params.modelType = '1'
      } else {
        params.modelType = '0'
      }
      // console.log(params)

      tabModel(params).then(res=> {
        // console.log(res)

        let { data } = res
        // console.log(data)

        switch (data) {
          case 0:
            this.modelBtnMsg = '存为常用模板'
            break
          case 1:
            this.modelBtnMsg = '取消常用模板'
            break
        }

        if(data === 0) {
        }
      })

      // let status

      /* if(status) {
        console.log(1)
        this.modelBtnMsg = '存为常用模板'
        status = true
      } else {
        console.log(2)
        this.modelBtnMsg = '取消常用模板'
        status = true
      } */
    },

    /**
     * 业务
     */
    // 渲染表格
    tableRender(reportFormColumnList) {
      // this.columns = []
      // this.tableData = []

      reportFormColumnList.forEach(async item=> {
        // console.log("123", item)

        // 输入框
        let inputCol = {
          prop: this.colid+item.id,
          label: item.name,
          attr: {
            attribute: item.attribute,
          }
        }

        // 下拉框
        let selectCol = {
          prop: this.colid+item.id,
          label: item.name,
          attr: {
            attribute: item.attribute,
            dataDictionaryType: item.dataDictionaryType,
            dictlist: item.dataDictionaryType == null ? undefined : await this.setDict(item.dataDictionaryType),
          }
        }

        // 文件
        let fileCol = {
          prop: this.colid+item.id,
          label: item.name,
          attr: {
            attribute: item.attribute,
            filecolid: item.id,
            fileprefix: this.fileprefix
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
            break;
        }
      })

      // 测试，默认添加一条
      // this.handleAdd()
    },
    // 新增行
    handleAdd() {
      // console.log("新增行", this.tableData.length)
      // console.log(this.tableData)

      let end = this.tableData[this.tableData.length-1]

      if(end) {
        // console.log(end)

        this.tablerecode = end.index + 1
      }
      // console.log(this.tablerecode)

      this.tableData.push({
        index: this.tablerecode++
      })
    },
    // 获取选中项
    getSelection(val) {
      // console.log("获取选中项", val)

      this.multiple = !val.length

      this.selection = val
    },
    // 删除行
    handleDelete(row) {
      // console.log(row, this.fileListSave)

      /**
       * 删除的时候，要把当前行的文件一起删除
       * 即删除fileListSave数组中的值
       *
       * 点击删除的时候，要根据row值判断行，然后和fileListSave中的行作比较，匹配则删除，因为是删除行，所以列不用作判断
       *
       * 提交的地方删除之后，页面显示也要进行删除
       */
      // 单个删除
      if(row.index) {
        this.fileListSave.forEach((item)=> {
          // 自己新增的时候，判断删除
          if(row.index === parseInt(item.fileName.split("_")[1])) {
            // console.log(item, index)

            this.fileListSave.splice(index, 1)
          }
        })

        this.removeColByValue(this.tableData, row.index)
      } else {
        // 批量删除
        // console.log(this.selection)

        this.selection.forEach((rowItem, rowIndex)=> {
          this.fileListSave.forEach((item)=> {
            // 自己新增的时候，判断删除
            if(rowItem.index === parseInt(item.fileName.split("_")[1])) {
              // console.log(item, index)

              this.fileListSave.splice(rowIndex, 1)
            }
          })

          this.removeColByValue(this.tableData, rowItem.index)
        })
      }

      // console.log(row, this.fileListSave)
    },
    // 获取文件
    getFile(val) {
      // console.log("获取文件", val, this.tableData, this.fileListSave)

      if(!val.fileName) {
        // 如果没有值，表示为弹窗
        val.fileName = this.filerow
      }

      // 如果有值，存入数组
      this.fileListSave.push(val)
    },
    // 删除文件
    delfile(val) {
      // console.log("删除文件page", val, this.fileListSave, this.tableData, this.filerow)

      // 判断当前文件所在表格位置
      let filePosition = this.filerow.split("_")

      // 在提交数据中删除
      this.tableData.forEach(item=> {
        // 判断行
        if(item.index === parseInt(filePosition[1])) {
          // console.log(item)

          // 遍历行，提取列
          for(let j in item) {
            // 匹配提取
            if(j.indexOf(filePosition[2]) !== -1) {
              // console.log("sss", item[j])
              item[j] = undefined
            }
          }
        }
      })
      // console.log(this.tableData)

      // 对象数组根据对象属性删除文件
      this.removefileByValue(this.fileListSave, val)
    },
    // 保存
    saveTable() {
      // console.log("保存")

      // 提交表格接口
      this.saveSubmit(()=> {
        this.$message.success("保存成功！")
      })
    },
    // 保存并发送审核
    saveTableAndReview() {
      // console.log("保存并发送")
      // this.saveTable()

      // 提交表格接口
      this.saveSubmit(()=> {
        this.dialogTreeTitle = "保存并发送审核（单选）"

        // 发送接口状态（单选 single）
        this.subStatus = "single"

        // 弹窗并调用子组件方法
        this.initSendComponent()
      })
    },
    // 发送填写
    sendTable() {
      this.dialogTreeTitle = "发送填写（多选）"

      // 发送接口状态（多选 multiple）
      this.subStatus = "multiple"

      // 弹窗并调用子组件方法
      this.initSendComponent()
    }
  },

  created() {
    this.initPage()

    // this.sendTable()
    // this.saveTableAndReview()
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>
@import "./scss/report.scss";

.edfile_wap {
  margin-top: 22px;
}

.save_btn_wrap {
  display: inline;
}
</style>
