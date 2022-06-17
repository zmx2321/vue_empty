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

import * as echarts from "echarts";
import 'echarts-gl'
// console.log(echarts)

// SpreadJS
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import "@grapecity/spread-sheets-vue";
import GC from '@grapecity/spread-sheets'
import '@grapecity/spread-sheets-resources-zh';
GC.Spread.Common.CultureManager.culture("zh-cn");
// 秘钥
// GC.Spread.Sheets.LicenseKey = 'Designer-E849734751652253#B0dJHTMlDMBRjaHRkcmZURKlXdLVEZN96SmNzRyB7MzNXMuNXWxZHVXJUMMh6N9NUTWRWMjtSY9IkWpREUzoEWrFmdYp5MVNXUsRzY6YHeBxWb9ZlTzh6M484N5RmZE3mSVBjaBRkRDF4RX5mN0Fle5EnT6MXMXFGT5JzUwETdUpUTOR7KsVWNmVEWjhUYNN7SZhUarYHcO3mMjhkNMtmZJBXMWNVatl4QxwmW8E4KyIWMvIGZrMnT6V4VOZ4YOh6QSRjUaZmTwlFNlt6bvhHbzJ5VpBnVshTTiF4a5cDbTBTbQdWUVR5NHZVcxcmeqpWd7RHaiojITJCLigzQDFjQCJDNiojIIJCLxMTOxEzM6kjN0IicfJye35XX3JCTBF5UiojIDJCLiUTMuYHITpEIkFWZyB7UiojIOJyebpjIkJHUiwiIwMjM4ATMgIDMzAjMyAjMiojI4J7QiwiIxADNwIjMwIjI0ICc8VkIsICMuAjLw8CMvIXZudWazVGZiojIz5GRiwSZ5JHd0ICb6VkIsIyM5IjM5YTM5cDNzcTO4gjI0ICZJJCL355W0IyZsZmIsUWdyRnOiI7ckJye0ICbuFkI1pjIEJCLi4TPR9EUDhFb7gVNaR4MGR7U9QndohXOFdEM5IHVudWTzEkZ5F4LFF5VXlVSrgEN8NVUjl6RN9Gd6A5UZl7TFZWWllFOnhXW6VmduBzb6hzbwYDePR7Z8pXS9tWRjd4NPhFafVme'

Vue.config.productionTip = false

// 全局注册
Vue.use(ElementUI);
Vue.use(i18n);
Vue.component("CountUp", CountUp); 
// Vue.component("ICountUp", ICountUp); 

//挂载（使其可以在各个组件使用）
Vue.prototype.axios = axios;
Vue.prototype.md5 = md5;  // 在main.js文件中将md5转换成vue原型
Vue.prototype.GC = GC;
Vue.prototype.$echarts = echarts;

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
  uiVersion: '1.0.11'
})
let amapManager = new AMap.AMapManager();
Vue.prototype.amapManager = amapManager;
// console.log(amapManager)

new Vue({
  router,
  store,
  i18n,
  // ICountUp,
  render: h => h(App)
}).$mount('#app')
