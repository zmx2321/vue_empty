<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="报表名称" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入报表名称" clearable size="small" style="width: 240px"
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="起止日期">
        <el-date-picker type="daterange" v-model="dateRange" size="small" style="width: 240px" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="起止时间">
        <el-date-picker type="datetimerange" class="long_wrap" v-model="dateRangeDatetime" size="small" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"  range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="activeName" @tab-click="changeTab">
      <!-- 我发起的 -->
      <el-tab-pane label="我发起的" name="launch">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5" v-if="showDel">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" class="del_btn"
              v-hasPermi="['report:table:remove']">删除</el-button>
            <!-- <el-button type="danger" plain size="mini" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['report:table:remove']">删除</el-button> -->
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="fq_caogao">草稿</el-button>
          </el-col>
          <el-col :span="1.5">
            <!-- <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['report:table:add']">进行中</el-button> -->
            <el-button type="primary" plain size="mini" @click="fq_jinxingzhong">进行中</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="fq_yiwanjie">已完结</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="fq_yichaoshi">已超时</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="fq_chaoshiwanjie">超时完结</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="fq_yichehui">已撤回</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 我填写的 -->
      <el-tab-pane label="我填写的" name="fillin">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="tx_yijieshou">已接收</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="tx_yitianxieweifs">已填写未发送</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="tx_yitianxieyifs">已填写已发送</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="tx_yituihui">已退回</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="tx_yiwanjie">已完结</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 我审核的 -->
      <el-tab-pane label="我审核的" name="examine">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="sh_weishenhe">未审核</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="sh_shenhechengong">审核成功</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" plain size="mini" @click="sh_shenheshibai">审核失败</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 公共按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['report:table:add']">新增</el-button>
      </el-col>
    </el-row>

    <el-button @click="goBack" style="position: absolute;right:28px;top:66px">返回</el-button>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" v-if="isShowSel" />
      <!-- <el-table-column label="businessId" align="center" prop="businessId" /> -->

      <el-table-column label="报表名称" align="center" prop="title" />

      <el-table-column label="创建人" align="center" prop="createBy" />
      <!-- <el-table-column label="修改人" align="center" prop="updateBy" /> -->

      <!-- <el-table-column label="提交人" align="center" prop="nickName" /> -->
      <!-- <el-table-column label="提交部门" align="center" prop="deptName" /> -->

      <el-table-column label="创建时间" align="center" prop="createTime" />
      <!-- <el-table-column label="修改时间" align="center" prop="updateTime" /> -->
      <el-table-column label="截止日期" align="center" prop="deadline" />
      <!-- <el-table-column label="流转状态" align="center" prop="label" /> -->

      <!-- 我发起的 -->
      <template v-if="activeName === 'launch'">
        <el-table-column label="修改时间" align="center" prop="updateTime" v-if="showDel" />
        <el-table-column label="总填写人数" align="center" prop="wCnt" v-if="isJxz" />
        <el-table-column label="填写完成人数" align="center" prop="fCnt" v-if="isJxz" />
        <el-table-column label="通过人数" align="center" prop="pCnt" v-if="isJxz" />
      </template>
      <!-- 我填写的 -->
      <template v-if="activeName === 'fillin'">
        <!-- <el-table-column label="我填写的报表名称" align="center" prop="title" /> -->
      </template>
      <!-- 我审核的 -->
      <template v-if="activeName === 'examine'">
        <!-- <el-table-column label="已审核次数" align="center" prop="cnt" v-if="yetExaim" /> -->
        <!-- <el-table-column label="提交时间" align="commitTime" prop="cnt" v-if="yetExaim" /> -->
      </template>

      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                                                                  v-hasPermi="['report:table:edit']"
                                                                  v-if="(scope.row.label==='我发起的_草稿') ||
                                                                  (scope.row.label==='我发起的_已撤回')">修改</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                                                                  v-hasPermi="['report:table:edit']"
                                                                  v-if="(scope.row.label==='草稿') ||
                                                                  (scope.row.label==='撤回')">修改</el-button> -->

          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                                                                    v-hasPermi="['report:table:remove']"
                                                                    v-if="(scope.row.label==='我发起的_草稿') ||
                                                                    (scope.row.label==='我发起的_已撤回')">删除</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                                                                    v-hasPermi="['report:table:remove']"
                                                                    v-if="(scope.row.label==='草稿') ||
                                                                    (scope.row.label==='撤回')">删除</el-button> -->

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleDetail(scope.row)"
                                                                v-hasPermi="['report:table:detail']"
                                                                v-if="(scope.row.label==='我发起的_草稿') ||
                                                                (scope.row.label==='我发起的_已撤回') ||
                                                                (scope.row.label==='我填写的_已接收') ||
                                                                (scope.row.label==='我填写的_已填写未发送') ||
                                                                (scope.row.label==='我填写的_已退回')">详情</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-key" @click="handleDetail(scope.row)"
                                                                v-hasPermi="['report:table:detail']"
                                                                v-if="(scope.row.label==='接收') ||
                                                                (scope.row.label==='草稿') ||
                                                                (scope.row.label==='撤回') ||
                                                                (scope.row.label==='创建') ||
                                                                (scope.row.label==='填写')">详情</el-button> -->

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleView(scope.row)"
                                                                v-hasPermi="['report:table:info']"
                                                                v-if="(scope.row.label==='我发起的_已完结') ||
                                                                (scope.row.label==='我发起的_超时完结') ||
                                                                (scope.row.label==='我填写的_已填写已发送') ||
                                                                (scope.row.label==='我填写的_已完结') ||
                                                                (scope.row.label==='我审核的_未审核') ||
                                                                (scope.row.label==='我审核的_审核失败') ||
                                                                (scope.row.label==='我审核的_审核成功')">查阅</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-key" @click="handleView(scope.row)"
                                                                v-hasPermi="['report:table:info']"
                                                                v-if="(scope.row.label==='审核') ||
                                                                (scope.row.label==='审核失败') ||
                                                                (scope.row.label==='审核成功') ||
                                                                (scope.row.label==='审核结束')">查阅</el-button> -->

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleRecall(scope.row)"
                                                                v-hasPermi="['report:table:recall']"
                                                                v-if="(scope.row.label==='我发起的_进行中') ||
                                                                (scope.row.label==='我发起的_已超时')">撤回</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-key" @click="handleRecall(scope.row)"
                                                                v-hasPermi="['report:table:recall']"
                                                                v-if="scope.row.label==='创建'">撤回</el-button> -->

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleRecord(scope.row)"
                                                                v-hasPermi="['report:table:info']"
                                                                v-if="(scope.row.label==='我发起的_进行中') ||
                                                                (scope.row.label==='我发起的_已完结') ||
                                                                (scope.row.label==='我发起的_已超时') ||
                                                                (scope.row.label==='我发起的_超时完结') ||
                                                                (scope.row.label==='我填写的_已接收') ||
                                                                (scope.row.label==='我填写的_已填写已发送') ||
                                                                (scope.row.label==='我填写的_已填写未发送') ||
                                                                (scope.row.label==='我填写的_已退回') ||
                                                                (scope.row.label==='我填写的_已完结')">流转记录</el-button>
          <!-- <el-button size="mini" type="text" icon="el-icon-key" @click="handleRecord(scope.row)"
                                                                v-hasPermi="['report:table:info']"
                                                                v-if="(scope.row.label!=='草稿') &&
                                                                      (scope.row.label!=='撤回')
                                                                ">流转记录</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="流转记录" :visible.sync="reportTreeVisible" width="96vw" append-to-body :close-on-click-modal="false">
      <g-6-tree ref="g6Ref" :params="reportTreeData" :treeWidth="treeWidth" :treeHeight="treeHeight" />
    </el-dialog>
  </div>
</template>

<script>
import { tableList, deltable, recalSubmit } from "@/api/manager/report";
import G6Tree from './components/g6Tree'

export default {
  name: "report",
  dicts: ['sys_normal_disable'],
  components: { G6Tree },
  data() {
    return {
      showDel: false,
      isShowSel: true,
      yetExaim: true,
      isJxz: false,
      /**
       * 新加
       */
      activeName: 'launch',  // launch(我发起的) fillin(我填写的) examine(我审核的)

      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      dateRangeDatetime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典名称不能为空", trigger: "blur" }
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur" }
        ]
      },
      reportTreeData: {},
      reportTreeVisible: false,
    };
  },
  computed: {
    treeWidth() {
      return window.innerWidth * 0.96
    },
    treeHeight() {
      return window.innerHeight * 0.83
    }
  },
  created() {
    this.initPage();
  },
  mounted() {

  },
  methods: {
    initPage() {
      // 判断
      // console.log(this.$route.query.leve1Txt)
      if(this.$route.query.leve1Txt) {
        let leve1Txt = JSON.parse(this.$route.query.leve1Txt)
        let { levelTxt1 } = leve1Txt
        let { levelTxt2 } = leve1Txt
        let { levelTxtLabel1 } = leve1Txt
        let { levelTxtLabel2 } = leve1Txt
        // console.log(levelTxt1, levelTxt2)
        // console.log(levelTxtLabel1)

        if(levelTxtLabel1 !== '我发起的') {
          this.isShowSel = false
        } else {
          this.isShowSel = true
        }

        // 进行中
        if(levelTxt2 === 'launch_btn1') {
          console.log(1)
          this.isJxz = true
        }

        // 样式
        this.getButtonList(item=> {
          // console.log(levelTxtLabel1)
          // console.log(levelTxtLabel2)
          if(item.innerText === levelTxtLabel2) {
            item.classList.add('factivity')
          }
        })

        this.activeName = levelTxt1  // 选项卡 - 父节点
        this.queryParams.filterBtn = levelTxt2  // 传参 - 渲染列表所需

        this.getList();
      } else {
        // console.log(this.$route.query)

        if(JSON.stringify(this.$route.query) === '{}') {
          this.queryParams.filterBtn = 'launch_btn5'

          this.getList();
        } else {
          let { activeName } = this.$route.query
          let { filterBtn } = this.$route.query
          let label1 = ''
          let label2 = ''

          this.activeName = activeName
          this.queryParams.filterBtn = filterBtn

          // launch(我发起的) fillin(我填写的) examine(我审核的)
          switch(activeName) {
            case 'launch':
              label1 = '我发起的'
              break
            case 'fillin':
              label1 = '我填写的'
              break
            case 'examine':
              label1 = '我审核的'
              break
          }
          console.log(filterBtn)

          switch(filterBtn) {
            case 'launch_btn5':
              label2 = '草稿'
              break
            case 'launch_btn1':
              label2 = '进行中'
              break
            case 'launch_btn2':
              label2 = '已完结'
              break
            case 'launch_btn3':
              label2 = '已超时'
              break
            case 'launch_btn4':
              label2 = '超时完结'
              break
            case 'launch_btn6':
              label2 = '已撤回'
              break
            case 'fillin_btn1':
              label2 = '已接收'
              break
            case 'fillin_btn2':
              label2 = '已填写未发送'
              break
            case 'fillin_btn3':
              label2 = '已填写已发送'
              break
            case 'fillin_btn4':
              label2 = '已退回'
              break
            case 'fillin_btn5':
              label2 = '已完结'
              break
            case 'examine_btn1':
              label2 = '未审核'
              break
            case 'examine_btn2':
              label2 = '审核成功'
              break
            case 'examine_btn3':
              label2 = '审核失败'
              break
          }

          this.getButtonList(item=> {
            // console.log(item.innerText)
            if(item.innerText === label2) {
              item.classList.add('factivity')
            }
          })
          this.getList();
        }
      }
    },

    // 返回
    goBack() {
      // this.$router.push(-1)
      // window.history.back(-1);
      this.$router.push('/report/repotrIndex')
    },

    changeTab(tab, event) {
      // console.log(tab, event.target.textContent);

      let { textContent } = event.target
      // this.tabValue = textContent

      if(textContent === '我发起的') {
        this.isShowSel = true
      } else {
        this.isShowSel = false
      }

      // this.removeClass()
    },

    getButtonList(next) {
      this.$nextTick(()=> {
        let buttonList = document.querySelector('.el-tabs__content').getElementsByTagName('button')

        buttonList.forEach(item=> {
          // console.log(item.innerText)

          next(item)
        })
      })
    },

    /** 查询字典类型列表 */
    getList() {
      this.addDateRangeSpec(this.queryParams, this.dateRange, "beginDate", "endDate")
      this.addDateRangeSpec(this.queryParams, this.dateRangeDatetime, "beginDateTime", "endDateTime")

      this.loading = true;
      tableList(this.queryParams).then(res => {
        // console.log(res)

        this.typeList = res.rows;
        this.total = res.total;
        this.loading = false;
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: undefined,
        dictName: undefined,
        dictType: undefined,
        status: "0",
        remark: undefined
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.dateRangeDatetime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$router.push({
        path: '/report/optionReport',
        query: {
          handleStatus: '新增报表'
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection)
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.removeClass()

      // console.log(row)
      this.$router.push({
        path: '/report/optionReport',
        query: {
          handleStatus: '修改报表',
          id: row.id,
          businessId: row.businessId,
          labelVal: row.labelVal,
          preId: row.preId,
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const tbids = row.id || this.ids;
      this.$modal.confirm('是否确认删除编号为"' + tbids + '"的数据项？').then(function () {
        console.log(tbids)
        return deltable(tbids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.removeClass()

      this.download('system/dict/type/export', {
        ...this.queryParams
      }, `type_${new Date().getTime()}.xlsx`)
    },

    /**
     * 自己加的按钮
     */
    // 详情
    handleDetail(row) {
      // console.log("详情", row)

      this.removeClass()

      this.$router.push({
        path: '/report/dicTable',
        query: {
          id: row.id,
          businessId: row.businessId,
          labelVal: row.labelVal,
          preId: row.preId,
          state: row.state,
          filterBtn: this.queryParams.filterBtn,
          activeName: this.activeName
        }
      })
    },
    // 撤回
    handleRecall(row) {
      this.removeClass()
      // console.log("撤回", row.target)

      // 如果存在事件对象，则为表格外按钮，则做筛选
      if(row.target) {
        this.queryParams.label = -1
      } else {
        // console.log(row.businessId)

        recalSubmit(row.id).then(()=> {
          this.$message.warning("撤回成功")
        }).catch(()=> {
          this.$message.warning("撤回失败")
        });
      }

      this.getList()
    },
    // 查阅
    handleView(row) {
      console.log(row)

      // console.log(this.queryParams.filterBtn)

      this.removeClass()
      // console.log(this.tabValue)
      // console.log(this.activeName)

      this.$router.push({
        path: '/report/viewDicTable',
        query: {
          id: row.id,
          businessId: row.businessId,
          preId: row.preId,
          labelVal: row.labelVal,
          state: row.state,
          filterBtn: this.queryParams.filterBtn,
          activeName: this.activeName
        }
      })
    },
    // 流转记录
    handleRecord(row) {
      this.removeClass()

      // console.log(row)
      this.reportTreeData = {
        id: row.preId,
        reportFormNameId: row.id,
      }

      let timer = setTimeout(()=> {
        // 第一次 undefind 但走子组件 初始化方法，并且树控件为空
        if(this.$refs.g6Ref) {
          // console.log(this.$refs.g6Ref)

          this.$refs.g6Ref.initPage()
        }

        this.reportTreeVisible = true

        clearTimeout(timer)
      }, 10)

      /* this.$router.push({
        path: '/report/reportRrcord',
        query: {
          id: row.preId,
          reportFormNameId: row.id,
        }
      }) */
    },

    /**
     * 表格外
     */
    removeClass() {
      // 移除所有指定class
      this.getButtonList(item=> {
        item.classList.remove('factivity')
      })
    },

    btnCommon() {
      this.removeClass()

      this.showDel = false
      this.isJxz = false

      this.getList();
    },

    /**我发起的 */
    // 进行中
    fq_jinxingzhong() {
      // console.log('进行中')

      this.queryParams.filterBtn = 'launch_btn1'

      this.btnCommon()

      this.isJxz = true
    },
    // 已完结
    fq_yiwanjie() {
      // console.log('已完结')

      this.queryParams.filterBtn = 'launch_btn2'

      this.btnCommon()
    },
    // 已超时
    fq_yichaoshi() {
      // console.log('已超时')

      this.queryParams.filterBtn = 'launch_btn3'

      this.btnCommon()
    },
    // 超时完结
    fq_chaoshiwanjie() {
      // console.log('超时完结')

      this.queryParams.filterBtn = 'launch_btn4'

      this.btnCommon()
    },
    // 草稿
    fq_caogao() {
      // console.log('草稿')

      this.queryParams.filterBtn = 'launch_btn5'

      this.btnCommon()

      this.showDel = true
    },
    // 已撤回
    fq_yichehui() {
      // console.log('已撤回')

      this.queryParams.filterBtn = 'launch_btn6'

      this.btnCommon()

      this.showDel = true
    },

    /**我填写的 */
    // 已接收
    tx_yijieshou() {
      // console.log('已接收')

      this.queryParams.filterBtn = 'fillin_btn1'

      this.btnCommon()
    },
    // 已填写未发送
    tx_yitianxieweifs() {
      // console.log('已填写未发送')

      this.queryParams.filterBtn = 'fillin_btn2'

      this.btnCommon()
    },
    // 已填写已发送
    tx_yitianxieyifs() {
      // console.log('已填写已发送')

      this.queryParams.filterBtn = 'fillin_btn3'

      this.btnCommon()
    },
    // 已退回
    tx_yituihui() {
      // console.log('已退回')

      this.queryParams.filterBtn = 'fillin_btn4'

      this.btnCommon()
    },
    // 已完结
    tx_yiwanjie() {
      // console.log('已完结')

      this.queryParams.filterBtn = 'fillin_btn5'

      this.btnCommon()
    },

    /**我审核的 */
    // 未审核
    sh_weishenhe() {
      console.log('未审核')

      this.yetExaim = false

      this.queryParams.filterBtn = 'examine_btn1'

      this.btnCommon()
    },
    // 审核成功
    sh_shenhechengong() {
      console.log('审核成功')

      this.yetExaim = true

      this.queryParams.filterBtn = 'examine_btn2'

      this.btnCommon()
    },
    // 审核失败
    sh_shenheshibai() {
      console.log('审核失败')

      this.yetExaim = true

      this.queryParams.filterBtn = 'examine_btn3'

      this.btnCommon()
    },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs {
  // height: 54px;

  .el-tabs__content {
    // position: relative;
    // left: 82px;
    z-index: 99999;
    overflow: initial;

    .del_btn {
      position: absolute;
      top: 36px;
      left: 86px;
    }
  }
}

.factivity {
    background: #1890ff;
    border-color: #1890ff;
    color: #FFFFFF;
}

::v-deep .el-dialog {
  // background: #f00;

  .el-dialog__body {
    padding: 0;
    // margin-top: -8px;
    margin-top: -53px;
  }
}
</style>
