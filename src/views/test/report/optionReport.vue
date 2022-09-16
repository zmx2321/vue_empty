<template>
  <section class="app-container test1">
    <el-button @click="saveTable" style="float:right" :loading="saveBtnFlag">保存</el-button>
    <el-button @click="linkEdit" style="float:right;margin-right:10px" v-if="curtPageName === '修改报表' || curtPageName === '模板复用'">预览</el-button>

    <el-form :model="tableParams.reportFormName" ref="reportFormNameRef" :rules="reportFormNameRules" :inline="true" label-width="100px">
      <el-form-item label="表头" prop="title">
        <el-input v-model="tableParams.reportFormName.title" placeholder="请输入表头" clearable size="small" />
      </el-form-item>
      <el-form-item label="截止日期" prop="deadline">
        <el-date-picker
          v-model="tableParams.reportFormName.deadline"
          align="right"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input type="textarea" v-model="tableParams.reportFormName.remark" placeholder="请输入说明" clearable size="small" maxlength="30" style="width: 500px" />
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增列</el-button>
        <el-button type="primary" plain size="mini" @click="saveAsModel" v-if="curtPageName === '修改报表'">{{ modelBtnMsg }}</el-button>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="5" class="filed_item" v-for="(item, index) in tableParams.reportFormColumnList" :key="index">
        <el-form :model="item" :inline="true" ref="reportFormColumnRef" :rules="reportFormColumnRules" label-width="92px">
          <el-form-item label="输入项名称" prop="name">
            <el-input v-model="item.name" placeholder="请输入输入项名称" clearable size="small" />
          </el-form-item>
          <el-form-item label="输入项类型" prop="attribute">
            <el-select v-model="item.attribute" placeholder="请选择输入项类型">
              <el-option v-for="dict in dict.type.report_form_column_type" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="字典" prop="dataDictionaryType" v-if="item.attribute==='2'">
            <el-select v-model="item.dataDictionaryType" placeholder="请选择字典">
              <el-option v-for="(dic, dicIndex) in dictList" :key="dicIndex" :label="dic.dictName" :value="dic.dictType" />
            </el-select>
          </el-form-item>
          <el-form-item class="form_btn" >
            <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleDel(item)">删除列</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { listType } from "@/api/system/dict/type";
import { tableAdd, tableEdit, tabledColDetail, copyTable, tabModel } from "@/api/manager/report";

export default {
  name: "optionReport",

  dicts: ['report_form_column_type'],

  data() {
    return {
      // common
      curtPageName: this.$route.query.handleStatus,
      editId: this.$route.query.id,
      editBusinessId: this.$route.query.businessId,
      labelVal: this.$route.query.labelVal,
      preId: this.$route.query.preId,
      modelBtnMsg: '存为常用模板',

      saveBtnFlag: false,

      // 表格
      tableParams: {
        reportFormName: {},
        reportFormColumnList: []
      },

      dictList: [],

      theadFlag: true,
      thdataFlag: true,

      // 验证reportFormNameRules
      reportFormNameRules: {
        title: [
          { required: true, message: '表格标题不能为空', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '表格说明不能为空', trigger: 'blur' },
        ],
      },

      // 验证 reportFormColumnRules
      reportFormColumnRules: {
        name: [
          { required: true, message: '字段名称不能为空', trigger: 'blur' },
        ],
        attribute: [
          { required: true, message: '字段类型不能为空', trigger: 'blur' },
        ],
        dataDictionaryType: [
          { required: true, message: '字典不能为空', trigger: 'blur' },
        ]
      },

      // 新增列
      addFormVisible: false,

      // 列索引
      colIndex: 1
    }
  },

  computed: {
    curtPage() {
      return (this.curtPageName == null || this.curtPageName == '') ? "操作报表" : this.curtPageName
    }
  },

  methods: {
    /**
     * tools
     */
    // 对象数组根据对象属性删除
    removeByValue(arr, value) {
      for(var i in arr){
        if(arr[i].index === value) {
          arr.splice(i,1);
        }
      }
    },

    // 修改面包屑标题
    setBread() {
      let breadlist = this.$route.meta.breadcrumbList

      let lastItem = breadlist[breadlist.length-1]

      lastItem.title = this.curtPage
    },

    // 页面加载操作
    initPage() {
      this.getDictList()  // 获取字典列表
      this.setBread()  // 修改面包屑标题
      this.getEditInfo()  // 获取编辑详情
    },

    // 跳转
    linkEdit() {
      // console.log("跳转", this.$route.query)

      let { businessId, id, labelVal, preId } = this.$route.query

      this.$router.push({
        path: '/report/dicTable',
        query: {
          id,
          businessId,
          labelVal,
          preId,
          current: 'preview'
        }
      })
    },

    /**
     * api
     */
    // 获取编辑详情
    getEditInfo() {
      // 只有修改报表时才触发
      // console.log(this.curtPage)
      if(this.curtPage === "修改报表" || this.curtPage === "模板复用") {
        // id为空时返回
        if(this.editId == null) {
          this.$message.warning("编辑时id不能为空")
          this.$router.back()
          return
        }

        // id在先
        tabledColDetail(this.editId, this.editBusinessId).then(res=> {
          // console.log(res)

          let { data } = res
          // console.log(data)

          let { reportFormColumnList } = data;
          // console.log(reportFormColumnList)

          reportFormColumnList.forEach((item, i)=> {
            item.index = i+1
          })

          this.tableParams = {
            reportFormName: {
              id: parseInt(this.editId),  // 编辑时需要
              title: data.title,
              remark: data.remark,
              deadline: data.deadline
            },
            reportFormColumnList
          }
        })
      }
    },

    // 获取字典列表
    getDictList() {
      listType().then(response => {
        this.dictList = response.rows;
      });
    },

    /**
     * 业务
     */
    // 新增
    handleAdd() {
      // console.log("新增列")

      let end = this.tableParams.reportFormColumnList[this.tableParams.reportFormColumnList.length-1]
      // console.log(end)

      if(end) {
        // console.log(end)

        this.colIndex = end.index + 1
      }

      this.tableParams.reportFormColumnList.push({
        index: this.colIndex++,
        name: "",
        attribute: "1",  // 默认文本框
      })
    },
    // 删除
    handleDel(val) {
      // console.log("删除列", val, this.tableParams)

      this.removeByValue(this.tableParams.reportFormColumnList, val.index)
    },

    // 校验
    checkFormRules() {
      // 验证头
      this.$refs.reportFormNameRef.validate(valid=> {
        this.theadFlag = valid
      })

      // 如果表格基本属性验证未通过
      if(!this.theadFlag) {
        return
      }

      // 表格列基本判断
      if(this.tableParams.reportFormColumnList.length === 0) {
        this.$message.warning("表格列不能为空")
        return
      }

      // 验证内容
      let truthArr = []
      this.$refs.reportFormColumnRef.forEach(item=> {
        item.validate(valid=> {
          truthArr.push(valid)
        })
      })
      truthArr.forEach(item=> {
        // 只要有一个为false
        if(!item) {
          this.thdataFlag = false
        } else {
          this.thdataFlag = true
        }
      })

      if(this.theadFlag && this.thdataFlag) {
        return true
      }

      return false
    },

    // 保存
    saveTable() {
      // 校验
      let ckflag = this.checkFormRules()

      // 如果校验通过
      if(ckflag) {
        // console.log(this.tableParams.reportFormColumnList)

        this.saveBtnFlag = true

        this.tableParams.reportFormColumnList.forEach(item=> {
          // 不为下拉框时，没有字典
          if(item.attribute !== "2") {
            item.dataDictionaryType = undefined
          }
        })

        // console.log(this.tableParams.reportFormColumnList)
        // console.log(this.tableParams)

        // this.saveBtnFlag = false  // 用作测试

        // req公共方法
        const reqCommon = msg=> {
          this.$message.success(`报表${msg}成功`)
          this.saveBtnFlag = false

          this.$router.push('/report/index');
        }

        // 请求 - 箭头函数没有this
        let _this = this
        const askReq = {
          add(next) {
            // console.log('新增')
            tableAdd(_this.tableParams).then(()=> {
              next()
            }).catch()
          },
          edit(next) {
            // console.log('编辑', _this.tableParams)
            tableEdit(_this.tableParams).then(()=> {
              next()
            }).catch()
          },
          repeat(next) {
            console.log('复用')
            copyTable(_this.tableParams).then(()=> {
              next()
            }).catch()
          }
        }

        switch(this.curtPage) {
          case '新增报表':
            askReq.add(()=> {
              // console.log('回调 新增报表')
              reqCommon('新增')
            })
            break
          case '修改报表':
            askReq.edit(()=> {
              // console.log('回调 修改报表')
              reqCommon('修改')
            })
            break
          case '模板复用':
            askReq.repeat(()=> {
              // console.log('回调 模板复用')
              reqCommon('模板复用')
            })
            break
        }
      }
    },

    // 存为常用模板
    saveAsModel() {
      // console.log('存为常用模板')

      let params = {
        id: this.editId,
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
  },

  created() {
    this.initPage()
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.filed_item {
  position: relative;
  min-height:255px;
  margin-right: 10px;
  border: solid 1px #efefef;
  margin-bottom: 10px;

  .el-form {
    margin: 20px 0 0 20px;

    .form_btn {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
}
</style>
