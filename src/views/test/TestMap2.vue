<template>
    <section class="main_cont amap-wrapper">
        <el-button type="primary" @click="toChongqing">重庆</el-button>
        <el-button type="primary" @click="toShangHe">上河镇</el-button>
        <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events"></el-amap>
    </section>
</template>

<script>
import shzjson from '@/assets/geojson/shz.json'

export default {
    name: "testmap",

    data () {
        return {
            center: [120.21272954752699,29.93745044968425],
            zoom: 12,
            events: {
                init: o=> {
                    // 供出地图的实例
                    window.amapview = o

                    // 获取地图信息
                    this.getMapInfo()

                    // 获取重庆
                    this.getGeoJson()

                    // 获取上河
                    this.testJson()
                }
            }
        }
    },

    computed: {
    },

    methods: {
        // 获取地图信息
        getMapInfo() {
            console.log("AMap", AMap)

            // 必须是异步
            setTimeout(() => {
                console.log("amapview", window.amapview)

                window.amapview.on('click', e=> {
                    // console.log("地图点击事件", e)

                    // 地图坐标
                    this.getPosition(e)
                })

                /* window.amapview.on('zoomend', ()=> {
                    this.logMapinfo()
                }) */

                window.amapview.on('moveend', ()=> {
                    this.logMapinfo()
                })
            }, 0);
        },

        // 获取地图信息
        logMapinfo() {
            console.log("当前级别", window.amapview.getZoom())
            console.log("当前中心点", window.amapview.getCenter())
        },

        // 地图坐标
        getPosition(e) {
            console.log('您在 ['+e.lnglat.getLng()+','+e.lnglat.getLat()+'] 的位置点击了地图');
        },

        toChongqing() {
            window.amapview.setZoom("7"); //设置地图层级
            window.amapview.setCenter([107.943579, 30.131735]); //设置地图层级
        },

        toShangHe() {
            window.amapview.setZoom("12"); //设置地图层级
            window.amapview.setCenter([120.21272954752699,29.93745044968425]); //设置地图层级
        },

        /**
         * geojson相关
         */
        // 初始化geojson
        initGeojsonLayer(data) {
            return new AMap.GeoJSON({
                // 要加载的标准GeoJSON对象
                geoJSON: data,

                // 指定面要素的绘制方式，缺省时为Polygon的默认样式。
                // geojson为当前要素对应的GeoJSON对象，lnglats为对应的面的路径
                getPolygon(geojson, lnglats) {
                    // console.log(geojson)

                    return new AMap.Polygon({
                        path: lnglats,
                        fillOpacity: 0.5,
                        strokeColor: 'white',
                        fillColor: 'red'
                    });
                }
            })
        },

        // 获取geojson
        getGeoJson() {
            this.axios.get("https://a.amap.com/jsapi_demos/static/geojson/chongqing.json").then(res=> {
                // console.log(res.data)

                // 获取geojson数据
                let geoJSONData = res.data;

                // 初始化geojson，获取geojson地图对象
                let geojsonLayer = this.initGeojsonLayer(geoJSONData)

                // 隐藏所有覆盖物
                // geojsonLayer.hide()

                // 遍历geojson地图对象，绑定事件
                geojsonLayer.eachOverlay(iterator => {
                    // console.log(iterator)

                    iterator.on('click', e=> {
                        // console.log("地图点击事件", e)
                        // console.log("geojson单个对象", iterator)

                        // 获取geojson事件
                        this.getGeoEvent(e, iterator)
                    })
                })

                this.$message.success("geojson加载成功")

                // console.log("amapview", window.amapview)
                // console.log(geojsonLayer)

                // 设置地图
                geojsonLayer.setMap(window.amapview);
            }).catch({})
        },

        // 获取geojson事件
        getGeoEvent(e, geoitem) {
            // console.log('点击geojson ['+e.lnglat.getLng()+','+e.lnglat.getLat()+']');
            // console.log("geojson单个对象", geoitem)

            let geojsonItem = geoitem.toGeoJSON()
            // console.log("地图对象转geojson", geojsonItem)

            console.log("区县名称", geojsonItem.properties.name)

            // 设置颜色
            let geojsonLayerItem = new AMap.GeoJSON({
                // 要加载的标准GeoJSON对象
                geoJSON: geojsonItem,

                getPolygon(geojson, lnglats) {
                    // console.log(geojson)

                    return new AMap.Polygon({
                        path: lnglats,
                        // fillOpacity: 0.5,
                        strokeColor: 'white',
                        fillColor: 'red'
                    });
                }
            })

            geojsonLayerItem.setMap(window.amapview);

            // 点击之后鼠标移除事件
            /* geoitem.on('mouseout', ()=> {
                // console.log("点击之后鼠标移除事件")

                // console.log(geoitem.w.fillOpacity);

                // this.getGeoJson();
                let geojsonLayerItemInit = new AMap.GeoJSON({
                    // 要加载的标准GeoJSON对象
                    geoJSON: geojsonItem,

                    getPolygon(geojson, lnglats) {
                        // console.log(geojson)

                        return new AMap.Polygon({
                             path: lnglats,
                            // fillOpacity: 0.5,
                            strokeColor: 'white',
                            fillColor: 'blue'
                        });
                    }
                })
                
                geojsonLayerItemInit.setMap(window.amapview);
            }) */
        },

        testJson() {
            // console.log("test", testjson)

            let geojsonLayer = this.initGeojsonLayer(shzjson)
            // console.log(geojsonLayer)

            // 必须是异步
            setTimeout(() => {
                // console.log("地图对象", window.amapview)
                // console.log("geojson地图对象", geojsonLayer)

                // 在地图上渲染
                geojsonLayer.setMap(window.amapview);

                // 遍历并添加事件
                geojsonLayer.eachOverlay(iterator => {
                    // console.log(iterator)

                    iterator.on('mouseover', e=> {
                        console.log("地图滑动事件", e)
                        console.log("geojson单个对象", iterator)

                        // 获取geojson事件
                        // this.getGeoEvent(e, iterator)

                        let geojsonItem = iterator.toGeoJSON()
                        console.log("地图对象转geojson", geojsonItem.properties.Name)

                        /* if(geojsonItem.properties._parentProperities) {
                            console.log("名称", geojsonItem.properties._parentProperities.name)
                        } */
                    })
                })
            }, 0); 
        },
    },

    created() {
        this.testJson()
    },

    mounted() {
    }
}
</script>

<style lang="less" scoped>
.amap-wrapper {
  width: 100%;
  height: 100%;
}

.main_cont {
    padding: 0
}
</style>