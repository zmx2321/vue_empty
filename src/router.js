import Vue from 'vue'
import VueRouter from 'vue-router'

import md5 from 'js-md5';  //md5加密

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
  // index
  {
    path: '/index',
    name: 'index',
    component: resolve => require(['@/views/Index'], resolve),
    children: [
      { path: '', component: Home },
      {
        path: '/home',
        name: "home",
        component: resolve => require(['@/views/main/Home'], resolve)
      },
      /**
       * Test1
       */
      {
        path: '/test1_1',
        name: "test1_1",
        component: resolve => require(['@/views/manager/test1/Test1_1'], resolve)
      },
      {
        path: '/test1_2',
        name: "test1_2",
        component: resolve => require(['@/views/manager/test1/Test1_2'], resolve)
      },
      /**
       * Test2
       */
      {
        path: '/test2_1',
        name: "test2_1",
        component: resolve => require(['@/views/manager/test2/Test2_1'], resolve)
      },
      {
        path: '/test2_2',
        name: "test2_2",
        component: resolve => require(['@/views/manager/test2/Test2_2'], resolve)
      },


        // // echartsmap
        // {
        //   path: '/echartsMap1',
        //   name: "echartsMap1",
        //   component: resolve => require(['@/views/manager/test/echartsMap/echartsMap1'], resolve)
        // },
        // {
        //   path: '/echartsMap2',
        //   name: "echartsMap2",
        //   component: resolve => require(['@/views/manager/test/echartsMap/echartsMap2'], resolve)
        // },
        // {
        //   path: '/echartsMap3',
        //   name: "echartsMap3",
        //   component: resolve => require(['@/views/manager/test/echartsMap/echartsMap3'], resolve)
        // },
        // {
        //   path: '/echartsMap4',
        //   name: "echartsMap4",
        //   component: resolve => require(['@/views/manager/test/echartsMap/echartsMap4'], resolve)
        // },
        // {
        //   path: '/echartsMap5',
        //   name: "echartsMap5",
        //   component: resolve => require(['@/views/manager/test/echartsMap/echartsMap5'], resolve)
        // },
    ]
  },
  // 如果是根路径的话，重定向到index路径
  {
    path: '/',
    redirect: '/index'
    // redirect: '/login'
  },
  // // 如果访问index则跳转到index路径
  // {
  //   path: '/test',
  //   component: resolve => require(['@/views/Test'], resolve),
  //   children: [
  //     { path: '', component: Home },
  //     {
  //       path: '/home',
  //       name: "home",
  //       component: resolve => require(['@/views/main/Home'], resolve)
  //     },

  //     /**
  //      * test
  //      */
  //     // test
  //     // echartsmap
  //     {
  //       path: '/echartsMap1',
  //       name: "echartsMap1",
  //       component: resolve => require(['@/views/manager/test/echartsMap/echartsMap1'], resolve)
  //     },
  //     {
  //       path: '/echartsMap2',
  //       name: "echartsMap2",
  //       component: resolve => require(['@/views/manager/test/echartsMap/echartsMap2'], resolve)
  //     },
  //     {
  //       path: '/echartsMap3',
  //       name: "echartsMap3",
  //       component: resolve => require(['@/views/manager/test/echartsMap/echartsMap3'], resolve)
  //     },
  //     {
  //       path: '/echartsMap4',
  //       name: "echartsMap4",
  //       component: resolve => require(['@/views/manager/test/echartsMap/echartsMap4'], resolve)
  //     },
  //     {
  //       path: '/echartsMap5',
  //       name: "echartsMap5",
  //       component: resolve => require(['@/views/manager/test/echartsMap/echartsMap5'], resolve)
  //     },
  //   ]
  // },
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
