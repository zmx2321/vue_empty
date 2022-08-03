<template>
  <section class="container">
    <header class="header f-oh">
      <HeadNav></HeadNav>
    </header>
    <section class="main_wrap">
      <aside class="aside f-oh">
        <LeftMenu></LeftMenu>
      </aside>
      <section class="main">
        <router-view />
      </section>
    </section>
  </section>
</template>

<script>
import HeadNav from '../components/HeadNav'
import LeftMenu from "../components/LeftMenu";

export default {
  name: "index",

  components: {
    HeadNav,
    LeftMenu
  },
  created: function () {
    // console.log(this.md5("admin"));
  },
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .header,
  .aside {
    background: @mainBg;
  }

  .header {
    height: @headNavHeight !important;
    padding: 0;
    border-bottom: 1px solid #1f2d3d;
  }

  .main_wrap {
    display: flex;
    width: 100%;
    height: calc(100vh - @headNavHeight - 1px);

    .aside {
      width: @sideBarWidth;
      height: 100%;
    }

    .main {
      width: calc(100vw - @sideBarWidth - 40px);
      flex: 1;
      padding: 0;
      overflow: auto;
    }
  }
}
</style>