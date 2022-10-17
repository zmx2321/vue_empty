<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scope>
  #app {
    width: 100%;
    height: 100%;
    // width: 100vw;
    // height: 100vh;
    min-width: @mainWidth;
    // width: 100vw;
    min-height: 100vh;
    font-size: 12px;  /* 全局默认字体大小 */
  }
</style>
