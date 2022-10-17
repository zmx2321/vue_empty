<template>
  <section class="menu_page">
    <el-row>
      <el-col>
        <el-menu :default-active="activeIndex" unique-opened mode="vertical" background-color="#324057" text-color="#fff" active-text-color="#409eff" class="menu">
          <!-- 首页 -->
          <router-link to="/home">
            <el-menu-item index="0">
              <i class="fa fa-server"></i>
              <span slot="title">首页</span>
            </el-menu-item>
          </router-link>

          <!-- 账号管理 -->
          <!--<router-link to="/account_manager">
                        <el-menu-item index="1">
                            <i class="fa fa-user"></i>
                            <span slot="title">账号管理</span>
                        </el-menu-item>
                    </router-link>-->

          <!-- 二级菜单 -->
          <template v-for="item in items">
            <el-submenu v-if="item.children" :index="item.path" :key="item.path">
              <template slot="title">
                <i :class="'fa fa-margin '+item.icon"></i>
                <span slot="title">{{item.name}}</span>
              </template>
              <router-link v-for="(citem,cindex) in item.children" :to="citem.path" :key="cindex" class="menu_child">
                <el-menu-item :index='citem.path'>
                  <span slot="title">{{citem.name}}</span>
                </el-menu-item>
              </router-link>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  name: "leftmenu",

  data() {
    return {
      items: [
        // Test1
        {
          icon: "fa fa-bullseye",
          name: "test1",
          path: "test1",
          children: [
            { path: "/test1_1", name: "test1_1" },
            { path: "/test1_2", name: "test1_2" },
          ]
        },
        // Test2
        {
          icon: "fa fa-bullseye",
          name: "test2",
          path: "test2",
          children: [
            { path: "/test2_1", name: "test2_1" },
            { path: "/test2_2", name: "test2_2" },
          ]
        },
      ]
    };
  },

  // 解决路由跳转导航不高亮问题
  computed: {
    activeIndex() {
      let pathName = this.$route.path.replace('/', '');
      console.log(pathName)

      switch (pathName) {
        case "home":
          return "0";
          break;
        case "test_map6":
          return "1";
          break;
      }
    },
  },
};
</script>

<style  lang="less" scoped>
.menu_page {
  width: 100%;
  height: 100%;

  .menu {
    border: none;

    span {
      margin-left: 8px;
      color: @layerFontColor;
    }

    li.is-opened {
      .el-submenu__title {
        i {
          color: @sideIconColor;
        }
      }

      ul.el-menu {
        a.router-link-active {
          li {
            background-color: @sideHighColor !important;
          }
        }
      }
    }
  }
}
</style>
