<template>
  <!-- 图例 -->
  <section class="glmap_lend" @click="getLend">
    <!-- 首页大屏图例 -->
    <ul v-if="currentCompany === 'main'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map1/fm.png" alt="">
          </dt>
          <dd>繁忙</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map1/gb.png" alt="">
          </dt>
          <dd>关闭</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map1/zc.png" alt="">
          </dt>
          <dd>正常</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map1/gz.png" alt="">
          </dt>
          <dd>改造</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map1/kx.png" alt="">
          </dt>
          <dd>空闲</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map1/gk.png" alt="">
          </dt>
          <dd>管控</dd>
        </dl>
      </li>
    </ul>
    <!-- 中碳科技 -->
    <ul v-if="currentCompany === '6'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map2/gfdz.png" alt="">
          </dt>
          <dd>光伏电站</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map2/lngcz.png" alt="">
          </dt>
          <dd>LNG场站</dd>
        </dl>
      </li>
    </ul>
    <!-- 浙江建融 -->
    <ul class="single_lend" v-if="currentCompany === '8'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map3/jrxm.png" alt="">
          </dt>
          <dd>建融项目</dd>
        </dl>
      </li>
    </ul>
    <!-- 高速石油 -->
    <ul class="single_lend" v-if="currentCompany === '4'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map4/jyz.png" alt="">
          </dt>
          <dd>加油站</dd>
        </dl>
      </li>
    </ul>
    <!-- 高速能源 -->
    <ul class="single_lend" v-if="currentCompany === '5'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map5/nyjz.png" alt="">
          </dt>
          <dd>能源基站</dd>
        </dl>
      </li>
    </ul>
    <!-- 创胜至合 -->
    <ul class="single_lend" v-if="currentCompany === '7'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map6/kfc.png" alt="">
          </dt>
          <dd>肯德基</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map6/costa.png" alt="">
          </dt>
          <dd>COSTA</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map6/ymc.png" alt="">
          </dt>
          <dd>驿抹茶</dd>
        </dl>
      </li>
    </ul>
    <!-- 高速商贸 -->
    <ul class="single_lend" v-if="currentCompany === '10'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map7/zyd.png" alt="">
          </dt>
          <dd>直营店</dd>
        </dl>
      </li>
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map7/jmd.png" alt="">
          </dt>
          <dd>加盟店</dd>
        </dl>
      </li>
    </ul>
    <!-- 盈通餐饮 -->
    <ul class="single_lend" v-if="currentCompany === '3'">
      <li>
        <dl>
          <dt>
            <img src="./mapIco/map8/ct.png" alt="">
          </dt>
          <dd>餐厅</dd>
        </dl>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  data() {
    return {
      currentCompany: 'main',  // 当前公司
    }
  },

  methods: {
    /**
     * tools
     */
    // 返回
    goBack() {
      // console.log('返回')

      this.currentCompany = 'main'
    },
    // toggle
    toggleLend(calss) {
      let dnCls = 'f-dn'

      this.$el.parentNode.querySelectorAll(calss).forEach(item=> {
        if(!item.classList.contains(dnCls)) {
          item.classList.add(dnCls)
        } else {
          item.classList.remove(dnCls)
        }
      })
    },
    // 配置lend封装
    setLendConfig(nodeTxt, txt, nodeDom) {
      if(nodeTxt === txt) {
        this.toggleLend(nodeDom)
      }
    },
    // lend事件
    getLend(e) {
      let { target } = e
      let { nodeName, textContent } = target
      let nodeTxt = ''
      // console.log(target)

      if(nodeName === 'IMG') {
        nodeTxt = target.parentNode.parentNode.textContent
      }
      if(nodeName === 'DL' || nodeName === 'DD') {
        nodeTxt = textContent
      }

      // 移除气泡
      this.$emit('removePopup')

      // console.log(nodeTxt)
      this.lendConfig(nodeTxt)  // lend配置
    },
    // lend配置 - 显示隐藏
    lendConfig(nodeTxt) {
      /**
       * 首页大屏图例
       */
      this.setLendConfig(nodeTxt, '繁忙', '.map1_mksty1')
      this.setLendConfig(nodeTxt, '关闭', '.map1_mksty2')
      this.setLendConfig(nodeTxt, '正常', '.map1_mksty3')
      this.setLendConfig(nodeTxt, '改造', '.map1_mksty4')
      this.setLendConfig(nodeTxt, '空闲', '.map1_mksty5')
      this.setLendConfig(nodeTxt, '管控', '.map1_mksty6')
      /**
       * 中碳科技图例
       */
      this.setLendConfig(nodeTxt, '光伏电站', '.map2_mksty1')
      this.setLendConfig(nodeTxt, 'LNG场站', '.map2_mksty2')
      /**
       * 浙江建融图例
       */
      this.setLendConfig(nodeTxt, '建融项目', '.map3_mksty1')
      /**
       * 高速石油图例
       */
      this.setLendConfig(nodeTxt, '加油站', '.map4_mksty1')
      /**
       * 高速能源图例
       */
      this.setLendConfig(nodeTxt, '能源基站', '.map5_mksty1')
      /**
       * 创胜至合图例
       */
      this.setLendConfig(nodeTxt, '肯德基', '.map6_mksty1')
      this.setLendConfig(nodeTxt, 'COSTA', '.map6_mksty2')
      this.setLendConfig(nodeTxt, '驿茉茶', '.map6_mksty3')
      /**
       * 高速商贸图例
       */
      this.setLendConfig(nodeTxt, '直营店', '.map7_mksty1')
      this.setLendConfig(nodeTxt, '加盟店', '.map7_mksty2')
      /**
       * 盈通餐饮图例
       */
      this.setLendConfig(nodeTxt, '餐厅', '.map8_mksty1')
    },

    /**
     * 业务
     */
    // 获取公司信息
    getCompanyData(companyData) {
      // console.log(companyData)

      // this.currentCompany = companyData.company_id
      this.currentCompany = companyData.newcompany_id
      // console.log(companyData)

      // this.companyData = companyData
      // this.$refs.mapLendRef.getCompanyData(companyData)
    }
  }
}
</script>

<style lang="less">
// 图例
.glmap_lend {
  position: absolute;
  bottom: 0;
  right: 28px;

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 188px;

    &.single_lend {
      width: 100px;
    }

    li {
      width: 88px;
      height: 26px;
      // overflow: hidden;
      margin-bottom: 13px;
      cursor: pointer;
      text-align: right;

      &:nth-child(even) {
        margin-right: 0;
      }

      dl {
        width: 100%;
        padding-right: 10px;

        &::after {
          content: '';
          display: block;
          clear: both;
          height: 0;
          overflow: hidden;
          visibility: hidden;
        }

        dt, dd {
          float: left;
        }

        dt {
          width: 21px;
          height: 24px;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }

        dd {
          position: relative;
          top: 6px;
          left: 6px;
          font-size: 14px;
          color: #ADB1BC;
        }
      }
    }
  }
}
</style>