import Vue from 'vue'
import VueRouter from 'vue-router'

import md5 from 'js-md5';  //md5加密

// index
import Index from '@/views/Index'

// admin
import Login from '@/views/admin/Login'

// main
import NotFound from '@/views/main/NotFound'
import Home from '@/views/main/Home'

Vue.use(VueRouter)

const routes = [
  // 登陆页面
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  // 404
  {
    path: '*',
    name: '404',
    component: NotFound
  },
  // 如果是根路径的话，重定向到index路径
  {
    path: '/',
    // redirect: '/index'
    redirect: '/login'
  },
  // 如果访问index则跳转到index路径
  {
    path: '/index',
    component: Index,
    children: [
      { path: '', component: Home },
      {
        path: '/home',
        name: "home",
        component: resolve => require(['@/views/main/Home'], resolve)
      },

      /**
       * test
       */
      // test
      {
        path: '/test',
        name: "test",
        component: resolve => require(['@/views/test/Test'], resolve)
      },
      {
        path: '/test1',
        name: "test1",
        component: resolve => require(['@/views/test/Test1'], resolve)
      },
      {
        path: '/test2',
        name: "test2",
        component: resolve => require(['@/views/test/Test2'], resolve)
      },
      {
        path: '/test3',
        name: "test3",
        component: resolve => require(['@/views/test/Test3'], resolve)
      },
      {
        path: '/test4',
        name: "test4",
        component: resolve => require(['@/views/test/Test4'], resolve)
      },
      {
        path: '/test5',
        name: "test5",
        component: resolve => require(['@/views/test/Test5'], resolve)
      },
      // maptest
      {
        path: '/test_map',
        name: "test_map",
        component: resolve => require(['@/views/test/maptest/TestMap'], resolve)
      },
      {
        path: '/test_map1',
        name: "test_map1",
        component: resolve => require(['@/views/test/maptest/TestMap1'], resolve)
      },
      {
        path: '/test_map2',
        name: "test_map2",
        component: resolve => require(['@/views/test/maptest/TestMap2'], resolve)
      },
      {
        path: '/test_map3',
        name: "test_map3",
        component: resolve => require(['@/views/test/maptest/TestMap3'], resolve)
      },
      {
        path: '/test_map4',
        name: "test_map4",
        component: resolve => require(['@/views/test/maptest/TestMap4'], resolve)
      },
      {
        path: '/test_map5',
        name: "test_map5",
        component: resolve => require(['@/views/test/maptest/TestMap5'], resolve)
      },
      {
        path: '/test_map6',
        name: "test_map6",
        component: resolve => require(['@/views/test/maptest/TestMap6'], resolve)
      },
      {
        path: '/test_map7',
        name: "test_map7",
        component: resolve => require(['@/views/test/maptest/TestMap7'], resolve)
      },
      {
        path: '/test_map8',
        name: "test_map8",
        component: resolve => require(['@/views/test/maptest/TestMap8'], resolve)
      },
      {
        path: '/test_map9',
        name: "test_map9",
        component: resolve => require(['@/views/test/maptest/TestMap9'], resolve)
      },
      {
        path: '/test_map10',
        name: "test_map10",
        component: resolve => require(['@/views/test/maptest/TestMap10'], resolve)
      },
      {
        path: '/test_map_marker1',
        name: "test_map_marker1",
        component: resolve => require(['@/views/test/maptest/TestMapMarker1'], resolve)
      },
      {
        path: '/test_map_marker2',
        name: "test_map_marker2",
        component: resolve => require(['@/views/test/maptest/TestMapMarker2'], resolve)
      },
      {
        path: '/test_map_marker3',
        name: "test_map_marker3",
        component: resolve => require(['@/views/test/maptest/TestMapMarker3'], resolve)
      },
      // gltest
      {
        path: '/gltest1',
        name: "gltest1",
        component: resolve => require(['@/views/test/gltest/GlTest1'], resolve)
      },

      /**
       * 超市管理
       */
      //  商品订单
      {
        path: '/merchandise_order',
        name: "merchandise_order",
        component: resolve => require(['@/views/manager/supermarket/MerchandiseOrder'], resolve)
      },
      // 商品管理
      {
        path: '/commodity',
        name: "commodity",
        component: resolve => require(['@/views/manager/supermarket/Commodity'], resolve)
      },
      // 商品分类
      {
        path: '/commodity_classification',
        name: "commodity_classification",
        component: resolve => require(['@/views/manager/supermarket/CommodityClassification'], resolve)
      },

      /**
      * 食堂管理
      */
      // 餐品管理
      {
        path: '/food_products',
        name: "food_products",
        component: resolve => require(['@/views/manager/canteen/FoodProducts'], resolve)
      },
      // 餐品订单
      {
        path: '/food_products_order',
        name: "food_products_order",
        component: resolve => require(['@/views/manager/canteen/FoodProductsOrder'], resolve)
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

// 添加路由守卫
/* router.beforeEach((to, from, next) => {
  const isLogin = localStorage.code == md5("0") ? true : false;
  if (to.path == "/login" || to.path == '/register') {
    next();
  } else {
    isLogin ? next() : next("/login");
  }
}); */

export default router
