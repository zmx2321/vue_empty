<template>
  <section class="amap-wrapper">
    <el-input v-model="POIText" class="poipicker" id="pickerInput" placeholder="输入关键字选取地点"></el-input>
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
      markerInfoData: {},  // 标注窗口数据
      POIText: "",
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
      // this.setMap(map)

      // 渲染浙江
      this.renderZheJiang(map)

      // POI搜索
      this.searchPOI(map)

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

          if(mapZoom < 7) {
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
    // 渲染浙江 - 示例
    renderZheJiang(map) {
      // console.log(map)

      let colors = [
        "#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00",
        "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707",
        "#651067", "#329262", "#5574a6", "#3b3eac"
      ];

      AMapUI.loadUI(['geo/DistrictExplorer'], function(DistrictExplorer) {
        //创建一个实例
        let districtExplorer = new DistrictExplorer({
            eventSupport: true,
            map: map
        });

        //创建一个辅助Marker，提示鼠标内容
        let tipMarker = new AMap.Marker({
            //启用冒泡，否则click事件会被marker自己拦截
            bubble: true
        });

        //监听feature的hover事件
        districtExplorer.on('featureMouseout featureMouseover', function(e, feature) {
          let isHover = e.type === 'featureMouseover';

          if (!isHover) {
              tipMarker.setMap(null);
              return;
          }

          tipMarker.setMap(map);
          tipMarker.setPosition(e.originalEvent.lnglat);
          tipMarker.setLabel({
              offset: new AMap.Pixel(20, 20),
              content: feature.properties.name
          });
        });

        //监听鼠标在feature上滑动
        districtExplorer.on('featureMousemove', function(e, feature) {
          //更新提示位置
          tipMarker.setPosition(e.originalEvent.lnglat);
        });

        //feature被点击
        districtExplorer.on('featureClick', function(e, feature) {
          console.log('点击: ' + feature.properties.name);
        });

        //外部区域被点击
        districtExplorer.on('outsideClick', function(e) {
          // console.log('区域外点击');
        });

        const renderAreaNode = areaNode=> {
          if ([310000, 330100, 330200].indexOf(areaNode.getAdcode()) >= 0) {
            //绘制子区域
            districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
              let fillColor = colors[i % colors.length];
              let strokeColor = colors[colors.length - 1 - i % colors.length];

              return {
                cursor: 'default',
                bubble: true,
                strokeColor: strokeColor, //线颜色
                strokeOpacity: 1, //线透明度
                strokeWeight: 1, //线宽
                fillColor: fillColor, //填充色
                fillOpacity: 0.35, //填充透明度
              };
            });
          }

          //绘制父区域
          districtExplorer.renderParentFeature(areaNode, {
            cursor: 'default',
            bubble: true,
            strokeColor: 'black', //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 1, //线宽
            fillColor: 'gray', //填充色
            fillOpacity: 0.2, //填充透明度
          });
        }

        let adcodes = [
          // 310000, //上海
          // 330100, //杭州
          // 330200, //宁波
          330000 //浙江
        ];

        districtExplorer.loadMultiAreaNodes(adcodes, function(error, areaNodes) {
          //设置定位节点，支持鼠标位置识别
          //注意节点的顺序，前面的高优先级
          districtExplorer.setAreaNodesForLocating(areaNodes);

          //清除已有的绘制内容
          districtExplorer.clearFeaturePolygons();

          for (let i = 0, len = areaNodes.length; i < len; i++) {
            renderAreaNode(areaNodes[i]);
          }

          //更新地图视野
          map.setFitView(districtExplorer.getAllFeaturePolygons());
        });
      });
    },
    // POI搜索
    searchPOI(map) {
      console.log('POI搜索')
      AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

      let poiPicker = new PoiPicker({
          // city:'浙江',
          input: 'pickerInput'
      });

      // 初始化poiPicker
      poiPickerReady(poiPicker);
    });

    const poiPickerReady = poiPicker=> {
        window.poiPicker = poiPicker;
        let marker = new AMap.Marker();
        let infoWindow = new AMap.InfoWindow({
          offset: new AMap.Pixel(0, -20)
        });

        //选取了某个POI
        poiPicker.on('poiPicked', function(poiResult) {
          let source = poiResult.source,
          poi = poiResult.item,
          info = {
            // source: source,
            // id: poi.id,
            name: poi.name,
            location: poi.location.toString(),
            address: poi.address
          };

          marker.setMap(map);
          infoWindow.setMap(map);

          marker.setPosition(poi.location);
          infoWindow.setPosition(poi.location);

          infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
          infoWindow.open(map, marker.getPosition());

          map.setCenter(marker.getPosition());
        });
      }
    },
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
  position: relative;

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

  .poipicker {
    position: absolute;
    left: 35px;
    top: 20px;
    width: 20%;
    z-index: 1;
  }
}
</style>
