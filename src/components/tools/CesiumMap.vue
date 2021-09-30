<template>
    <section class="cesium-map-wrapper" id="cesiumContainer"></section>
</template>

<script>
export default {
    name: "cesium-map-wrapper",

    data () {
        return {
            // 场景初始化
            resetViewer: {
                // sceneMode : Cesium.SceneMode.SCENE2D, // 初始场景模式 为二维
                animation: false,  // 动画控制     
                timeline: false,    // 时间线
                fullscreenButton: true, // 全屏按钮
                geocoder: true,  // 查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
                homeButton: false,  // 视角返回初始位置
                sceneModePicker: false,  // 选择视角的模式，有三种：3D，2D，哥伦布视图（CV）
                baseLayerPicker: true,  //  图层选择器，选择要显示的地图服务和地形服务
                navigationHelpButton: false,  // 导航帮助按钮，显示默认的地图控制帮助
                // scene3DOnly : true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
                // infoBox: true,  //是否显示点击要素之后显示的信息
            }
        }
    },

    methods: {
        resetCesiumView() {
            // 初始化地球
            let cesiumViewer = new Cesium.Viewer("cesiumContainer", this.resetViewer)

            // 版权清理
            cesiumViewer.bottomContainer.style.display = "none";

            // 搜索框
            // cesiumViewer.geocoder.container.style.display = "none";

            // 底图
            cesiumViewer.baseLayerPicker._element.style.display = "none";

            // 鼠标功能

            // 设置地图地图
            this.resetMapLayer(cesiumViewer)

            // this.addTxLayer(cesiumViewer);  // 添加腾讯底图
            this.addGdLayer(cesiumViewer);  // 添加高德底图
            
            // 绑定事件
            cesiumViewer.camera.changed.addEventListener(function (percentage) {
                console.log("地球转动之后的触发事件")
            });

            // 设置地球
            this.$emit("resetViewer", cesiumViewer)

            // 供出
            window.cesiumViewer = cesiumViewer;
        },

        // 设置地图地图
        resetMapLayer(viewer) {
            //定义ImageryProvider：
            let esriMap = new Cesium.ArcGisMapServerImageryProvider({
                url:'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
                enablePickFeatures:false
            });

            //设置ProviderViewModel：
            let esriMapModel = new Cesium.ProviderViewModel({
                name:'esri Maps',
                iconUrl:Cesium.buildModuleUrl('./Widgets/Images/ImageryProviders/esriWorldImagery.png'),
                tooltip:'ArcGIS 地图服务',
                creationFunction:function () {
                    return esriMap;
                }
            });

            let providerViewModels = [];
            providerViewModels.push(esriMapModel);
            viewer.baseLayerPicker.viewModel.imageryProviderViewModels = providerViewModels;
        },

        // 添加腾讯底图
        addTxLayer(viewer) {
            console.log("添加腾讯底图")

            // 腾讯影像
            var base = new Cesium.UrlTemplateImageryProvider({
            url : 'https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229',
                customTags : {
                sx: function(imageryProvider, x, y, level) {
                    return x>>4;
                },
                    sy:function(imageryProvider, x, y, level) {
                    return ((1<<level)-y)>>4;
                }
            }
            });
            viewer.imageryLayers.addImageryProvider(base);

            var custom = new Cesium.UrlTemplateImageryProvider({
            url : 'https://rt3.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid=2&version=297'
            });

            viewer.imageryLayers.addImageryProvider(custom);
        },

        // 添加高德底图
        addGdLayer(viewer) {
            // console.log("添加高德底图")

            var base = new Cesium.UrlTemplateImageryProvider({
                url : 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
            });
            //viewer.imageryLayers.addImageryProvider(base);

            var viewer = new Cesium.Viewer('cesiumContainer',{
                imageryProvider:base
            });

            var road = new Cesium.UrlTemplateImageryProvider({
                url : 'https://wprd02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scl=2&style=8&ltype=11'
            });

            viewer.imageryLayers.addImageryProvider(road);
        },

        // 重写搜索
        resetSearch() {
            // 搜索
            // 当geocoder为true时，可以打印出viewer.geocoder.viewModel
            /* geoCoder._complete._listeners.push(function () {
                    搜索完全结束后你的操作
            });

            geoCoder._searchCommand.beforeExecute._listeners.push(function () {
                    开始搜索之前你的操作
            });

            geoCoder._searchCommand.afterExecute._listeners.push(function () {
                搜索执行之后你的操作
            }); */
        }
    },

    created() {
        
    },

    mounted() {
        this.resetCesiumView();
    }
}
</script>

<style lang="less" scoped>
.cesium-map-wrapper {
    width: 100%;
    height: 100%;
}
</style>