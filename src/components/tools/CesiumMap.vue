<template>
    <section class="cesium-map-wrapper" id="cesiumContainer"></section>
</template>

<script>
export default {
    name: "cesium-map-wrapper",

    data () {
        return {
            // cesiumViewer: {},
        }
    },

    methods: {

    },

    created() {
        
    },

    mounted() {
        window.cesiumViewer = new Cesium.Viewer("cesiumContainer")
    }
}
</script>

<style lang="less" scoped>
.cesium-map-wrapper {
    width: 100%;
    height: calc(100vh - @headNavHeight);
}
</style>