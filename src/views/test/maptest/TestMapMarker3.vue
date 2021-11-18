<template>
    <section class="main_cont amap-wrapper">
        <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events">
        </el-amap>
    </section>
</template>

<script>
import axios from 'axios'
import ico from '../../../assets/logo.png'

export default {
    name: "test1",

    data () {
        return {
          center: [107.943579, 30.131735],
          zoom: 7,
          resizeEnable: true,
          events: {
            init: o=> {
              this.initMap(o)
            }
          },

          markers: [],
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
    },

    methods: {
      /**
       * tools
       */
      // 地图坐标
      getPosition(e) {
        console.log('您在 ['+e.lnglat.getLng()+','+e.lnglat.getLat()+'] 的位置点击了地图');
      },

      // 地图初始化
      initMap(map) {
        // console.log("初始化地图", map)

        // 打点
        this.setMarker(map)

        // 气泡
        // this.setPopBox(map)

        // this.setMarker2(map)

        // 地图点击事件
        map.on('click', e=> {
          // 地图坐标
          this.getPosition(e)

          this.closeWindow(this.clusterInfoWindow)
          this.closeWindow(this.markerInfoWindow)
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
       * map相关
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

      // 聚合事件封装
      clusterMarkerEvent(context, map) {
        // 添加内容
        this.clusterInfoWindow.setContent(context.count.toString());

        // 关闭弹窗
        this.openWindow(this.clusterInfoWindow, map, context.marker.Ce.position)
      },

      // 标注事件封装
      markerEvent(e, map) {
        // 添加内容
        this.markerInfoWindow.setContent(e.target.content);

        // 根据窗口显示隐藏
        this.toogleWindow(this.markerInfoWindow, map, e.lnglat)
      },

      // 打点并聚合
      async setMarker(map) {
        // console.log("打点", map)

        let _this = this
        let markers = [], cluster
        let points = await this.getPointData()

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
            icon: myIcon,
          })
          marker.content = '我是第' + (i + 1) + '个Marker';
          markers.push(marker)
          // 标注添加事件
          AMap.event.addListener(marker, 'click', e=> {
            // console.log(e)

            // 标注事件封装
            this.markerEvent(e, map)
          })
        }

        let count = markers.length;
        let _renderClusterMarker = context=> {
          // 创建
          let factor = Math.pow(context.count / count, 1 / 18);
          let div = document.createElement('div');
          div.className = "cluster_marker"
          // 定义样式
          let Hue = 180 - factor * 180;
          let bgColor = 'hsla(' + Hue + ',100%,50%,0.7)';
          let fontColor = 'hsla(' + Hue + ',100%,20%,1)';
          let borderColor = 'hsla(' + Hue + ',100%,40%,1)';
          let shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
          div.style.backgroundColor = bgColor;
          let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
          div.style.width = div.style.height = size + 'px';
          div.style.border = 'solid 1px ' + borderColor;
          div.style.borderRadius = size / 2 + 'px';
          div.style.boxShadow = '0 0 1px ' + shadowColor;
          div.innerHTML = context.count;
          div.style.lineHeight = size + 'px';
          div.style.color = fontColor;
          div.style.fontSize = '14px';
          div.style.textAlign = 'center';
          context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
          context.marker.setContent(div)
          // 聚合添加事件
          div.addEventListener('mouseover', ()=>{
            // 聚合事件封装
            this.clusterMarkerEvent(context, map)
          })
        }

        // 聚合
        map.plugin(["AMap.MarkerClusterer"],function() {
          cluster = new AMap.MarkerClusterer(map, markers, {
            gridSize: 80,
            // zoomOnClick: false,  // 阻止聚合
            renderClusterMarker: _renderClusterMarker
          });
          // 绑定聚合点击事件
          cluster.on('click', ()=> {
            // console.log("绑定聚合点击事件")
            _this.closeWindow(_this.clusterInfoWindow)
            // _this.toogleWindow(_this.clusterInfoWindow, map, e.lnglat)
          })
        })
      },

      setMarker2(map) {
        var lnglats = [
          [116.368904, 39.923423],
          [116.382122, 39.921176],
          [116.387271, 39.922501],
          [116.398258, 39.914600]
        ];

        var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

        for (var i = 0, marker; i < lnglats.length; i++) {
            var marker = new AMap.Marker({
                position: lnglats[i],
                map: map
            });
            marker.content = '我是第' + (i + 1) + '个Marker';
            marker.on('mouseover', markerClick);
            marker.emit('mouseover', {target: marker});
        }

        function markerClick(e) {
          infoWindow.setContent(e.target.content);
          infoWindow.open(map, e.target.getPosition());

          console.log(e.target.getPosition())
        }
        map.setFitView();
      },

      // 气泡
      setPopBox(map) {
        let _this = this;

        let marker = new AMap.Marker({
            map: map,
            position: map.getCenter()
        });

        // 展示气泡
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], SimpleInfoWindow=> {
          let infoWindow = new SimpleInfoWindow(_this.infoObj);
          // console.log(SimpleInfoWindow)

          infoWindow.open(map, marker.getPosition());

          // marker 点击时
          marker.on('click', ()=> {
            if(infoWindow.map) {
              infoWindow.close(map, marker.getPosition());
            } else {
              infoWindow.open(map, marker.getPosition());
            }
          });
        });
      },
    },

    created() {

    }
}
</script>

<style lang="less" scoped>
.amap-wrapper {
  .amap-box {
    width: 100%;
    height: 500px;
  }
}
</style>