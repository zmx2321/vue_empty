<template>
    <section class="main_cont">
        <CesiumMap
            @resetViewer="setCesiumMap"
        />
    </section>
</template>

<script>
import CesiumMap from '@/components/tools/CesiumMap'

export default {
    name: "TestCesiumMap1",

    components: {
        CesiumMap,
    },

    data () {
        return {
            
        }
    },

    methods: {
        // 设置地球
        setCesiumMap(viewer) {
            // console.log(viewer)

            // 显示帧速
            viewer.scene.debugShowFramesPerSecond = true;

            // 显示版权
            // window.cesiumViewer.bottomContainer.style.display = "block";
        }
    },

    created() {
        
    },

    mounted() {
    }
}
</script>

<style lang="less" scoped>
.main_cont {
    padding: 0
}
</style>