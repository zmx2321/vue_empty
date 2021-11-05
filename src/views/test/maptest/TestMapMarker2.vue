<template>
    <section class="main_cont amap-wrapper">
        <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events">
        </el-amap>
    </section>
</template>

<script>
export default {
    name: "test1",

    data () {
        return {
          center: [107.943579, 30.131735],
          zoom: 7,
          events: {
            init: o=> {
              // 供出地图的实例
              window.amapview = o

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
      }
    },

    methods: {
      /**
       * tools
       */
      // 地图坐标
      getPosition(e) {
        console.log('您在 ['+e.lnglat.getLng()+','+e.lnglat.getLat()+'] 的位置点击了地图');
      },

      /**
       * api tools
       */
      // 获取点位
      getPointData() {
        return new Promise((resolve, reject)=> {
          this.axios.get('http://a.amap.com/jsapi_demos/static/china.js').then(res=> {
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
      // 打点
      async setMarker(map) {
        // console.log("打点", map)

        let _this = this;
        let markers = [], cluster;
        let points = await this.getPointData()

        for (let i = 0; i < points.length; i += 1) {
          markers.push(new AMap.Marker({
            position: points[i]['lnglat'],
            offset: new AMap.Pixel(-15, -15)
          }))
        }

        // 聚合
        map.plugin(["AMap.MarkerClusterer"],function() {
          cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
        })


        let marker = new AMap.Marker({
            map: map,
            position: map.getCenter()
        });

        // 展示气泡
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], SimpleInfoWindow=> {
          let infoWindow = new SimpleInfoWindow(_this.infoObj);

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

      // 气泡
      setPopBox(map) {
        let _this = this;

        let marker = new AMap.Marker({
            map: map,
            position: map.getCenter()
        });
        // console.log(marker)

        // 展示气泡
        AMapUI.loadUI(['overlay/SimpleInfoWindow'], SimpleInfoWindow=> {
          let infoWindow = new SimpleInfoWindow(_this.infoObj);

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

      // 地图初始化
      initMap(map) {
        // console.log("初始化地图", map)

        // 打点
        this.setMarker(map)

        // 气泡
        // this.setPopBox(map)

        // 地图点击事件
        map.on('click', e=> {
          // 地图坐标
          this.getPosition(e)
        })
      }
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