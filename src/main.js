import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import axios from "axios"
import AMap from 'vue-amap'

import ElementUI from 'element-ui'  // 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'

import md5 from 'js-md5';  //md5加密
import 'countup'
// import ICountUp from 'vue-countup-v2'
import CountUp from './components/tools/CountUp'

import i18n from '@/assets/i18n/i18n';  // 引入国际化组件

Vue.config.productionTip = false

// 全局注册
Vue.use(ElementUI);
Vue.use(i18n);
Vue.component("CountUp", CountUp); 
// Vue.component("ICountUp", ICountUp); 

//挂载（使其可以在各个组件使用）
Vue.prototype.axios = axios;
Vue.prototype.md5 = md5;  // 在main.js文件中将md5转换成vue原型

// 修改地图刷新页面空白，治标不治本
let timer = setTimeout(()=> {
  localStorage.clear()
  Vue.use(AMap)

  clearTimeout(timer)
}, 0)
AMap.initAMapApiLoader({
  // 高德key
  key: '9f7114e40a863ee2916ca40025267e65',
  // 插件集合 （插件按需引入）
  // plugin: ['AMap.Geolocation', 'Geolocation', 'AMap.DistrictSearch', 'AMap.Marker']
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','AMap.Geolocation'],
  v: '1.4.4',
  uiVersion: '1.0'
})

new Vue({
  router,
  store,
  i18n,
  // ICountUp,
  render: h => h(App)
}).$mount('#app')
