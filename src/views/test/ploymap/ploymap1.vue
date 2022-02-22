<template>
  <section class="amap-wrapper">
    <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events"></el-amap>
  </section>
</template>

<script>
import axios from 'axios'
import ico from '@/assets/logo.png'

import { mapDataList, mapAreaDataList } from './components/mapData'

export default {
  data() {
    return {
      /**
       * 地图基本信息
       */
      center: [120.109978, 29.476335],
      zoom: 8,
      events: {
        init: o => {
          setTimeout(()=> {
            console.log("123")
          }, 10000)
          // this.initMap(o)
        }
      },

      /**
       * 地图数据
       */
      mapArea: {},  // 面
      
      circle: {},
      polygon: {},
      markers: [],  // 标注点集合
      mapAreaInfoData: {},  // 面窗口数据
      markerInfoData: {}  // 标注窗口数据
    }
  },

  computed: {
    // 面配置
    /* areaMapConfig() {
      return new AMap.Ellipse({
      //  this.circle = new AMap.Circle({  
          center: new AMap.LngLat("116.403322", "39.920255"), // 圆心位置
        //   radius: 1000,  //半径
          radius: [ 2000, 1000 ],  //半径
          strokeColor: "#F33",  //线颜色
          strokeOpacity: 1,  //线透明度
          strokeWeight: 3,  //线粗细度
          fillColor: "#ee2200",  //填充颜色
          fillOpacity: 0.35, //填充透明度
          cursor: 'pointer',
        //   strokeStyle: 'dashed',
          zIndex: 11,
      });
    }, */

    // 标注窗口
    markerInfoWindow() {
      return new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
    },

    // 面窗口
    mapAreaInfoWindow() {
      return new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
    },

    // 标注窗口信息
    markerInfo() {
      return `
        <div class="marker_info_window">
          <p style="padding-top: 10px">${this.markerInfoData.positionStr}</p>
        </div>
      `
    },

    // 面窗口信息
    mapAreaInfo() {
      return `
        <div class="marker_info_window">
          <p style="padding-top: 10px">面</p>
        </div>
      `
    },
  },

  methods: {
    /**
     * tools
     */
    // 地图初始化
    initMap(map) {
      // console.log("初始化地图", map)

      // 渲染面
      // this.renderMapArea(map)

      // 设置坐标和缩放
      // this.setMap(map)

      // // 打点
      // this.setMarker(map)

      // // this.setMarker(map)

      // // 地图点击事件
      // map.on('click', e => {
      //   // 地图坐标
      //   this.getPosition(e, map)

      //   // 关闭所有弹窗
      //   this.closeAllWindow()
      // })
    },

    // 设置坐标和缩放
    setMap(map) {
      map.on('zoomchange', () => {
        let mapZoom = map.getZoom()
        console.log(mapZoom)

        if (mapZoom >= 16) {
          this.polygon = null
          map.setZoomAndCenter(8, this.center); //同时设置地图层级与中心点

          this.setMarker(map)
        }

        if (mapZoom < 13) {
          // this.removeAllOverlay(map)
          if(!this.polygon) {
            this.renderMapArea(map)
          }
        }
      });
    },

    // 删除所有覆盖物
    removeAllOverlay(map) {
      map.clearMap();

      // console.log(this.markers)
      /* if(this.markers.length !== 0) {
        this.markers.forEach(item=> {
          console.log(11)
          map.remove(item);
        })
      } */
    },

    // 地图坐标
    getPosition(e, map) {
      console.log('您在 [' + e.lnglat.getLng() + ',' + e.lnglat.getLat() + '] 的位置点击了地图');

      console.log("当前地图的缩放级别为", map.getZoom())
    },

    /**
     * map相关
     * tools
     */
    // 根据窗口显示隐藏
    toogleWindow(infoWindowName, map, position) {
      if (infoWindowName.map) {
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
      this.closeWindow(this.markerInfoWindow)
    },

    /**
     * 面相关
     */
    // 绘制面
    renderMapArea(map) {
      console.log('绘制面', map)

      // this.mapArea = this.areaMapConfig

      // map.add(this.mapArea);
      // map.setFitView();

      // 构造矢量圆形
       this.circle = new AMap.Ellipse({
      //  this.circle = new AMap.Circle({  
          center: new AMap.LngLat("116.403322", "39.920255"), // 圆心位置
        //   radius: 1000,  //半径
          radius: [ 2000, 1000 ],  //半径
          strokeColor: "#F33",  //线颜色
          strokeOpacity: 1,  //线透明度
          strokeWeight: 3,  //线粗细度
          fillColor: "#ee2200",  //填充颜色
          fillOpacity: 0.35, //填充透明度
          cursor: 'pointer',
        //   strokeStyle: 'dashed',
          zIndex: 11,
      });
      map.setFitView();
      // map.add(this.circle);
      this.circle.setMap(map);

    //   var polygonArr = [[116.403322, 39.920255],
    //     [116.410703, 39.897555],
    //     [116.402292, 39.892353],
    //     [116.389846, 39.891365]];
    //   this.polygon = new AMap.Polygon({
    //       map: map,
    //       path: polygonArr,//设置多边形边界路径
    //       strokeColor: "#FF33FF", //线颜色
    //       strokeOpacity: 0.2, //线透明度
    //       strokeWeight: 3,    //线宽
    //       fillColor: "#1791fc", //填充色
    //       fillOpacity: 0.35//填充透明度
    //   });
    // //   map.setFitView();

    // let positionObj = {
    //   Q: 39.8999514470666,
    //   R: 116.40628264769913,
    //   lat: 39.899951,
    //   lng: 116.406283
    // }

    // // 添加内容
    //   this.markerInfoWindow.setContent(this.mapAreaInfo);

    //   // 根据窗口显示隐藏
    //   this.toogleWindow(this.markerInfoWindow, map, positionObj)

    //   this.circle.on('click', (e)=> {
    //     console.log(e)

    //     map.setZoom(20)
    //   })
    //   this.circle.on('mouseover', (e)=> {
    //     console.log(e)
    //   })
    //   this.circle.on('mouseout', (e)=> {
    //     console.log(e)
    //   })
    //   this.circle.on('change', (e)=> {
    //     console.log('666', e)
    //   })

    // this.polygon.on('click', (e)=> {
    //   console.log(11)
    //   map.setZoom(20)
    //   // console.log("123", e.lnglat)

    //    // 添加内容
    //   // this.markerInfoWindow.setContent(this.mapAreaInfo);

    //   // 根据窗口显示隐藏
    //   // this.toogleWindow(this.markerInfoWindow, map, positionObj)

    //   /* // 根据窗口显示隐藏
    //   this.toogleWindow(this.mapAreaInfoWindow, map, e.lnglat) */
    // });
    },

    /**
     * 点位相关
     */
    // 打点
    async setMarker(map) {
      // console.log("打点", map)

      let points = []
      this.markers = []

      mapDataList.forEach(item => {
        points.push({
          lnglat: item.lnglat
        })
      })

      // 创建一个 Icon
      const myIcon = new AMap.Icon({
        // 图标尺寸
        size: new AMap.Size(80, 80),
        // 图标的取图地址
        image: ico,
        // 图标所用图片大小
        imageSize: new AMap.Size(40, 40),
        // 图标取图偏移量
        imageOffset: new AMap.Pixel(5, 8)
      });

      // 配置点集合
      for (let i = 0; i < points.length; i += 1) {
        let marker = new AMap.Marker({
          position: points[i]['lnglat'],
          offset: new AMap.Pixel(-15, -15),
          clickable: true,
          icon: myIcon,  // 标注图标
        })

        this.markers.push(marker)

        // 作用地图
        marker.setMap(map);
        // map.add(marker)

        // 设置标注事件
        this.setMarkerEvent(marker, map)
      }
    },

    // 设置标注事件
    setMarkerEvent(marker, map) {
      // 标注添加事件
      AMap.event.addListener(marker, 'click', () => {
        // 事件对象的坐标不准确

        // 标注点击事件封装
        this.markerEvent(marker)
      })
      AMap.event.addListener(marker, 'mouseover', e => {
        this.markerHoverEvent(e, map, marker)
      })
      AMap.event.addListener(marker, 'mouseout', () => {
        this.closeAllWindow()
      })
    },

    // 标注点击事件封装
    markerEvent(marker) {
      // console.log(marker)

      mapDataList.forEach(item => {
        // 只查经度
        if (item.lnglat[0] === marker.De.position.lng.toString()) {
          console.log(item.area)
        }
      })
    },

    // 鼠标移入标注封装
    markerHoverEvent(e, map, marker) {
      let addressStr = ""

      mapDataList.forEach(item => {
        // 只查经度
        if (item.lnglat[0] === marker.De.position.lng.toString()) {
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
  }
}
</script>

<style lang="less" scoped>
@mapHeight: calc(100vh - 60px - 1px);

.amap-wrapper {


  ::v-deep .amap-box {
    width: 100%;
    height: @mapHeight;

    // 窗口
    .amap-info-content {
      .cluster_info_window,
      .marker_info_window {
        color: #333;
      }
    }

    // 聚合点
    .cluster_marker {
      font-family: Microsoft YaHei;
      color: #fff;
      font-weight: bold;
      background: #377dff;
      color: #377dff;
    }
  }
}
</style>
