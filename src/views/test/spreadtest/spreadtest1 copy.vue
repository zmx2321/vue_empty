<template>
  <section class="sheet_cont">
    <!-- 引入 @grapecity/spread-sheets-vue 之后-->
    <gc-spread-sheets class="spread_wrap" @workbookInitialized="initWorkbook" />
  </section>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    // 初始化spread
    initWorkbook(spread) {
      console.log(spread)
      spread.getActiveSheet();
    },
  },
  created() {
    console.log(this.GC)
  }
};
</script>

<style lang="less" scoped>
.sheet_cont {
  .spread_wrap {
    width: 100%;
    height: 600px;
  }
}
</style>