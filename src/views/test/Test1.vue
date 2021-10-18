<template>
    <section class="main_cont">
        <img src="@/assets/images/test/t3.jpg" usemap="#image-map" class="map1">

        <!-- <map name="image-map" @click="test" id="map0" @mouseover="testover"> -->
        <map name="image-map" id="map0" @click="test">
            <!-- <area target="" alt="123" title="123" coords="1002,586,453,274" shape="rect" style="background:#f00" > -->
            <area target="" alt="123" title="123" coords="1002,586,453,274" shape="rect">
            <area target="" alt="wwww" title="wwww" coords="1361,517,1014,290" shape="rect">
        </map>

        <!-- <div class="wrap" :style="{display: isShow,left: floatLeft,top: floatTop}">
            123
        </div> -->
        <div v-if='showBox'>
		<div class='show-parent' :style="{left: tranLeft, top: tranTop}">
			<div class="shard">
	          <div class="show-inner">
	            <div>{{ info }}</div>
	          </div>
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

                info: ""
        }
    },

    methods: {
        test(e) {
            console.log("test", e.target.title)

            // 根据事件处理参数e下的pageX，PageY来定位div的位置
				// 需要计算下div定位的差值 我这边是横轴是500左右纵轴是163左右
				this.tranLeft = (e.pageX - 100) + 'px'
				this.tranTop = (e.pageY - 80) + 'px'
				// 点击的时候显示模态框
				this.showBox = true	

            e.target.style.cssText = "background: #f00"
            console.log(e.target)

            this.info = e.target.title

            this.areaLight(e.target)
        },
        testover(e) {
            console.log("test", e.target.title)

            e.target.style.cssText = "background: #f00"
            console.log(e.target)

            /* // 根据事件处理参数e下的pageX，PageY来定位div的位置
				// 需要计算下div定位的差值 我这边是横轴是500左右纵轴是163左右
				this.tranLeft = (e.pageX - 500) + 'px'
				this.tranTop = (e.pageY - 163) + 'px'
				// 点击的时候显示模态框
				this.showBox = true	 */
        },
        areaLight(obj)
            {
                console.log("123", obj)
                var data = $(obj).data('maphilight') || {};
                data.alwaysOn = !data.alwaysOn;
                $(obj).data('maphilight', data).trigger('alwaysOn.maphilight');
                console.log(data)
            }
    },

    mounted() {
        let map0 = document.querySelector('#map0')
        console.log(map0)

        
    },

    created() {
        console.log($("body"))
        $('.map1').maphilight({
            fillColor: '008800'
        });
    }
}
</script>

<style lang="less" scoped>
.main_cont {
    padding: 0;

    area:hover {
        cursor: pointer;
        box-shadow: 10px 11px 15px #888888;
    }

    area {
        position: relative;
    }

    area::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        background: #f00;

    }
    img {
        /* width: 100%;
        height: 100%; */

        #map0 {
        }
    }

    .show-parent {
    position: absolute;
    /*top: 587px;
    left: 933px;*/
    width: 300px;
    background-color: #ffffff;
    box-shadow: 0 0 2px #8c939d;
    z-index: 1;
  }

    .wrap{ position:absolute;font-size:9pt;  background-color:#FFFFCC; padding:5px; border:1px solid #F5C66B;line-height:160%; width:300px; display:none;}
}
</style>