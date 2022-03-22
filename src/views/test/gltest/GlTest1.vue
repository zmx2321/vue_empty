<template>
    <section class="main_cont">
        <!-- <img src="@/assets/images/test/t2.jpg" alt=""> -->
        <!-- <span class="bbk a1"></span> -->
        <div id="map"></div>
    </section>
</template>

<script>
export default {
    name: "gltest1",

    data () {
        return {
            
        }
    },

    methods: {
        async init() {
            /**
             * 方案一：
             * 在图片上添加锚点，触发事件
             * 缺点：工作量大，并且无法准确定位锚点位置，页面缩放布局全部乱掉，不能使用该方案
             * 
             * 方案二：
             * 使用地图上的室内地图
             * 缺点：地图上信息不全，不建议使用
             * 
             * 方案一二不能使用，接下来的大方向主要就是平面图要自己做
             * 自己做有两种方案，第一是人工建模，第二是通过cad导出
             * 
             * 人工建模没有相关专业人员，并且在平面地图上也不知道使用哪种数据格式
             * 假设可以使用人工建模，维护成本也会非常大，每次地理信息数据一修改，就需要修改模型数据重新导入，比较麻烦
             * 不是很推荐
             * 
             * 如果可以直接将cad图纸转换成网页文件，或许就不用考虑人工建模了
             * https://vjmap.com/demo/#/gallery/map
             * https://vjmap.com/
             */
            console.log("init")

            let env = {
                accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..VQchVXxgjl5aCp3j3Uf5U2Mpk1NJNirH62Ys-8XOfnY",
                exampleMapId: "sys_zp",
                exampleMapId2: "sys_world",
                serviceUrl: "https://vjmap.com/server/api/v1"
                // serviceUrl: "http://127.0.0.1:6080/dwg/aa.dwg"
            }

            // console.log(env)
            // 新建地图服务对象，传入服务地址和token    
            let svc = new vjmap.Service(env.serviceUrl, env.accessToken)
            console.log(svc)
            // 打开地图
            let res = await svc.openMap({
                mapid: env.exampleMapId, // 地图ID,(请确保此ID已存在，可上传新图形新建ID)
                mapopenway: vjmap.MapOpenWay.GeomRender, // 以几何数据渲染方式打开
                style: vjmap.openMapDarkStyle() // div为深色背景颜色时，这里也传深色背景样式
            })
            console.log()
            if (res.error) {
                message.error(res.error)
            }

            // 获取地图的范围
            let mapExtent = vjmap.GeoBounds.fromString(res.bounds);
            // 建立坐标系
            let prj = new vjmap.GeoProjection(mapExtent);

            // 新建地图对象
            let map = new vjmap.Map({
                container: 'map', // container ID
                style: svc.vectorStyle(), // 矢量瓦片样式
                center: prj.toLngLat(mapExtent.center()), // 中心点
                zoom: 2,
                renderWorldCopies: false
            });
            // 地图关联服务对象和坐标系
            map.attach(svc, prj);
            // 使地图全部可见
            map.fitMapBounds();
            // 获取所有图层
            const layers = svc.getMapLayers();
            // 实体类型ID和名称映射
            const { entTypeIdMap } = await svc.getConstData();
        }
    },

    created() {
        this.init();
    }
}
</script>

<style lang="less" scoped>
.main_cont {
    padding: 0;
    position: relative;
    background: #000;

    #map {
        width: 100%;
        height: 100%;
    }

    img {
        width: 100%;
        height: 100%;
    }

    .bbk {
        width: 10px;
        height: 10px;
        background: #f00;
    }

    .a1 {
        position: absolute;
        top: 800px;
        left: 100px;

    }
}
</style>