<template>
    <section class="main_cont">
        <div class="area_box">
            <div class="img_wrap" @mouseover="testover" @click="testclick">
                <img src="@/assets/images/test/t2.jpg" class="map1">

                <div class="block bok1 empty" title="商铺1">
                    <div class="wrap">
                        <span>商铺1</span>
                    </div>
                </div>
                <div class="block bok2 empty" title="商铺2">
                    <div class="wrap">
                        <span>商铺2</span>
                    </div>
                </div>
                <div class="block bok3 full" title="商铺3">
                    <div class="wrap">
                        <span>商铺3</span>
                    </div>
                </div>
            </div>
        </div>

         <div ref="boxfef" class="info_box" v-if='showBox' :style="{left: tranLeft, top: tranTop}">
            <div class="drge" @mousedown="mouseDownHandleelse($event)" @mouseup="mouseUpHandleelse($event)"></div>
            <div class="txt_box">
                <span>{{ info }}</span>
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
        testover(e) {
            /* if(e.target.nodeName === "IMG") {
                console.log("img")
                // this.showBox = false
            } */

            if(e.target.className === "wrap" || e.target.nodeName === "SPAN") {
                // textContent
                console.log("div", e.target.textContent)

                this.tranLeft = (e.pageX - 250) + 'px'
                this.tranTop = (e.pageY - 150) + 'px'

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
    background: #000;

    .area_box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        animation: fadeRightBig .8s 1s ease both;

        @keyframes fadeRightBig{
            0%{
                opacity:0;
                transform:translateX(2000px)
            }
            100%{
                opacity:1;
                transform:translateY(0)
            }
        }

        .img_wrap {
            width: 60%;
            // height: 80%;
            background: #fff;
            margin: 0 auto;
            position: relative;
            top: 50%;
            transform: translateY(-50%);
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0px 0px 10px #fff;

            img {
                width: 100%;
                height: 100%;
            }

            .block {
                position: absolute;
                top: 0;
                left: 0;
                width: 2vw;
                height: 2vw;
                cursor: pointer;
                overflow: hidden;
                background: chocolate;

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
                    width: 9vw;
                    height: 5vw;
                    top: 47.6%;
                    left: 24%;
                }

                &.bok2 {
                    width: 1.5vw;
                    height: 1.5vw;
                    top: 41%;
                    left: 10.5%;
                    border-radius: 2vw;
                }

                &.bok3 {
                    width: 6vw;
                    height: 3.8vw;
                    top: 46.9%;
                    left: 7.1%;
                }
            }

            .block:hover {
                background: #00f;
            }
        }
    }

    .info_box {
        position: absolute;
        min-width: 8.6vw;
        max-width: 18vw;
        min-height: 5.6vw;
        max-height: 10vw;
        background: #fff;
        box-shadow: 0 0 2px #8c939d;
        overflow: hidden;
        border-radius: 10px;

        .drge {
            width: 100%;
            height: 15px;
            overflow: hidden;
            border-bottom: solid 1px #8c8c8c;
        }

        .txt_box {
            padding: 10px;
            overflow: auto;
            max-height: 100px;

            span {
                font-size: 12px;
            }
        }

        ::-webkit-scrollbar{
            width: 10px;
            height: 10px;
            background-color: #f5f7fa;
        }

        /*滚动条的轨道*/
        ::-webkit-scrollbar-track{
            /*box-shadow: inset 0 0 5px rgba(0,0,0,.3);*/
            /* background-color: #f5f7fa; */
            background-color: #bdbdbd;
        }

        /*滚动条的滑块按钮*/
        ::-webkit-scrollbar-thumb{
            border-radius: 10px;
            // background-color: #4a494a;
            background-color: #908c90;
            /*box-shadow: inset 0 0 5px #000;*/
        }

        /*滚动条的上下两端的按钮*/
        ::-webkit-scrollbar-button{
            height: 0px;
            background-color: #B0AEDA;
        }
    }
}
</style>