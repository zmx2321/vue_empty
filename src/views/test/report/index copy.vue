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

    <el-tabs v-model="activeName">
      <!-- 我发起的 -->
      <el-tab-pane label="我发起的" name="launch">
        <el-row :gutter="10" class="mb8">
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
            <el-button type="primary" plain size="mini" @click="fq_caogao">草稿</el-button>
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

    <!-- 公告按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['report:table:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['report:table:remove']">删除</el-button>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['report:table:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['report:table:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleAll" v-hasPermi="['report:table:remove']">全部</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleLaunch" v-hasPermi="['report:table:remove']">我发起的</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleFillin" v-hasPermi="['report:table:remove']">我填写的</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleExamine" v-hasPermi="['report:table:remove']">我审核的</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleRecall" v-hasPermi="['report:table:recall']">撤回</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain size="mini" @click="handleFinish" v-hasPermi="['report:table:remove']">已完成</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="businessId" align="center" prop="businessId" /> -->

      <el-table-column label="报表名称" align="center" prop="title" />

      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="修改人" align="center" prop="updateBy" />

      <el-table-column label="提交人" align="center" prop="nickName" />
      <el-table-column label="提交部门" align="center" prop="deptName" />

      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="修改时间" align="center" prop="updateTime" />
      <el-table-column label="截止日期" align="center" prop="deadline" />
      <el-table-column label="流转状态" align="center" prop="label" />

      <!-- 我发起的 -->
      <template v-if="activeName === 'launch'">
        <el-table-column label="我发起的报表名称" align="center" prop="title" />
      </template>
      <!-- 我填写的 -->
      <template v-if="activeName === 'fillin'">
        <el-table-column label="我填写的报表名称" align="center" prop="title" />
      </template>
      <!-- 我审核的 -->
      <template v-if="activeName === 'examine'">
        <el-table-column label="我审核的报表名称" align="center" prop="title" />
      </template>

      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                                                                  v-hasPermi="['report:table:edit']"
                                                                  v-if="(scope.row.label==='草稿') ||
                                                                  (scope.row.label==='撤回')">修改</el-button>

          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                                                                    v-hasPermi="['report:table:remove']"
                                                                    v-if="(scope.row.label==='草稿') ||
                                                                    (scope.row.label==='撤回')">删除</el-button>

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleDetail(scope.row)"
                                                                v-hasPermi="['report:table:detail']"
                                                                v-if="(scope.row.label==='接收') ||
                                                                (scope.row.label==='草稿') ||
                                                                (scope.row.label==='撤回') ||
                                                                (scope.row.label==='创建') ||
                                                                (scope.row.label==='填写')">详情</el-button>

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleView(scope.row)"
                                                                v-hasPermi="['report:table:info']"
                                                                v-if="(scope.row.label==='审核') ||
                                                                (scope.row.label==='审核失败') ||
                                                                (scope.row.label==='审核成功') ||
                                                                (scope.row.label==='审核结束')">查阅</el-button>

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleRecall(scope.row)"
                                                                v-hasPermi="['report:table:recall']"
                                                                v-if="scope.row.label==='创建'">撤回</el-button>

          <el-button size="mini" type="text" icon="el-icon-key" @click="handleRecord(scope.row)"
                                                                v-hasPermi="['report:table:info']"
                                                                v-if="(scope.row.label!=='草稿') &&
                                                                      (scope.row.label!=='撤回')
                                                                ">流转记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="流转记录" :visible.sync="reportTreeVisible" width="80vw" append-to-body :close-on-click-modal="false">
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
      return window.innerWidth * 0.779
    },
    treeHeight() {
      return window.innerHeight * 0.750
    }
  },
  created() {
    this.initPage();
  },
  methods: {
    initPage() {
      this.getList();

      // 判断
      if(this.$route.query.currentActive) {
        this.activeName = this.$route.query.currentActive
      }
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
      // console.log(row)
      this.$router.push({
        path: '/report/optionReport',
        query: {
          handleStatus: '修改报表',
          id: row.id,
          businessId: row.businessId
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

      this.$router.push({
        path: '/report/dicTable',
        query: {
          id: row.id,
          businessId: row.businessId,
          labelVal: row.labelVal,
          preId: row.preId
        }
      })
    },
    // 撤回
    handleRecall(row) {
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
      // console.log(row)

      this.$router.push({
        path: '/report/viewDicTable',
        query: {
          id: row.id,
          businessId: row.businessId,
          labelVal: row.labelVal,
          preId: row.preId
        }
      })
    },
    // 流转记录
    handleRecord(row) {
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
    /**我发起的 */
    // 进行中
    fq_jinxingzhong() {
      console.log('进行中')
    },
    // 已完结
    fq_yiwanjie() {
      console.log('已完结')
    },
    // 已超时
    fq_yichaoshi() {
      console.log('已超时')
    },
    // 超时完结
    fq_chaoshiwanjie() {
      console.log('超时完结')
    },
    // 草稿
    fq_caogao() {
      console.log('草稿')
    },
    // 已撤回
    fq_yichehui() {
      console.log('已撤回')
    },

    /**我填写的 */
    // 已接收
    tx_yijieshou() {
      console.log('已接收')
    },
    // 已填写未发送
    tx_yitianxieweifs() {
      console.log('已填写未发送')
    },
    // 已填写已发送
    tx_yitianxieyifs() {
      console.log('已填写已发送')
    },
    // 已退回
    tx_yituihui() {
      console.log('已退回')
    },
    // 已完结
    tx_yiwanjie() {
      console.log('已完结')
    },

    /**我审核的 */
    // 未审核
    sh_weishenhe() {
      console.log('未审核')
    },
    // 审核成功
    sh_shenhechengong() {
      console.log('审核成功')
    },
    // 审核失败
    sh_shenheshibai() {
      console.log('审核失败')
    },

    // // 全部
    // handleAll() {
    //   // console.log("全部")
    //   // console.log(this.queryParams)

    //   // 配置筛选项
    //   this.queryParams.label = undefined

    //   this.getList();
    // },
    // // 我发起的
    // handleLaunch() {
    //   console.log("我发起的")

    //   // 配置筛选项
    //   this.queryParams.label = 1

    //   this.getList();
    // },
    // // 我填写的
    // handleFillin() {
    //   console.log("我填写的")

    //   // 配置筛选项
    //   this.queryParams.label = 3

    //   this.getList();
    // },
    // // 我审核的
    // handleExamine() {
    //   console.log("我审核的")

    //   // 配置筛选项
    //   this.queryParams.label = 5

    //   this.getList();
    // },
    // // 已完成
    // handleFinish() {
    //   console.log("已完成")

    //   // 配置筛选项
    //   this.queryParams.label = 7

    //   this.getList();
    // },
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs {
  height: 54px;

  .el-tabs__content {
    left: 168px;
    z-index: 99999;
  }
}
</style>
