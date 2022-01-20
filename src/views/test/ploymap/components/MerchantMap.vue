<template>
  <section class="amap-wrapper">
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
        center: [120.109978,29.476335],
        zoom: 8,
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
        <p>聚合</p>
        <div class="cluster_info_window info_window">
          <ul>
            <li>
              <dl>
                <dt>半年内到期商铺：1</dt>
              </dl>
            </li>
            <li>
              <dl>
                <dt>空余商铺：1</dt>
              </dl>
            </li>
            <li>
              <dl class="f-cb">
                <dt class="f-fl">服务区：1</dt>
              </dl>
            </li>
          </ul>
        </div>
        <div class="cluster_info_window">
          <p>聚合数量：${this.clusterInfoData.count}</p>
          <p>所有坐标：<br />${this.clusterInfoData.positionList}</p>
        </div>
      `
    },

    // 标注窗口信息
    markerInfo() {
      return `
        <div class="marker_info_window">
          <p style="padding-top: 10px">${this.markerInfoData.positionStr}</p>
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
      this.setMap(map)

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
    setMap(map) {
      map.on('zoomchange', ()=> {
        let mapZoom = map.getZoom()
        // console.log(mapZoom)

        if(mapZoom <= 8) {
          map.setZoomAndCenter(8, this.center); //同时设置地图层级与中心点
        }
      });
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
      // 文字
      div.innerHTML = "",
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
        imageSize: new AMap.Size(40, 40),
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
      console.log(context)

      let positionArr = []
      let positionStr = ''

      let addressStrArr = []
      let positionListStr = ''

      // 获取聚合中所有的点位坐标，传给后端
      context.markers.forEach(item=> {
        mapDataList.forEach(mpList=> {
          if(mpList.lnglat[0] === item.De.position.lng.toString()) {
            // console.log(mpList.area)
            addressStrArr.push(mpList.area + "服务区")
          }
        })
        // console.log(item.De.position)
        positionArr.push([item.De.position.lng, item.De.position.lat])
        positionStr += `[${item.De.position.lng},${item.De.position.lat}] \n`
      })
      addressStrArr = Array.from(new Set(addressStrArr))
      // console.log(addressStrArr)
      addressStrArr.forEach(item=> {
        positionListStr += item + ","
      })
      positionListStr = positionListStr.substring(0, positionListStr.lastIndexOf(','));
      // console.log(positionListStr)

      // 聚合数据 - 后端返回的数据用这个对象接收
      this.clusterInfoData = {
        count: context.count.toString(),
        positionList: positionStr,
        positionListStr: positionListStr
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
          // console.log(item.area)

          // addressStr = item.area + item.direction
          addressStr = item.area
        }
      })

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
      let addressIds = []

      mapDataList.forEach(item=> {
        // 只查经度
        if(item.lnglat[0] === marker.De.position.lng.toString()) {
          if(item.id.length !== 0) {
            addressIds = item.id
          }
        }
      })
      // console.log(addressIds)

      this.$router.push({
        path: '/merchant/serviceArea',
        query: {
          addressIds: JSON.stringify(addressIds)
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
