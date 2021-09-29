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
        
    },

    created() {
        
    },
    mounted() {
        console.log(window.cesiumViewer)
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