<template>
  <section class="amap-wrapper">
    <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events"></el-amap>
  </section>
</template>

<script>

import { mapDataList, ploymapDataList } from './components/mapData'
import ico from '@/assets/logo.png'

export default {
  data() {
    return {
      /**
       * 地图基本信息
       */
      center: [120.273703,30.177084],
      zoom: 13,
      events: {
        init: o => {
          this.initMap(o)
        }
      },

      /**
       * 地图数据
       */
      polygon: {},
      markers: [],  // 标注点集合
      polygonInfoData: {},  // 面窗口数据
      markerInfoData: {}  // 标注窗口数据
    }
  },

  computed: {
    // 标注窗口
    markerInfoWindow() {
      return new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
    },

    // 面窗口
    polygonInfoWindow() {
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
    polygonInfo() {
      return `
        <div class="marker_info_window">
          <p style="padding-top: 10px">${this.polygonInfoData.name}</p>
          ${this.polygonInfoData.name}
          ${this.polygonInfoData.detail}
        </div>
      `
    },
  },

  methods: {
    /**
     * 地图加载
     */
    // 
    initMap(map) {
      // 地图点击事件
      map.on('click', e=> {
        // 地图坐标
        this.getPosition(e, map)
      })

      /**
     * 地图进入，显示若干个面
     * 鼠标移入面显示当前区域详情
     * 点击面 
     *  1、清除地图所有图层
     *  2、设置地图缩放比例
     *  3、打点
     *  4、点位绑定点击和移入移出事件
     * 地图缩放清除所有图层并显示面
     * 地图放大显示之前的坐标点
     * 鼠标移入面并放大显示当前面中的坐标点
     */
    
      // 设置坐标和缩放
      this.setMap(map)

      // 渲染面
      this.drawAllPolygon(map)
    },

    /**
     * 地图初始化
     */
    // 设置坐标和缩放
    setMap(map) {
      /**
       * 判断覆盖物类型
       * 如果是点，缩放回到面
       * 如果是面，限制缩放 8-18
       */
      map.on('zoomchange', () => {
        let mapZoom = map.getZoom()
        // console.log(mapZoom)

        let isPolygon = map.getAllOverlays('marker').length === 0  // 判断当前覆盖物是否为面
        // console.log(isPolygon)

        // 如果不为面
        if(!isPolygon) {
          // console.log("为点")

          if(mapZoom < 8) {
            this.drawAllPolygon(map)
          }
        } else {
          // 为面，限制缩放
          if(mapZoom < 8 || mapZoom >= 18) {
            map.setFitView();  // 自适应
          }
        }
      });
    },

    /**
     * 地图工具集
     */
    // 地图坐标
    getPosition(e, map) {
      console.log('您在 ['+e.lnglat.getLng()+','+e.lnglat.getLat()+'] 的位置点击了地图');

      console.log("当前地图的缩放级别为", map.getZoom())
    },
    // 打开弹窗
    openWindow(infoWindowName, map, position) {
      infoWindowName.open(map, position);
    },
    // 关闭弹窗
    closeWindow(infoWindowName) {
      infoWindowName.close();
    },
    // 面配置
    polygonConfig(map, polygonArr) {
      return new AMap.Polygon({
        map: map,
        path: polygonArr,//设置多边形边界路径
        strokeColor: "#FF33FF", //线颜色
        strokeOpacity: 0.2, //线透明度
        strokeWeight: 3,    //线宽
        fillColor: "#1791fc", //填充色
        fillOpacity: 0.35//填充透明度
      });
    },

    /**
     * 地图图层数据
     */
    // 绘制面
    drawAllPolygon(map) {
      // console.log('绘制面', map, ploymapDataList)
      
      map.clearMap()

      let polygonList = []
      ploymapDataList.forEach(item=> {
        // console.log(item)

        let polygonItem = this.polygonConfig(map, item.positionList)
        polygonList.push(polygonItem)
        // console.log(polygonItem)

        // 面绑定事件
        this.polygonEvent(map, item, polygonItem)
      })
      map.add(polygonList);  // 地图渲染
      map.setFitView();  // 自适应
    },
    // 封装面事件
    polygonEvent(map, item, polygonItem) {
      // 鼠标移入，显示弹窗
      polygonItem.on('mouseover', e=> {
        // 配置详情数据
        this.polygonInfoData = {
          name: item.name,
          detail: item.detail,
        }
        this.polygonInfoWindow.setContent(this.polygonInfo);  // 添加内容
        this.openWindow(this.polygonInfoWindow, map, e.lnglat)  // 显示窗口
      })
      // 鼠标移出，删除弹窗
      polygonItem.on('mouseout', ()=> {
        this.closeWindow(this.polygonInfoWindow)  // 隐藏窗口
      })

      /**
       * * 点击面 
       *  1、清除地图所有图层
       *  2、打点 - 自适应
       *  3、点位绑定点击和移入移出事件
       */
      // 点击面
      polygonItem.on('click', ()=> {
        console.log(this.polygonInfoData)

        // 打点
        this.setMarker(map)
      })
      
    },

    // 打点
    async setMarker(map) {
      // console.log("打点", map)

      map.clearMap()

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
        map.setFitView();  // 自适应

        // 设置标注事件
        this.setMarkerEvent(marker, map)
      }
    },
    // 标注事件封装
    setMarkerEvent(marker, map) {
      // 鼠标移入
      AMap.event.addListener(marker, 'mouseover', e => {
        this.markerHoverEvent(e, map, marker)
      })
      // 鼠标移出
      AMap.event.addListener(marker, 'mouseout', () => {
        this.closeWindow(this.markerInfoWindow)  // 隐藏窗口
      })
      // 鼠标点击
      AMap.event.addListener(marker, 'click', () => {
        // 事件对象的坐标不准确

        // 标注点击事件封装
        this.markerEvent(marker)
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
    // 鼠标移出标注封装
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
      this.openWindow(this.markerInfoWindow, map, e.lnglat)
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
