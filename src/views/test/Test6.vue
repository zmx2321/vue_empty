<template>
  <section class="main_cont">
    <count-up :count="123" />
    <CountUp :count="123" />
    <CountUp :count="655566" />
  </section>
</template>

<script>
export default {
  name: "testmap",

  data() {
    return {
    }
  },

  methods: {
  },

  mounted() {
  },

  created() {
  }
}
</script>

<style lang="less" scoped>
.main_cont {
  width: 96%;
  height: calc(100vh - 72px);
}
</style>