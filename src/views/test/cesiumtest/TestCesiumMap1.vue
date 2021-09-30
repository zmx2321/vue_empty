<template>
    <section class="main_cont">
        <CesiumMap />
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
        setCesiumMap() {
            // console.log(window.cesiumViewer)

            // 显示帧速
            // window.cesiumViewer.scene.debugShowFramesPerSecond = true;

            // 显示版权
            // window.cesiumViewer.bottomContainer.style.display = "block";
        }
    },

    created() {
        
    },

    mounted() {
        this.setCesiumMap()
    }
}
</script>

<style lang="less" scoped>
.main_cont {
    padding: 0
}
</style>