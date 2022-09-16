<template>
  <!-- 通过v-bind="$attrs" v-on="$listeners"，把父组件传的属性全部绑定到子组件上，保证了api和el-table一致 -->
  <el-table v-bind="$attrs" v-on="$listeners" v-loading="listLoading" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" align="center"></el-table-column>
    <el-table-column label="序号" type="index" width="55" align="center"></el-table-column>
    <el-table-column label="业务编号" align="center" prop="businessId" v-if="onlyView"></el-table-column>
    <el-table-column label="提交人" align="center" prop="nickName" v-if="onlyView"></el-table-column>
    <el-table-column label="提交部门" align="center" prop="deptName" v-if="onlyView"></el-table-column>
    <el-table-column v-for="(item, index) in columns" :key="`${index}`" v-bind="item" align="center">
      <!-- 输入框 -->
      <editable-cell v-if="item.attr.attribute==='1'" slot-scope="{row}">
        <el-input v-if="!item.attr.onlyView" v-model="row[item['prop']]" placeholder="请输入内容" clearable></el-input>
        <span v-else>{{ row[item['prop']] }}</span>
      </editable-cell>

      <!-- 下拉框 -->
      <editable-cell v-else-if="item.attr.attribute==='2'" slot-scope="{row}">
        <el-select v-if="!item.attr.onlyView" v-model="row[item['prop']]" placeholder="请选择字段类型" clearable>
          <el-option v-for="(selItem, selIndex) in item.attr.dictlist" :key="selIndex" :label="selItem.label" :value="selItem.value.toString()"></el-option>
        </el-select>
        <span v-else>{{ getSelectValue(row, item) }}</span>
      </editable-cell>

      <!-- 上传 -->
      <editable-cell v-else slot-scope="{row}">
        <!-- 编辑 -->
        <div class="edit_file_wrap" v-if="!item.attr.onlyView">
          <!-- 判断url是否有值 -->
          <div class="nourl" v-if="!row[item['prop']]">
            <option-upload :fileList='fileList' :colitem="item" :recrow="row"
                            @getFile="getFile" @delfile="delfile" />
          </div>

          <!-- url有值 -->
          <div class="hasurl" v-else v-html="getEditFileValue(row, item)" @click="clickurl($event, row, item)"></div>
        </div>
        <!-- 只读 -->
        <div class="file_wrap" v-else v-html="getFileValue(row, item)"></div>
      </editable-cell>
    </el-table-column>

    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" v-if="!onlyView">
      <template slot-scope="scope">
        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import EditableCell from './EditableCell'
import optionUpload from '../components/optionUpload.vue'  // 上传

import * as utils from '@/utils/utils'  // 工具

export default {
  name: 'BaseTable',

  components: { EditableCell, optionUpload },

  props: {
    // 列
    columns: {
      type: Array,
      default: () => []
    },
    // loading
    listLoading: {
      type: Boolean,
      default: true
    },
    // 只读
    onlyView: {
      type: Boolean,
      default: false
    },
    // 列表
    fileList: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      filerow: "",
    }
  },

  created() {

  },

  methods: {
    /**
     * tools
     */
    /**
     * 表格相关
     */
    // 多选
    handleSelectionChange(selection) {
      // console.log(selection)

      this.$emit("getSelection", selection)
    },
    // 删除按钮操作
    handleDelete(row) {
      this.$emit("handleDelete", row)
    },

    /**
     * 文件相关
     */
    // 获取文件
    getFile(fileObj) {
      this.$emit("getFile", fileObj)
    },
    // 删除文件
    delfile(uid) {
      // console.log("删除文件", uid)

      this.$emit("delfile", uid)
    },

    /**
     * 只读中的函数
     */
    // 读取字典
    getSelectValue(row, item) {
      // console.log("读取字典index", item.attr.dictlist)
      let label = ""

      item.attr.dictlist.forEach(dict=> {
        if(dict.value === parseInt(row[item['prop']])) {
          // console.log(dict.label)
          label = dict.label
        }
      })

      return label
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
    // 读取路径 - 编辑
    getEditFileValue(row, item) {
      let url = row[item['prop']]
      let tp = ""

      // 如果有地址
      if(url) {
        if(utils.isAssetTypeAnImage(utils.getFileprefix(url))) {
          // 图片
          // console.log(url)
         tp = `<img src='${url}' style="width:100px;height:100px" title="点击删除图片" />`
        } else {
          // 文件
          // console.log(url)
          tp = `
            <a target="_blank" href='${url}' title="${url}">点击下载</a>
            <span title="${url}">点击删除文件</span>
          `
        }
      }

      return tp
    },
    // 有url时，点击url
    clickurl(e, row, item) {
      // console.log(e.target.nodeName, row, item)
      /* console.log(e.target.nodeName)
      console.log(row[item['prop']]) */

      // 这个值同时也需要传递到upload组件
      let urlDataObj = {
        col: item,
        row
      }

      // 在图片上绑定点击事件
      if(e.target.nodeName === "IMG" || e.target.nodeName === "SPAN") {
        this.$emit("showEditUpload", urlDataObj)
      }
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .hasurl {
  a {
    display: block;
    width: 26%;
    margin: 10px auto 10px;
    color: #fff;
    padding: 3px 15px;
    font-size: 12px;
    border-radius: 3px;
    background: $mainColor;
    border: solid 1px $mainColor;

    &:hover {
      background: $mainHoverColor;
      border-color: $mainHoverColor;
    }
  }

  span {
    cursor: pointer;
    transition: 0.2s linear;

    &:hover {
      color: $mainHoverColor;
      transition: 0.3s linear;
    }
  }
}
</style>
