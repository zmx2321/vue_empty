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
            console.log(window.cesiumViewer)
            window.cesiumViewer.bottomContainer.style.display = "block";
            window.cesiumViewer.scene.geocoder = true;
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
    width: 100%;
    height: 100%;
    padding: 0
}
</style>