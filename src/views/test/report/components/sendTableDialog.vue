<template>
  <el-form :model="sendData" status-icon :rules="sendRules" ref="sendForm" label-width="80px">
    <el-form-item label="人员选择" v-if="reviewStatus !== 'fail'">
      <el-checkbox v-model="treeExpand" @change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
      <el-checkbox v-model="treeNodeAll" @change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
      <el-tree
        class="tree-border"
        :class="{ single_tree: subStatus==='single' }"
        :data="treeData"
        show-checkbox
        node-key="id"
        ref="sendTree"
        highlight-current
        empty-text="加载中，请稍后"
        @check="handleCheckChange"
        :props="defaultProps">
      </el-tree>
    </el-form-item>

    <el-form-item label="原因" prop="remark" v-else>
      <el-input type="textarea" v-model="sendData.remark" placeholder="请输入不通过意见" clearable size="small" maxlength="30" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="sendSubmit('sendForm')" :loading="submitBtnFlag">提交</el-button>
      <el-button @click="sendCancel('sendForm')">取 消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { treeDeptAndUser } from "@/api/system/dept";
import {
  reviewTableSubmit,  // 发送审核
  sendTableSubmit,  // 发送填写
  reviewSuccessSubmit,  // 发送成功审核
  reviewFailSubmit,  // 发送失败审核
} from "@/api/manager/report";

export default {
  name: "sendTableDialog",

  components: {
  },

  props: {
    // 发送接口状态（单选 single 多选 multiple）
    subStatus: {
      type: String,
      default: ""
    },
    // 单选中需要判断类型  审核状态 success fail
    reviewStatus: {
      type: String,
      default: ""
    },
    // 业务id集合
    businessIdArr: {
      type: Array,
      default: () => []
    },
  },

  data () {
    return {
      /**
       * common
       */
      submitBtnFlag: false,  // loading

      /**
       * form
       */
      sendData: {},  // 发送数据
      // 验证添加用户数据
      sendRules: {
        remark: [
          { required: true, message: '请输入不通过意见', trigger: 'blur' },
        ],
      },

      /**
       * tree
       */
      treeNodeAll: false,
      treeExpand: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [],

      /**
       * submit
       */
      subData: {},  // 需要被发送的数据
    }
  },

  methods: {
    /**
     * tools
     */
    // 初始化页面
    initPage() {
      this.treeData = []

      // 如果没有审核状态，说明是在详情页面调用
      if(!this.reviewStatus) {
        // 赋值发送数据
        this.sendData = {
          businessId: this.$route.query.businessId,
          reportFormNameId: this.$route.query.id,
          preId: this.$route.query.preId,
        }
        // console.log(this.sendData)
      } else {
        // 查阅界面不传单个业务id
        // 查阅界面url的preid没用
        this.sendData = {
          reportFormNameId: this.$route.query.id,
          businessIds: this.businessIdArr
        }
      }

      // 获取部门人员树
      this.getDeptAndUser()
    },
    // 隐藏弹窗
    hideVisible() {
      this.$emit("hideVisible")
    },
    // 取消
    sendCancel(formName) {
      this.$refs[formName].resetFields();

      // 隐藏弹窗
      this.hideVisible()
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value) {
      let treeList = this.treeData;

      for (let i = 0; i < treeList.length; i++) {
        this.$refs.tree.store.nodesMap[treeList[i].id].expanded = value;
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value) {
      this.$refs.tree.setCheckedNodes(value ? this.treeData: []);
    },
    // 所有菜单节点数据
    getAllCheckedKeys() {
      // 目前被选中的菜单节点 - 不用半选
      let checkKeys = this.$refs.sendTree.getCheckedKeys()
      let realCheckKeys = []

      checkKeys.forEach(item=> {
        if(item.indexOf("user_") !== -1) {
          realCheckKeys.push(item)
        }
      })

      // console.log(realCheckKeys)

      return realCheckKeys
    },
    // 单选
    handleCheckChange(data) {
      // 单选时启用
      if(this.subStatus === "single") {
        // 处理数据
        // console.log(data.id);

        // 如果存在
        if(data.id.indexOf("user_") !== -1) {
          // console.log(data.id);
          this.sendData.userNameStr = data.id
        } else {
          this.sendData.userNameStr = ""
        }

        // 渲染到树
        let labvalojb = data; // 暂存选中节点
        this.$refs.sendTree.setCheckedKeys([]); // 删除所有选中节点
        this.$refs.sendTree.setCheckedNodes([labvalojb]); // 选中已选中节点
      }
    },

    /**
     * api
     */
    // 获取部门人员树
    getDeptAndUser() {
      // console.log("获取部门人员树")

      let params = {}

      // console.log(this.reviewStatus)

      // 判断是否不为发送填写(多选)，即为审核，且状态为保存并审核，即没有审核状态
      // 状态为success或者没有状态但为单选
      if(this.reviewStatus === 'success' || (this.subStatus !== 'multiple' && !this.reviewStatus)) {
        params = {
          review: true
        }
      }
      // console.log(params)

      treeDeptAndUser(params).then(res=> {
        // console.log(res.data)
        let { data } = res

        this.treeData = data;
      }).catch({})
    },
    // 提交通用接口
    sendSubmitCommon(subasy, next) {
      this.submitBtnFlag = true

      subasy.then(()=> {
        this.$message.success("提交成功")

        // 并且要刷新表格并跳转
        this.$emit("flushPage")

        next()
      }).catch({}).finally(()=> {
        this.hideVisible()

        this.submitBtnFlag = false
      })
    },

    /**
     * 业务
     */
    // 提交表单
    sendSubmit (formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        //如果验证成功，请求接口数据
        if (valid) {
          // console.log("submit!!")

          let msg = "至少选择一项，且必须是用户"

          // 单选 - 审核
          if(this.subStatus === "single") {
            // console.log("单选 - 审核", this.sendData)

            // 都需要传人员 - 失败不用传
            if(!this.sendData.userNameStr && this.reviewStatus !== "fail") {
              this.$message.warning(msg)
              return
            }
            // console.log(this.sendData)

            // 如果没有审核状态，即为发送填写 - 即在详情页面
            if(!this.reviewStatus) {
              // 发送审核接口
              this.sendSubmitCommon(reviewTableSubmit(this.sendData), ()=> {})
            } else {
              // 查阅界面的审核需要ids - 已经加到上面
              // this.sendData.businessIds = this.businessIdArr

              // 成功
              if(this.reviewStatus === "success") {
                // console.log(this.sendData)

                // 发送审核成功接口
                this.sendSubmitCommon(reviewSuccessSubmit(this.sendData), ()=> {})
              }

              // 失败
              if(this.reviewStatus === "fail") {
                console.log("失败", this.sendData)

                // 发送审核失败接口
                this.sendSubmitCommon(reviewFailSubmit(this.sendData), ()=> {})
              }
            }
          }

          // 多选 - 填写 - 即在详情页面
          if(this.subStatus === "multiple") {
            // console.log("多选 - 填写")

            if(this.getAllCheckedKeys().length === 0) {
              this.$message.warning(msg)
              return
            }

            // 获取所有全选
            this.sendData.deptAndUsers = this.getAllCheckedKeys()
            // console.log("多选 - 填写", this.sendData)

            // 多选，发送填写接口
            this.sendSubmitCommon(sendTableSubmit(this.sendData), ()=> {})
          }
        } else {  //验证失败跳出
          this.$message.error("表单填写错误");
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
   .el-form-item__content {
     .el-tree {
        min-height: 22vh;
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;
     }

     .single_tree {
       .el-tree-node .is-leaf + .el-checkbox .el-checkbox__inner{display: inline-block;}
      .el-tree-node .el-checkbox .el-checkbox__inner{display: none;}
     }
  }
}
</style>
