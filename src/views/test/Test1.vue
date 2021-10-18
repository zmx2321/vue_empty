<template>
    <section class="main_cont">
        <img src="@/assets/images/test/t3.jpg" usemap="#image-map" class="map1">

        <map name="image-map" id="map0" @click="test">
            <area target="" alt="123" title="123" coords="1002,586,453,274" shape="rect" data-maphilight='{"alwaysOn":true,"strokeColor":"ff00ff","strokeWidth":5,"fillColor":"ff0000","fillOpacity":0.6}'>
            <area target="" alt="wwww" title="wwww" coords="1361,517,1014,290" shape="rect" data-maphilight='{"fillColor":"ff0000","shadow":true,"shadowBackground":"ffffff"}'>
             <area target="" alt="test1" title="test1" coords="61,157,30" shape="circle" data-maphilight='{"fillColor":"ff0000","shadow":true,"shadowBackground":"ffffff"}'>
            <area target="" alt="test2" title="test2" coords="1,266,278,489" shape="rect" data-maphilight='{"fillColor":"000000","shadow":true,"shadowBackground":"ffffff"}'>
            <!-- <area target="" alt="ttr" title="ttr" coords="92,220,205,228,230,124,180,124" shape="poly" 
            data-maphilight='{"alwaysOn":true,"fillColor":"0000ff", "shadow":true,"shadowBackground":"00ff00","strokeColor":"ff00ff","strokeWidth":5,}'> -->
            <area target="" title="test222" coords="92,220,205,228,230,124,180,124" shape="poly" 
            :data-maphilight='maphilightConfig'>
        </map>

        <div v-if='showBox'>
            <div  ref="boxfef" class='show-parent' :style="{left: tranLeft, top: tranTop}" @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)">
                <div class="show-inner">
                    <div>{{ info }}</div>
                </div>
            </div>
	    </div>
    </section>
</template>

<script>
export default {
    name: "testmap",

    data () {
        return {
            showBox: false,
            tranLeft: 0, // 向左偏移
            tranTop: 0,  // 向右偏移

            info: "",

            maphilightConfig: '{"alwaysOn":false,"strokeColor":"000000","strokeWidth":1,"fillColor":"00ff00","fillOpacity":0.6}',

            moveDataelse: {
                x: null,
                y: null
            }
        }
    },

    methods: {
        test(e) {
            console.log("test", e.target.title)

            // 根据事件处理参数e下的pageX，PageY来定位div的位置
            // 需要计算下div定位的差值 我这边是横轴是500左右纵轴是163左右
            this.tranLeft = (e.pageX - 200) + 'px'
            this.tranTop = (e.pageY - 200) + 'px'
            // 点击的时候显示模态框
            this.showBox = true	

            e.target.style.cssText = "background: #f00"
            console.log(e.target)

            this.info = e.target.title

            // this.areaLight(e.target)  // 点击时设置属性
        },
        areaLight(obj) {
            console.log("123", obj)
            var data = $(obj).data('maphilight') || {};
            data.alwaysOn = !data.alwaysOn;
            $(obj).data('maphilight', data).trigger('alwaysOn.maphilight');
            console.log("123", data)
        },
        getMap() {
            this.vw = 600;
    　　this.vh = 380;
            $('.map1').maphilight();
        },
        //缩小
        resize(newRect) {
            this.vw = newRect.width;
            this.vh = newRect.height;
            this.top = newRect.top;
            this.left = newRect.left;
        },
        mouseDownHandleelse (event) {
            this.moveDataelse.x = event.pageX - this.$refs.boxfef.offsetLeft
            this.moveDataelse.y = event.pageY - this.$refs.boxfef.offsetTop
            event.currentTarget.style.cursor = 'move'
            window.onmousemove = this.mouseMoveHandleelse
        },
        mouseMoveHandleelse (event) {
            let moveLeft = event.pageX - this.moveDataelse.x + 'px'
            let moveTop = event.pageY - this.moveDataelse.y + 'px'
            this.$refs.boxfef.style.left = moveLeft
            this.$refs.boxfef.style.top = moveTop
        },
        mouseUpHandleelse (event) {
            window.onmousemove = null
            event.currentTarget.style.cursor = 'move'
            console.log('鼠标松开了')
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
    position: relative;
    padding: 0;

    area:hover {
        cursor: pointer;
    }

    .show-parent {
        position: absolute;
        /*top: 587px;
        left: 933px;*/
        width: 300px;
        min-height: 100px;
        background-color: #ffffff;
        box-shadow: 0 0 2px #8c939d;
        z-index: 1;
    }
}
</style>