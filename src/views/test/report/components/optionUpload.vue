<template>
  <el-upload
    ref="upload"
    action=""
    accept=".jpg,.png,.jpeg,gif"
    :file-list="fileList"
    :limit="1"
    :on-change="handleChange"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary" @click="getuploaditem()">选取文件</el-button>
    <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
    <div slot="tip" class="el-upload__tip">文件不超过500kb</div>
  </el-upload>
</template>

<script>
export default {
  components: {
  },

  props: {
    // 文件列表
    fileList: {
      type: Array,
      default: () => []
    },
    // 列数据
    colitem: {
      type: Object,
      default: () => {}
    },
    // 行数据
    recrow: {
      type: Object,
      default: () => {}
    },
  },

  data () {
    return {
      filerow: "",  // 文件
    }
  },

  computed: {
    // 遍历时才会有行和列,弹窗没有行和列
    notDialog() {
      return !(!this.colitem && !this.recrow)
    },
  },

  methods: {
    /**
     * 文件相关
     */
    // 获取文件
    handleChange(file) {
      // console.log("upload获取文件")
      // console.log(file.raw, this.filerow)

      let fileObj = {
        fileName: this.filerow,
        file: file.raw
      }
      // console.log(fileObj)

      this.$emit("getFile", fileObj)
    },
    // 获取行数据
    getuploaditem() {
      if(this.notDialog) {
        this.filerow = this.colitem.attr.fileprefix + this.recrow.index + "_" + this.colitem.attr.filecolid
      }
    },
    // 删除文件
    handleRemove(file) {
      // console.log("upload删除文件", file)

      this.$emit("delfile", file.uid)
    },
    // 删除提示
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 文件限制
    handleExceed() {
      this.$message.warning("只能上传一个文件")
    },
  },
}
</script>
