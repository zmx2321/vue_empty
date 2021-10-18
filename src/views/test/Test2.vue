<template>
    <section class="main_cont">
        <img src="@/assets/images/test/demo_features.png" width="300" height="301" class="map1" usemap="#features">
        <map name="features" @click="pictest">
            <area id="arrow" shape="poly" style="display:none;" coords="211,3,121,67,112,53,95,103,146,108,136,92,229,25" href="#" alt="arrow">
            <area id="star" shape="poly" coords="78,83,70,100,52,104,64,115,61,133,78,124,94,133,91,116,104,102,87,101,79,88" href="#" alt="star" class="group" data-maphilight='{"strokeColor":"ff00ff","strokeWidth":5,"fillColor":"ff0000","fillOpacity":0.6}'>
            <area id="square1" shape="poly" coords="248,126,222,150,202,122,233,105,239,118,249,125,250,128" href="#" alt="a square" data-maphilight='{"alwaysOn":true,"stroke":false}'>
            <area id="square2" shape="poly" coords="151,249,175,225,182,222,167,193,136,221,153,250" href="#" alt="another square" class="group" data-maphilight='{"groupBy":".group"}'>
            <area id="shadowed" shape="rect" coords="250,250,290,290" href="#" alt="Shadow for some" data-maphilight='{"fillColor":"00ff00","shadow":true,"shadowBackground":"ffffff","alwaysOn":true}'>
        </map>
    </section>
</template>

<script>
export default {
    name: "testmap",

    data () {
        return {
        }
    },

    methods: {
        pictest(e) {
            console.log(e.target.id)
        },

        getMap() {
            $('.map1').maphilight();
        }
    },

    mounted() {
        this.getMap()
    },

    created() {
        
    }
}
</script>

<style lang="less" scoped>
.main_cont {
    padding: 0;
}
</style>