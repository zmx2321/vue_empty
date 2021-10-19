<template>
    <section class="main_cont" @mouseover="test" @click="testclick">
        <img src="@/assets/images/test/t3.jpg" class="map1">

        <div class="block bok1 empty" title="商铺1">
            <div class="wrap">
                <span>商铺1</span>
            </div>
        </div>
        <div class="block bok2 full" title="商铺2">
            <div class="wrap">
                <span>商铺2</span>
            </div>
        </div>
        <div class="block bok3 empty" title="商铺3">
            <div class="wrap">
                <span>商铺3</span>
            </div>
        </div>
        <!-- <div class="block bok4 empty">
            <div class="wrap">
                <span>商铺4</span>
            </div>
        </div> -->

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

            info: "",

            moveDataelse: {
                x: null,
                y: null
            },

            tranLeft: 0, // 向左偏移
            tranTop: 0,  // 向右偏移
        }
    },

    methods: {
        test(e) {
            /* if(e.target.nodeName === "IMG") {
                console.log("img")
                // this.showBox = false
            } */

            if(e.target.className === "wrap" || e.target.nodeName === "SPAN") {
                // textContent
                console.log("div", e.target.textContent)

                this.tranLeft = (e.pageX - 200) + 'px'
                this.tranTop = (e.pageY - 200) + 'px'

                this.showBox = true	
                this.info = e.target.textContent
            }
        },

        testclick(e) {
            if(e.target.nodeName === "IMG") {
                // console.log("img")
                this.showBox = false
            }
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
    },

    created() {
        
    }
}
</script>

<style lang="less" scoped>
@emptyStore: #0f0;
@fullStore: #f00;

.main_cont {
    position: relative;
    padding: 0;

    .block {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        cursor: pointer;
        overflow: hidden;

        .wrap {
            position: relative;
            width: 100%;
            height: 100%;

            span {
                position: absolute;
                bottom: 11px;
                left: 11px;
                font-size: 13px;
                letter-spacing: 3px;
            }
        }

        &.empty {
            background: @emptyStore;
        }

        &.full {
            background: @fullStore;
        }

        &.bok1 {
            width: 279px;
            height: 226px;
            top: 266px;
            left: 0;
        }

        &.bok2 {
            width: 60px;
            height: 60px;
            top: 74px;
            left: 95px;
            border-radius: 500px;
        }

        &.bok3 {
            width: 551px;
            height: 308px;
            top: 277px;
            left: 450px;
        }
    }

    .block:hover {
        background: #00f;
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