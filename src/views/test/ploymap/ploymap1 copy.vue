<template>
   <merchant-map />
</template>

<script>
import MerchantMap from './components/MerchantMap.vue'

export default {
    /**
     * 地图进入，显示若干个面
     * 鼠标移入面显示当前区域详情
     * 点击面 
     *  1、清除地图所有图层
     *  2、设置地图缩放比例
     *  3、打点
     *  4、点位绑定点击和移入移出事件
     * 地图缩放清除所有图层并显示面
     * 地图放大显示之前的坐标点
     * 鼠标移入面并放大显示当前面中的坐标点
     */
    name: "ploymap1",
    components: { MerchantMap },
}
</script>