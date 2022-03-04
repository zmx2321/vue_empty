<template>
  <section class="spread_wrap">
    <!-- <input type="file" id="fileDemo" class="input" @change="changeFileDemo">
    <el-button type="primary" @click="importExcel">导入</el-button>
    <el-button type="primary" @click="exportExcel">导出</el-button>

    <gc-spread-sheets class="sheets_wrap" @workbookInitialized="initSpread">
        <gc-worksheet>
        </gc-worksheet>
    </gc-spread-sheets> -->

    <!-- 引入 @grapecity/spread-sheets-vue 之后-->
    <!-- <gc-spread-sheets class="sheets_wrap" @workbookInitialized="initWorkbook" /> -->

    <input type="file" id="fileDemo" class="input" @change="changeFileDemo">
    <el-button type="primary" @click="importExcel">导入</el-button>
    <el-button type="primary" @click="exportExcel">导出</el-button>

    <gc-spread-sheets class="sheets_wrap" @workbookInitialized="initSpread">
        <gc-worksheet>
        </gc-worksheet>
    </gc-spread-sheets>
  </section>
</template>

<script>
import { IO } from "@grapecity/spread-excelio";
import {
    jsonData
} from './data';

export default {
  name: "spreadtest1",

  data() {
    return {
      spread: null,
      excelFile: null,
      exportFileName: "export.xlsx",
    };
  },

  computed: {
    excelIo() {
      return new IO()
    },
  },

  methods: {
    // 初始化spread
    initSpread(spread) {
      this.spread = spread;
      spread.options.calcOnDemand = true;
      spread.fromJSON(jsonData);

      let sheet1 = spread.getSheet(0);
      // Add text
      sheet1.setValue(0, 0, 'Hello World!');

      // 背景
      spread.options.grayAreaBackColor = 'white'
      spread.options.backgroundImage = 'https://www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png';
    },

    /**
     * sheet function
     */
    changeFileDemo(e) {
      this.excelFile = e.target.files[0];
    },
    // 导入
    importExcel() {
      let spread = this.spread;

      // here is excel IO API
      this.excelIo.open(this.excelFile, json=> {
          let workbookObj = json;
          spread.fromJSON(workbookObj, {
              incrementalLoading: {
                loading (progress, args) {
                  progress = progress * 100;
                  // loadingStatus.value = progress;
                  console.log("current loading sheet", args.sheet && args.sheet.name());
                },
              }
          });
      }, function (e) {
          // process error
          alert(e.errorMessage);
      });
      // here is excel IO API
      /* this.excelIo.open(this.importExcelFile, function (json) {
          let workbookObj = json;
          this.spread.fromJSON(workbookObj, {
                  incrementalLoading: {
                      loading: function (progress, args) {
                          progress = progress * 100;
                          // loadingStatus.value = progress;
                          console.log("current loading sheet", args.sheet && args.sheet.name());
                      },
                      loaded: function () {
                      }
                  }
              });
      }, function (e) {
          // process error
          alert(e.errorMessage);
      }); */
    },
    // 导出
    exportExcel() {
      /* let json = this.spread.toJSON();

      // here is excel IO API
      this.excelIo.save(json, function (blob) {
          saveAs(blob, this.exportFileName);
      }, function (e) {
          // process error
          console.log(e);
      }); */
      let spread = this.spread;
      let fileName = this.exportFileName;
      let password = this.password;
      if (fileName.substr(-5, 5) !== '.xlsx') {
          fileName += '.xlsx';
      }
      // console.log(fileName)

      let json = spread.toJSON();

      // here is excel IO API
      this.excelIo.save(json, function (blob) {
          saveAs(blob, fileName);
      }, function (e) {
          // process error
          console.log(e);
      });
    },
  },
  created() {
    console.log(this.GC)
  }
};
</script>

<style lang="less" scoped>
.spread_wrap {
  width: 100%;
  height: calc(100% - 2px);

  .sheets_wrap {
    width: 100%;
    height: 100%;
  }
}
</style>