<template>
  <i-count-up class="counter" :endVal="count" :options="options"></i-count-up>
</template>

<script>
import ICountUp from 'vue-countup-v2'

export default {
  name: "testmap",

  components: {
    ICountUp
  },

  props: {
    count: {
      type: Number,
      default: ""
    }
  },

  data() {
    return {
      options: {
        startVal: 120,  // 动画开始数据
        duration: 2,  // 动画持续时间
        useEasing: false,  // 是否禁用easing动画效果
        useGrouping: true,  // 是否使用分组，分组后每三位会用一个符号分隔
        separator: ',',  // 分组符号
        decimal: '.',  // 分隔整数和小数的符号，默认是小数点
        prefix: '',  // 前面添加
        suffix: ''  // 后面添加
      },
    }
  },
}
</script>

<style lang="less" scoped>
.counter {
  display: block;
}
</style>