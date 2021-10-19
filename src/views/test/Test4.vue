<template>
    <section class="main_cont" @mouseover="test">
        <div class="areaBox">
            <div class="img_wrap">
                <img src="@/assets/images/test/t4.png" class="map1">
                <div class="block"></div>
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
.main_cont {
    position: relative;
    padding: 0;
    background: #000;

    .areaBox {
        width: 100%;
        height: 100%;
        overflow: hidden;
        animation: fadeRightBig .8s 1s ease both;

        .img_wrap {
            width: 70%;
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
            }

            .block {
                width: 2vw;
                height: 2vw;
                background: rgb(223, 40, 40);
                border-radius: 100%;
                position: absolute;
                top: 13%;
                left: 39%;
                z-index: 9;
                cursor: pointer;
                -webkit-animation: myAnimation 1s infinite;
                animation: myAnimation 1s infinite;
                background: url(data:image/png;base64,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) 100% no-repeat;
                background-size: contain;
            }
        }
    }

    @keyframes myAnimation {
        0% {
            opacity: 0.5
        }
        100% {
            opacity: 1
        }
    }

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
}
</style>