<template>
    <section class="main_cont amap-wrapper">
        <el-button type="primary" @click="toChongqing">重庆</el-button>
        <el-button type="primary" @click="toShangHe">上河镇</el-button>
        <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events"></el-amap>

        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <span>这是一段信息</span>
            <p>城市名称：{{ cityName }}</p>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            </el-dialog>
    </section>
</template>

<script>
import shzjson from '@/assets/geojson/shz.json'

export default {
    name: "testmap2",

    data () {
        return {
            center: [107.943579, 30.131735],
            zoom: 7,
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
            },

            dialogVisible: false,

            cityName: "",
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

        debounce(fn, delay = 500) {
            // timer是在闭包中的 => 下面的if(timer)
            // 这样不会被外界轻易拿到 => 即不对外暴露
            // 我们在外面使用不需要关心
            // 同时也是在debounce的作用域中
            // 闭包的使用场景：函数当做返回值或者参数传入
            let timer = null;

            // 函数作为返回值，这就形成闭包了
            return function() {
                // 这里面的timer需要在它定义的作用域往上寻找
                if(timer) {
                    clearTimeout(timer)
                }

                timer = setTimeout(()=> {
                    // 触发change事件
                    // 第一个参数是改变this指向
                    // 第二个参数是获取所有的参数
                    // apply第二个参数开始，只接收数组
                    // fn函数在执行的时候，argument传进来
                    // debounce返回的函数可能会传进来一些参数
                    // 面试使用fn()也没问题
                    // fn()
                    fn.apply(this, arguments)  

                    // 清空定时器
                    timer = null
                }, delay)
            }
        },

        /**
         * geojson相关
         */
        // 初始化geojson配置
        initGeojsonLayer(data, fillColor) {
            return new AMap.GeoJSON({
                // 要加载的标准GeoJSON对象
                geoJSON: data,

                // 指定面要素的绘制方式，缺省时为Polygon的默认样式。
                // geojson为当前要素对应的GeoJSON对象，lnglats为对应的面的路径
                getPolygon(geojson, lnglats) {
                    // console.log(geojson)

                    let area = AMap.GeometryUtil.ringArea(lnglats[0])

                    return new AMap.Polygon({
                        // 路径
                        path: lnglats,
                        // 面
                        fillOpacity: 1 - Math.sqrt(area / 8000000000),// 面积越大透明度越高
                        // fillOpacity: 0.5,
                        fillColor: fillColor,
                        // 线
                        strokeColor: '#fff',
                        strokeWeight: 0.6,    //线宽
                        strokeStyle: "solid",
                        strokeOpacity: 1, //线透明度
                    });
                }
            })
        },

        // 初始化geojson并绑定事件
        setGeoJsonLayer(geoJSONData, color, event, next) {
            let geojsonLayer = this.initGeojsonLayer(geoJSONData, color)

            geojsonLayer.eachOverlay(iterator => {
                /* iterator.on(event, e=> {
                    // console.log("地图点击事件", e)
                    // console.log("geojson单个对象", iterator)

                    // geojson事件内容 - 高亮
                    next(e, iterator)
                }) */
                iterator.on(event, this.debounce(e=> {
                    next(e, iterator)
                }), 0)
            })
            geojsonLayer.setMap(window.amapview);
        },

        // 配置geojson事件
        getGeoEvent(e, geoitem, next) {
            // console.log('点击geojson ['+e.lnglat.getLng()+','+e.lnglat.getLat()+']');
            // console.log("geojson单个对象", geoitem)

            // 将当前地图对象转换成geojson格式以便获取数据
            let geojsonItem = geoitem.toGeoJSON()

            // 获取第一层geojson
            let geojsonLayerItem = this.initGeojsonLayer(geojsonItem, "#00f")

            // 点击第一层触发事件 - 鼠标点击设置地图
            geojsonLayerItem.setMap(window.amapview);

            // 第二层触发事件 - 鼠标移除
            geojsonLayerItem.on('mouseout', ()=> {
                console.log("鼠标移除事件")

                geojsonLayerItem.hide()
            })

            // 第二层触发事件 - 鼠标点击
            geojsonLayerItem.on('click', ()=> {
                console.log("鼠标点击事件")

                // geojsonLayerItem.hide()

                // 处理业务流程
                next(geojsonItem)
            })
        },

        /**
         * 使用
         */
        // 获取geojson示例
        getGeoJson() {
            this.axios.get("https://a.amap.com/jsapi_demos/static/geojson/chongqing.json").then(res=> {
                // console.log(res.data)

                // 获取geojson数据
                let geoJSONData = res.data;

                /* debounce(e=> {
      console.log(e.target)  // 如果不传arguments，在这里无法识别e，也就无法获取当前dom
      console.log(input1.value);
  }), 600 */

                // 初始化geojson，获取geojson地图对象
                this.setGeoJsonLayer(geoJSONData, "#f00", 'mouseover', (e, iterator)=> {
                    // 给当前面添加事件
                    this.getGeoEvent(e, iterator, geojsonItem=> {
                        // 处理业务流程
                        console.log("处理geojson业务流程")

                        this.dialogVisible = true  // 显示弹窗

                        if(geojsonItem.properties.name) {
                            this.cityName = geojsonItem.properties.name
                            console.log("区县名称", geojsonItem.properties.name)
                        } else {
                            console.log("区县名称", geojsonItem.properties.Name)
                        }
                    })
                })

                this.$message.success("geojson加载成功")
            }).catch({})
        },

        // 获取geojson测试
        testJson() {
            // 初始化geojson，获取geojson地图对象
            this.setGeoJsonLayer(shzjson, "#f00", 'mouseover', (e, iterator)=> {
                // console.log()
                this.getGeoEvent(e, iterator, geojsonItem=> {
                    // 处理业务流程
                    console.log("处理testJson业务流程")

                    this.dialogVisible = true  // 显示弹窗

                    if(geojsonItem.properties.name) {
                        console.log("区县名称", geojsonItem.properties.name)
                    } else {
                        this.cityName = geojsonItem.properties.Name
                        console.log("区县名称", geojsonItem.properties.Name)
                    }
                })
            })
        },
    },

    created() {
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