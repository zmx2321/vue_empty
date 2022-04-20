<template>
  <section class="tab_info_wrap">
    <div class="info_btn">
      <p>最近数据同步时间为2022/04/13 12:00:12，<a @click="showData">请点击查看</a></p>
    </div>

    <info-frame ref="infoFrameRef" />
  </section>
</template>

<script>
import InfoFrame from './InfoFrame'

export default {
  components: {
    InfoFrame
  },

  methods: {
    showData() {
      this.$refs.infoFrameRef.showData()
    }
  }
}
</script>

<style lang="scss" scoped>
$tabInfoHeight: 34px;

.tab_info_wrap {
  .info_btn {
    width: 100%;
    height: $tabInfoHeight;
    background: #f5d4d4;
    border: solid 1px #f00;
    margin-bottom: 12px;
    overflow: hidden;

    p {
      height: $tabInfoHeight;
      line-height: $tabInfoHeight;
      padding: 0 15px;
      font-size: 16px;

      a {
        font-size: 14px;
        color: #00aeff;
      }
    }
  }
}
</style>
