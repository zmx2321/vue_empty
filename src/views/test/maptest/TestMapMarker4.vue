<template>
   <merchant-map />
</template>

<script>
import MerchantMap from '@/components/map/MerchantMap.vue'

export default {
    name: "TestMapMarker4",

    components: { MerchantMap },
}
</script>

<style lang="less" scoped>
.amap-wrapper {
  .amap-box {
    width: 100%;
    height: 500px;

    // 窗口
    /deep/ .amap-info-content {
      .input-card {
        color: @globalBtnColor;
        // background: #f00;
      }
    }
  }
}
</style>