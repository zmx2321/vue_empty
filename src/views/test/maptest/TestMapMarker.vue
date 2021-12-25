<template>
  <section class="main_cont amap-wrapper">
    <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events"></el-amap>
  </section>
</template>

<script>
import axios from 'axios'
import ico from '@/assets/logo.png'

import { mapDataList } from './mapData'

export default {
  data () {
      return {
        /**
         * 地图基本信息
         */
        center: [107.943579, 30.131735],
        zoom: 7,
        resizeEnable: true,
        events: {
          init: o=> {
            this.initMap(o)
          }
        },

        /**
         * 地图数据
         */
        markers: [],  // 标注点集合
        clusterInfoData: {},  // 聚合窗口数据
        markerInfoData: {}  // 标注窗口数据
      }
  },

  computed: {
    // 气泡信息
    infoObj() {
      return {
        //模板, underscore
        infoTitle: '<strong><%- title %></strong>',
        infoBody: '<p class="my-desc">' +
            //<%= 原值插入 ..
            '<%= img %>' +
            //<%- html编码后插入
            '<%- body %>' +
            '</p>',
        //模板数据
        infoTplData: {
            title: '"标题-标题"',
            img: '<img src="//webapi.amap.com/theme/v1.3/autonavi.png" />',
            body: '<---------内容--------->'
        },

        //基点指向marker的头部位置
        offset: new AMap.Pixel(0, -31)
      }
    },

    // 聚合窗口
    clusterInfoWindow() {
      return new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    },
    // 标注窗口
    markerInfoWindow() {
      return new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    },

    // 聚合窗口信息
    clusterInfo() {
      return `
        <div class="cluster_info_window">
          <p>聚合</p>
          <p>聚合数量：${this.clusterInfoData.count}</p>
          <p>所有坐标：<br />${this.clusterInfoData.positionList}</p>
        </div>
      `
    },

    // 聚合窗口信息
    markerInfo() {
      return `
        <div class="marker_info_window">
          <p>标注</p>
          <p>标注索引：${this.markerInfoData.index}</p>
          <p>标注坐标：${this.markerInfoData.position}</p>
          <p>标注地址：${this.markerInfoData.positionStr}</p>
        </div>
      `
    }
  },

  methods: {
    /**
     * tools
     */
    // 地图初始化
    initMap(map) {
      // console.log("初始化地图", map)

      // 设置坐标和缩放
      this.setMap()

      // 打点
      this.setMarker(map)

      // 地图点击事件
      map.on('click', e=> {
        // 地图坐标
        this.getPosition(e, map)

        // 关闭所有弹窗
        this.closeAllWindow()
      })
    },

    // 设置坐标和缩放
    setMap() {
      this.center = [120.468554, 29.513312]
      this.zoom = 8
      /* this.center = [120.246279,29.97404]
      this.zoom = 18 */
    },

    // 地图坐标
    getPosition(e, map) {
      console.log('您在 ['+e.lnglat.getLng()+','+e.lnglat.getLat()+'] 的位置点击了地图');

      console.log("当前地图的缩放级别为", map.getZoom())
    },

    /**
     * map相关
     * tools
     */
    // 根据窗口显示隐藏
    toogleWindow(infoWindowName, map, position){
      if(infoWindowName.map) {
        infoWindowName.close();
      } else {
        infoWindowName.open(map, position);
      }
    },
    // 打开弹窗
    openWindow(infoWindowName, map, position) {
      infoWindowName.open(map, position);
    },
    // 关闭弹窗
    closeWindow(infoWindowName) {
      infoWindowName.close();
    },
    // 关闭所有弹窗
    closeAllWindow() {
      this.closeWindow(this.clusterInfoWindow)
      this.closeWindow(this.markerInfoWindow)
    },
    // 设置自定义聚合
    setCluster(count, context, map) {
      // 创建
      let div = document.createElement('div');
      // 定义类名和内容
      div.className = "cluster_marker"
      div.innerHTML = context.count;
      // 定义基本样式
      let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
      div.style.fontSize = '14px';
      div.style.textAlign = 'center';
      div.style.width = div.style.height = size + 'px';
      div.style.borderRadius = size / 2 + 'px';
      div.style.lineHeight = size + 'px';
      // 设置背景色 - 可删
      let factor = Math.pow(context.count / count, 1 / 18);  // 根据聚合数量设置值
      div.style.opacity = factor
      // 设置聚合属性
      context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
      context.marker.setContent(div)
      // 聚合添加事件
      div.addEventListener('mouseover', ()=>{
        // 聚合事件封装
        this.clusterMarkerEvent(context, map)
      })
      // 聚合添加事件
      div.addEventListener('mouseout', ()=>{
        // 聚合事件封装
        this.closeAllWindow()
      })
    },
    // 设置标注事件
    setMarkerEvent(marker, map) {
      // 标注添加事件
      AMap.event.addListener(marker, 'click', ()=> {
        // 事件对象的坐标不准确

        // 标注事件封装
        this.markerEvent(marker)
      })
      AMap.event.addListener(marker, 'mouseover', e=> {
        this.markerHoverEvent(e, map, marker)
      })
      AMap.event.addListener(marker, 'mouseout', ()=> {
        this.closeAllWindow()
      })
    },

    /**
     * api tools
     */
    // 获取点位
    getPointData() {
      return new Promise((resolve, reject)=> {
        axios.get('http://a.amap.com/jsapi_demos/static/china.js').then(res=> {
          let dataStr = res.data;
          let ipos = dataStr.indexOf('[')
          let str = dataStr.substring(ipos,dataStr.length)
          let points = JSON.parse(str)

          resolve(points)
        }).catch(err=> {
          reject(err)
        })
      })
    },

    /**
     * map主要功能
     */
    // 打点并聚合
    async setMarker(map) {
      // console.log("打点", map)

      let markers = [], cluster
      // let points = await this.getPointData()  // 获取接口数据
      // console.log(points)

      let points = []

      // console.log("mapdata 坐标集合", mapDataList)
      mapDataList.forEach(item=> {
        points.push({
          lnglat: item.lnglat
        })
      })
      // console.log(points)

      // 创建一个 Icon
      var myIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(80, 80),
        // 图标的取图地址
        image: ico,
        // 图标所用图片大小
        imageSize: new AMap.Size(30, 30),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(5, 8)
      });

      for (let i = 0; i < points.length; i += 1) {
        let marker = new AMap.Marker({
          position: points[i]['lnglat'],
          offset: new AMap.Pixel(-15, -15),
          clickable: true,
          // icon: myIcon,  // 标注图标
        })
        marker.index = i;
        markers.push(marker)

        // 设置标注事件
        this.setMarkerEvent(marker, map)
      }

      // 自定义聚合
      let _renderClusterMarker = context=> {
        // 设置自定义聚合
        this.setCluster(markers.length, context, map)
      }

      // 聚合
      map.plugin(["AMap.MarkerClusterer"],function() {
        cluster = new AMap.MarkerClusterer(map, markers, {
          gridSize: 80,
          // zoomOnClick: false,  // 阻止聚合
          renderClusterMarker: _renderClusterMarker
        });
      })
    },

    // 聚合事件封装
    clusterMarkerEvent(context, map) {
      // console.log(context)

      let positionArr = []
      let positionStr = ''

      // 获取聚合中所有的点位坐标，传给后端
      context.markers.forEach(item=> {
        // console.log(item.De.position)
        positionArr.push([item.De.position.lng, item.De.position.lat])
        positionStr += `[${item.De.position.lng},${item.De.position.lat}] \n`
      })

      // 聚合数据 - 后端返回的数据用这个对象接收
      this.clusterInfoData = {
        count: context.count.toString(),
        positionList: positionStr
      }

      // 添加内容
      this.clusterInfoWindow.setContent(this.clusterInfo);

      // 关闭弹窗
      this.openWindow(this.clusterInfoWindow, map, context.marker.De.position)
    },

    // 鼠标移入标注封装
    markerHoverEvent(e, map, marker) {
      let addressStr = ""

      mapDataList.forEach(item=> {
        // 只查经度
        if(item.lnglat[0] === marker.De.position.lng.toString()) {
          switch(item.area) {
            case '萧山东':
              addressStr = "萧山东"
              break
            case '萧山西':
              addressStr = "萧山西"
              break
            case '绍兴东':
              addressStr = "绍兴东"
              break
            case '绍兴西':
              addressStr = "绍兴西"
              break
            case '丽水西':
              addressStr = "丽水西"
              break
            case '丽水东':
              addressStr = "丽水东"
              break
            case '衢州南':
              addressStr = "衢州南"
              break
            case '衢州北':
              addressStr = "衢州北"
              break
            case '长安南':
              addressStr = "长安南"
              break
            case '长安北':
              addressStr = "长安北"
              break
            case '临海南':
              addressStr = "临海南"
              break
            case '临海北':
              addressStr = "临海北"
              break
          }
        }
      })
      console.log(addressStr)

      // 标注点数据
      this.markerInfoData = {
        index: e.target.index,
        position: `[${marker.De.position.lng}, ${marker.De.position.lat}]`,
        positionStr: addressStr
      }

      // 添加内容
      this.markerInfoWindow.setContent(this.markerInfo);

      // 根据窗口显示隐藏
      this.toogleWindow(this.markerInfoWindow, map, e.lnglat)
    },

    // 标注事件封装
    markerEvent(marker) {
      // 获取坐标，调接口获取服务区详情，并跳转到指定服务区
      // console.log("获取坐标信息", marker.De.position.lng)

      // 绍兴 （南北）
      // addressStr = ['01', '203']
      // addressStr = ['01', '204']
      // 丽水 （南北）
      // addressStr = ['02', '209']
      // addressStr = ['02', '210']
      // 衢州 （南北）
      // addressStr = ['03', '207']
      // addressStr = ['03', '208']
      // 长安 （南北）
      // addressStr = ['04', '205']
      // addressStr = ['04', '206']
      // 萧山 （东西）
      // addressStr = ['05', '201']
      // addressStr = ['05', '202']
      // 临海 （南北）
      // addressStr = ['06', '211']
      // addressStr = ['06', '212']

      let addressCode

      mapDataList.forEach(item=> {
        // 只查经度
        if(item.lnglat[0] === marker.De.position.lng.toString()) {
          // console.log(item.area)
          switch(item.area) {
            case '萧山东':
              addressCode = ['05', '201']
              break
            case '萧山西':
              addressCode = ['05', '202']
              break
            case '绍兴东':
              addressCode = ['01', '203']
              break
            case '绍兴西':
              addressCode = ['01', '204']
              break
            case '丽水南':
              addressCode = ['02', '209']
              break
            case '丽水北':
              addressCode = ['02', '210']
              break
            case '衢州南':
              addressCode = ['03', '207']
              break
            case '衢州北':
              addressCode = ['03', '208']
              break
            case '长安南':
              addressCode = ['04', '205']
              break
            case '长安北':
              addressCode = ['04', '206']
              break
            case '临海南':
              addressCode = ['06', '211']
              break
            case '临海北':
              addressCode = ['06', '212']
              break
          }
        }
      })
      // console.log(addressCode)

      this.$router.push({
        path: '/merchant/serviceArea',
        query: {
          addressCode: JSON.stringify(addressCode)
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
@mapHeight: 643px;

.amap-wrapper {
  ::v-deep .amap-box {
    width: 100%;
    height: @mapHeight;

    // 窗口
    .amap-info-content {
      .cluster_info_window, .marker_info_window {
        color: #333;
      }
    }

    // 聚合点
    .cluster_marker {
      font-family: Microsoft YaHei;
      color: #fff;
      font-weight: bold;
      background: #377DFF;
      color: #377DFF;
    }
  }
}
</style>
