<template>
  <section class="tab_wrap">
    <ul @click="checkTab">
      <li v-for="(item, index) in tabList" :key="index">{{ item }}</li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      default: ()=> []
    }
  },

  methods: {
    initTab() {
      // console.log(this.$el)

      let liList = this.$el.querySelectorAll('li')
      liList.forEach(item=> {
        item.classList.remove('selected')
      })
      liList[0].classList.add('selected')
    },

    // 选项卡
    checkTab(e) {
      let { target } = e
      let { textContent } = target
      let liList = target.parentNode.getElementsByTagName('li')
      liList.forEach(item => {
        item.className = ''
      })

      target.className = 'selected'

      this.$emit('checkTab', textContent)
    },
  },

  mounted() {
    this.initTab()
  }
}
</script>

<style lang="less" scoped>
@titleMargin: 14px;
@tabRadius: 5px;

.tab_wrap {
  line-height: 38px;

  ul {
    margin-right: @titleMargin;
    background: #305392;
    border-radius: @tabRadius;

    li {
      display: inline-block;
      padding: 0 15px;
      font-size: 16px;
      border-radius: @tabRadius;
      cursor: pointer;

      &.selected {
        font-weight: bold;
        background: #447acd;
      }
    }
  }
}
</style>