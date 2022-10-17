<template>
  <section class="large_screen_wrap">
    <flow-data-chart ref="chart10Ref" :chart-data="flowDataData" :height="'170px'" />
  </section>
</template>

<script>
import FlowDataChart from './charts/FlowDataChart'  // 流量数据

export default {
  name: "largeScreen",

  components: {
    FlowDataChart
  },

  data() {
    return {
    }
  },

  methods: {
  },

  created() {
  },

  destroyed() {
  },
}
</script>

<style lang="less" scoped>
</style>