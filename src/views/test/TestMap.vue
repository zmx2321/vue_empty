<template>
    <section class="main_cont amap-wrapper">
        <el-amap ref="map" class="amap-box" :vid="'amap-vue'" :center='center' :zoom='zoom' :events="events"></el-amap>
    </section>
</template>

<script>
export default {
    name: "testmap",

    data () {
        return {
            center: [107.943579, 30.131735],
            zoom: 7,
            events: {
                init: o=> {
                    window.amapview = o

                    // o.setMapStyle('amap://styles/macaron');//自定义的高德地图的样式，我选的是马卡龙
                }
            }
        }
    },

    computed: {
    },

    methods: {
        getGeoJson() {
            this.axios.get("https://a.amap.com/jsapi_demos/static/geojson/chongqing.json").then(res=> {
                // console.log(res.data)

                let geoJSONData = res.data;

                let geojson = new AMap.GeoJSON({
                    geoJSON: geoJSONData,
                    // 还可以自定义getMarker和getPolyline
                    getPolygon: function(geojson, lnglats) {
                        // 计算面积
                        let area = AMap.GeometryUtil.ringArea(lnglats[0])

                        return new AMap.Polygon({
                            path: lnglats,
                            fillOpacity: 1 - Math.sqrt(area / 8000000000),// 面积越大透明度越高
                            strokeColor: 'white',
                            fillColor: 'red'
                        });
                    }
                })

                geojson.setMap(window.amapview);
            }).catch({})
        }
    },

    created() {
        this.getGeoJson()
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