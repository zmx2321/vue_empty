<template>
    <section class="main_cont amap-wrapper">
        <div class="filter_wrap">
            <el-button type="primary" @click="setCluster(0)">默认模式</el-button>
            <el-button type="primary" @click="setCluster(1)">自定义模式</el-button>
            <el-button type="primary" @click="setCluster(2)">完全自定义</el-button>
        </div>
        <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events"></el-amap>
    </section>
</template>

<script>
export default {
    name: "test_map_marker2",

    data () {
        return {
            /**
             * 地图基础属性
             */
            center: [105, 34],
            zoom: 4,
            events: {
                init: o=> {
                    // 供出地图的实例
                    window.amapview = o

                    this.initMap(o)
                }
            },
        }
    },

    computed: {
    },

    methods: {
        initMap(map) {
            let markers = []
             for (let i = 0; i < points.length; i += 1) {
                markers.push(new AMap.Marker({
                    position: points[i]['lnglat'],
                    content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
                    offset: new AMap.Pixel(-15, -15)
                }))
            }

            this.setCluster(map, markers, 2)

            

            /* let addCluster = tag=> {
                
            }

            addCluster(2); */
        },

        setCluster(map, markers, tag){
            // console.log(tag)

            let cluster

            let count = markers.length;
            let _renderClusterMarker = function (context) {
                let factor = Math.pow(context.count / count, 1 / 18);
                let div = document.createElement('div');
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
            };

            // this.initMap(window.amapview)
            if (cluster) {
                cluster.setMap(null);
            }
            if (tag == 2) {//完全自定义
                map.plugin(["AMap.MarkerClusterer"],function() {
                    cluster = new AMap.MarkerClusterer(map, markers, {
                        gridSize: 80,
                        renderClusterMarker: _renderClusterMarker
                    });
                })
            } else if (tag == 1) {//自定义图标
                let sts = [{
                    url: "https://a.amap.com/jsapi_demos/static/images/blue.png",
                    size: new AMap.Size(32, 32),
                    offset: new AMap.Pixel(-16, -16)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/green.png",
                    size: new AMap.Size(32, 32),
                    offset: new AMap.Pixel(-16, -16)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/orange.png",
                    size: new AMap.Size(36, 36),
                    offset: new AMap.Pixel(-18, -18)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/red.png",
                    size: new AMap.Size(48, 48),
                    offset: new AMap.Pixel(-24, -24)
                }, {
                    url: "https://a.amap.com/jsapi_demos/static/images/darkRed.png",
                    size: new AMap.Size(48, 48),
                    offset: new AMap.Pixel(-24, -24)
                }];
                map.plugin(["AMap.MarkerClusterer"],function() {
                    cluster = new AMap.MarkerClusterer(map, markers, {
                        styles: sts,
                        gridSize: 80
                    });
                })
            } else {//默认样式
                map.plugin(["AMap.MarkerClusterer"],function() {
                    cluster = new AMap.MarkerClusterer(map, markers, {gridSize: 80});
                })
            }
        }
    },

    created() {
        
    },

    mounted() {
        
    }
}
</script>

<style lang="less" scoped>
.amap-wrapper {
    padding: 0;
    position: relative;
    width: 100%;
    height: 100%;

    .filter_wrap, .amap-box {
        position: absolute;
    }

    .filter_wrap {
        z-index: 1;
        top: 10px;
        left: 10px;

        .el-button, .el-select {
            margin-right: 15px;
        }
    }

    .amap-box {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        
    }
}
</style>