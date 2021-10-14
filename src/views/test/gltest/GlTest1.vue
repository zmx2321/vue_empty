<template>
    <section class="main_cont">
        <img src="@/assets/images/test/t2.jpg" alt="">
        <span class="bbk a1"></span>
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
        init() {
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
             */
            console.log("init")
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