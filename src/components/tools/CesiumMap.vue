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
                fullscreenButton: false, // 全屏按钮
                geocoder: true,  // 查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
                homeButton: false,  // 视角返回初始位置
                sceneModePicker: false,  // 选择视角的模式，有三种：3D，2D，哥伦布视图（CV）
                baseLayerPicker: true,  //  图层选择器，选择要显示的地图服务和地形服务
                navigationHelpButton: false,  // 导航帮助按钮，显示默认的地图控制帮助
                // scene3DOnly : true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            }
        }
    },

    methods: {
        resetCesiumView() {
            // 初始化地球
            window.cesiumViewer = new Cesium.Viewer("cesiumContainer", this.resetViewer)

            // 版权清理
            window.cesiumViewer.bottomContainer.style.display = "none";

            // 显示帧速
            window.cesiumViewer.scene.debugShowFramesPerSecond = true;
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
    height: calc(100vh - @headNavHeight);
}
</style>