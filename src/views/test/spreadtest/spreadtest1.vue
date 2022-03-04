<template>
  <section class="spread_wrap">
    <!-- 引入 @grapecity/spread-sheets-vue 之后-->
    <gc-spread-sheets class="sheets_wrap" @workbookInitialized="initWorkbook" />
  </section>
</template>

<script>
export default {
  name: "spreadtest2",

  data() {
    return {
      spread: null
    };
  },

  computed: {
  },

  methods: {
    // 初始化spread
    initWorkbook(spread) {
      this.spread = spread;

      let sheet1 = spread.getSheet(0);
      // Add text
      sheet1.setValue(0, 0, 'Hello World!');
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