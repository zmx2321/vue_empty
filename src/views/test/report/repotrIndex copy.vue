<template>
  <section class="report_index main_wrap">
    <!-- 顶部条 -->
    <div class="bar_wrap white_bg">
      <dl class="main_cont">
        <dt>信息收集系统首页</dt>
        <dd>
          <ul>
            <li>{{ dateTime }}</li>
            <li>
              <span></span>
              <!-- <iframe allowtransparency="true" frameborder="0" width="169" height="53" scrolling="true" :src="weatherUrl0"></iframe> -->
              <iframe :src="weatherUrl" frameborder="0" id="iframe1"></iframe>
            </li>
          </ul>
        </dd>
      </dl>
    </div>

    <div class="report_index_wrap main_cont">
        <!-- 头 -->
      <div class="repix_cot top_wrap shad_radiu_box">
        <div class="top_cont main_cont">
          <ul>
            <li>
              <el-button type="primary" icon="el-icon-plus" size="small" @click="linkadd">新建报表</el-button>
            </li>
            <!-- <li>
              <el-button icon="el-icon-document" size="small">预设报表</el-button>
            </li> -->
          </ul>
        </div>
      </div>

      <!-- 中 -->
      <div class="repix_cot middle_wrap shad_radiu_box">
        <div class="middle_cont main_cont">
          <h3>报表概览</h3>

          <div class="box_cont box_list_wrap">
            <!-- 发起 -->
            <div class="bb_box_item">
              <div class="bb_item_top shad_radiu_box">
                <div class="img_wrap">
                  <img src="../../../assets/images/faqi.png" alt="">
                </div>
                <div class="text_wrap">
                  <dl>
                    <dt>
                      <ul>
                        <li class="font_bold">我发起的</li>
                        <!-- <li>未完成(12件)</li> -->
                        <li>未完成 ({{ this.rpinxObj.launchObj === undefined ? "" :  this.rpinxObj.launchObj.unFinished }}件)</li>
                      </ul>
                    </dt>
                    <!-- <dd class="font_bold">17件</dd> -->
                    <dd class="font_bold">共 {{ this.rpinxObj.launchObj === undefined ? "" :  this.rpinxObj.launchObj.total }} 件</dd>
                  </dl>
                </div>
              </div>
              <div class="bb_item_bot" @click="linkTable">
                <dl>
                  <dd>
                    <ul>
                      <li class="color1">进行中</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.launchObj === undefined ? "" : this.rpinxObj.launchObj.btn1 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color1">已完结</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.launchObj === undefined ? "" : this.rpinxObj.launchObj.btn2 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color3">已超时</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.launchObj === undefined ? "" : this.rpinxObj.launchObj.btn3 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color2">超时完结</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.launchObj === undefined ? "" : this.rpinxObj.launchObj.btn4 }}件</li>
                    </ul>
                  </dd>
                  <!-- <dd>
                    <ul>
                      <li class="color1">草稿</li>
                      <li>17件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color3">已撤回</li>
                      <li>17件</li>
                    </ul>
                  </dd> -->
                </dl>
              </div>
            </div>
            <!-- 填写 -->
            <div class="bb_box_item">
              <div class="bb_item_top shad_radiu_box">
                <div class="img_wrap">
                  <img src="../../../assets/images/tianxie.png" alt="">
                </div>
                <div class="text_wrap">
                  <dl>
                    <dt>
                      <ul>
                        <li class="font_bold">我填写的</li>
                        <!-- <li>未完成(12件)</li> -->
                        <li>未完成 ({{ this.rpinxObj.fillinObj === undefined ? "" : this.rpinxObj.fillinObj.unFinished }}件)</li>
                      </ul>
                    </dt>
                    <!-- <dd class="font_bold">17件</dd> -->
                    <dd class="font_bold">共 {{ this.rpinxObj.fillinObj === undefined ? "" : this.rpinxObj.fillinObj.total }} 件</dd>
                  </dl>
                </div>
              </div>
              <div class="bb_item_bot" @click="linkTable">
                <dl>
                  <dd>
                    <ul>
                      <li class="color1">已接收</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.fillinObj === undefined ? "" : this.rpinxObj.fillinObj.btn1 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color2">已填写未发送</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.fillinObj === undefined ? "" : this.rpinxObj.fillinObj.btn2 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color1">已填写已发送</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.fillinObj === undefined ? "" : this.rpinxObj.fillinObj.btn3 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color3">已退回</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.fillinObj === undefined ? "" : this.rpinxObj.fillinObj.btn4 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color1">已完结</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.fillinObj === undefined ? "" : this.rpinxObj.fillinObj.btn5 }}件</li>
                    </ul>
                  </dd>
                </dl>
              </div>
            </div>
            <!-- 审核 -->
            <div class="bb_box_item">
              <div class="bb_item_top shad_radiu_box">
                <div class="img_wrap">
                  <img src="../../../assets/images/shenhe.png" alt="">
                </div>
                <div class="text_wrap">
                  <dl>
                    <dt>
                      <ul>
                        <li class="font_bold">我审核的</li>
                        <!-- <li>未完成(12件)</li> -->
                        <li>未完成 ({{ this.rpinxObj.examineObj === undefined ? "" : this.rpinxObj.examineObj.unFinished }}件)</li>
                      </ul>
                    </dt>
                    <!-- <dd class="font_bold">17件</dd> -->
                    <dd class="font_bold">共 {{ this.rpinxObj.examineObj === undefined ? "" : this.rpinxObj.examineObj.total }} 件</dd>
                  </dl>
                </div>
              </div>
              <div class="bb_item_bot" @click="linkTable">
                <dl>
                  <dd>
                    <ul>
                      <li class="color2"><b></b>未审核</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.examineObj === undefined ? "" : this.rpinxObj.examineObj.btn1 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color1"><b></b>审核成功</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.examineObj === undefined ? "" : this.rpinxObj.examineObj.btn2 }}件</li>
                    </ul>
                  </dd>
                  <dd>
                    <ul>
                      <li class="color3"><b></b>审核失败</li>
                      <!-- <li>17件</li> -->
                      <li>{{ this.rpinxObj.examineObj === undefined ? "" : this.rpinxObj.examineObj.btn3 }}件</li>
                    </ul>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 尾 -->
      <div class="repix_cot bottom_wrap shad_radiu_box">
        <div class="bottom_cont main_cont">
          <h3>常用模板</h3>

          <div class="box_cont box_list_wrap">
            <div class="mb_box_item shad_radiu_box" v-for="(item, index) in modelBox" :key="index">
              <div class="mb_box_top">
                <ul>
                  <li>{{ item.name }}</li>
                  <li>+</li>
                </ul>
              </div>
              <div class="mb_box_cot" @click="linkModel">
                <ul>
                  <li>
                    <dl>
                      <dt>名称：</dt>
                      <dd>{{ item.name }}</dd>
                    </dl>
                  </li>
                  <li>
                    <dl>
                      <dt>名称：</dt>
                      <dd>{{ item.name }}</dd>
                    </dl>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import { getDateTimeNowFormate } from '@/utils/utils'

import { getReportIndexTop  } from "@/api/manager/report";

export default {
  name: "reportIndex",

  components: {
  },

  data () {
    return {
      // 数据
      rpinxObj: {},  // 首页数据
      // 模板
      modelBox: [],
      // 跳转所需
      queryObj: {},
      // 时间相关
      timmer: "",  // 定时器
      dateTime: getDateTimeNowFormate(),  // 默认时间
    }
  },

  computed: {
    // https://i.tianqi.com/index.php?c=code&id=10&py=hangzhou
    weatherUrl() {
      return 'https://i.tianqi.com/index.php?c=code&id=11'
      // return 'https://i.tianqi.com/index.php?c=code&id=10&py=hangzhou'
    },
    weatherUrl0() {
      return '//tianqi.2345.com/plugin/widget/index.htm?s=3&z=1&t=0&v=0&d=1&bd=0&k=000000&f=000000&ltf=008040&htf=ff8080&q=0&e=0&a=1&c=60175&w=169&h=53&align=center'
    }
  },

  methods: {
    /**
     * tools
     */
    // 页面初始化
    initPage() {
      this.setReportModel()  // 渲染模板
      this.getDateTime()  // 启动定时器

      this.$nextTick(() => {
        this.getRepIndxTpData()  // 获取首页头部数据
      })
    },
    clickIframe(e) {
      console.log(e)
    },

    // 跳转新建
    linkadd() {
      this.$router.push({
        path: '/report/optionReport',
        query: {
          handleStatus: '新增报表'
        }
      })
    },

    // 跳转表格 - 使用事件代理
    linkTable(e) {
      let { target } = e
      let { textContent } = target
      let { nodeName } = target

      // console.log(target)
      // console.log("dom名", target.nodeName)

      let levelTxt1 = ''
      let leve1Txt2 = ''

      /**
       * 提取值
       * 点击不同位置做区分
       */
      // 点击li - 区分左右
      if(nodeName === 'LI') {
        levelTxt1 = target.parentNode.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('ul')[0].getElementsByClassName('font_bold')[0].textContent

        // 如果没有类
        if(target.classList.length !== 0) {
          leve1Txt2 = textContent
        } else {
          leve1Txt2 = target.parentNode.getElementsByTagName('li')[0].textContent
        }
      } else {
        // 点击外层
        leve1Txt2 = target.getElementsByTagName('li')[0].textContent
      }

      // 点击ul
      if(nodeName === 'UL') {
        levelTxt1 = target.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('ul')[0].getElementsByClassName('font_bold')[0].textContent
      }

      // 点击dd
      if(nodeName === 'DD') {
        levelTxt1 = target.parentNode.parentNode.previousSibling.getElementsByTagName('ul')[0].getElementsByClassName('font_bold')[0].textContent
      }

      // 处理跳转数据
      this.resolveLinkData(levelTxt1, leve1Txt2)
    },

    // 处理跳转数据
    resolveLinkData(levelTxt1, leve1Txt2) {
      // console.log(levelTxt1, leve1Txt2)

      // level1
      switch(levelTxt1) {
        case '我发起的':
          this.queryObj.levelTxt1 = 'launch'
          break
        case '我填写的':
          this.queryObj.levelTxt1 = 'fillin'
          break
        case '我审核的':
          this.queryObj.levelTxt1 = 'examine'
          break
      }

      // level2
      switch(leve1Txt2) {
        case '进行中':
          this.queryObj.levelTxt2 = 'launch_btn1'
          break
        case '已完结':
          this.queryObj.levelTxt2 = 'launch_btn2'
          break
        case '已超时':
          this.queryObj.levelTxt2 = 'launch_btn3'
          break
        case '超时完结':
          this.queryObj.levelTxt2 = 'launch_btn4'
          break
        case '草稿':
          this.queryObj.levelTxt2 = 'launch_btn5'
          break
        case '已撤回':
          this.queryObj.levelTxt2 = 'launch_btn6'
          break
        case '已接收':
          this.queryObj.levelTxt2 = 'fillin_btn1'
          break
        case '已填写未发送':
          this.queryObj.levelTxt2 = 'fillin_btn2'
          break
        case '已填写已发送':
          this.queryObj.levelTxt2 = 'fillin_btn3'
          break
        case '已退回':
          this.queryObj.levelTxt2 = 'fillin_btn4'
          break
        case '已完结':
          this.queryObj.levelTxt2 = 'fillin_btn5'
          break
        case '未审核':
          this.queryObj.levelTxt2 = 'examine_btn1'
          break
        case '审核成功':
          this.queryObj.levelTxt2 = 'examine_btn2'
          break
        case '审核失败':
          this.queryObj.levelTxt2 = 'examine_btn3'
          break
      }

      // console.log(this.queryObj)

      // 跳转
      this.$router.push({
        path: '/report/index',
        query: {
          leve1Txt: JSON.stringify(this.queryObj),
        }
      })
    },

    // 跳转模板
    linkModel(e) {
      let { target } = e
      // console.log(target)

      this.$router.push({
        path: '/report/optionReport',
        query: {
          handleStatus: '修改报表',
          // id: row.id,
          // businessId: row.businessId
        }
      })
    },

    getDateTime() {
      this.timmer = setInterval(() => {
        this.dateTime = getDateTimeNowFormate()
      }, 1000);
    },

    // 清除定时器
    clearTime() {
      for(let i=0; i<1000; i++) {
        window.clearInterval(i);  // 清除定时器
      }
    },

    /**
     * api
     * tools
     */
    // 获取首页头部数据
    getRepIndxTpData() {
      getReportIndexTop().then(res=> {
        // console.log(res)

        let { data } = res

        this.rpinxObj = data
        console.log(this.rpinxObj)
      })
    },


    /**
     * 业务
     */
    // 渲染模板
    setReportModel() {
      for(let i=1; i<=8; i++) {
        this.modelBox.push({
          name: `模板 ${i}`
        })
      }
    },
  },

  created() {
    this.initPage()  // 页面初始化
  },

  mounted() {

  },

  beforeDestroy() {
    this.timmer = null
    this.clearTime();
  }
}
</script>

<style lang="scss" scoped>
$hoverTrans: 0.3s linear;
$outTrans: 0.2s linear;

$modelBoxHeight: 177px;
$modelBoxTopHeight: 31px;

.report_index {
  border-top: solid 1px transparent;
  overflow: hidden;

  .bar_wrap {
    width: 100%;
    height: 53px;
    overflow: hidden;
    margin-top: 0;

    dl {
      display: flex;
      justify-content: space-between;
      margin: 0 auto;

      dt, dd {
        line-height: 53px;
      }

      dt {
        font-size: 14px;
        font-weight: 300;
        color: #777;
      }

      dd {
        ul {
          li {
            display: inline-block;
            font-size: 16px;
            height: 53px;
            overflow: hidden;

            &:first-child {
              font-family: emoji;
              font-size: 12px;
              color: #000;
            }

            &:not(:last-child) {
              margin-right: 13px;
              // margin-right: -16px;
            }

            /* b {
              font-weight: 400;
              color: #2780EC;
              margin: 0 10px;
            } */

            &:last-child {
              position: relative;
              width: 280px;
              height: 53px;
              overflow: hidden;

              span {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 100;
              }

              iframe {
                position: absolute;
                height: 53px;
              }
            }
          }
        }
      }
    }
  }

  .report_index_wrap {
    .repix_cot {
      min-height: 20px;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      h3 {
        color: #6A6A6A;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 13px;
      }

      .box_cont {
        width: 96%;
        min-height: 100px;
        margin: 0 auto;
      }

      &.top_wrap {
        width: 100%;
        height: 53px;
        overflow: hidden;

        .top_cont {
          ul {
            li {
              display: inline-block;

              &:not(:last-child) {
                margin-right: 15px;
              }
            }
          }
        }
      }

      &.middle_wrap {
        .middle_cont {
          margin-bottom: 20px;

          .box_list_wrap {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;

            // 没有滚动条正常显示
            .bb_box_item:last-child {
              .bb_item_bot {
                dl {
                  width: 100%;
                }
              }
            }

            .bb_box_item:not(:last-child) {
              .bb_item_bot {
                dd {
                  padding-right: 36px;
                }
              }
            }

            .bb_box_item {
              flex: 1;
              transition: 0.3s linear;

              // 鼠标移入
              &:hover .bb_item_top {
                background: #f4f9ff;
                transition: $hoverTrans;
              }

              &:not(:last-child) {
                margin-right: 5%;
              }

              .bb_item_top {
                display: flex;
                height: 88px;
                margin-bottom: 10px;
                overflow: hidden;
                transition: $outTrans;

                .img_wrap {
                  width: 88px;
                  height: 88px;
                  overflow: hidden;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                }

                .text_wrap {
                  flex: 1;
                  overflow: hidden;

                  dl {
                    display: flex;
                    justify-content: space-between;
                    width: 88.8%;
                    overflow: hidden;

                    .font_bold {
                      font-size: 24px;
                      color: #2680EB;
                      font-weight: bold;
                    }

                    dt {
                      margin: 20px 0 0 20px;

                      ul {
                        li {
                          &:first-child {
                            margin-bottom: 13px;
                          }

                          &:last-child {
                            font-size: 18px;
                            color: #494949;
                          }
                        }
                      }
                    }

                    dd {
                      line-height: 88px;
                    }
                  }
                }
              }

              .bb_item_bot {
                width: 100%;
                height: 140px;
                overflow: auto;

                dl {
                  width: 98%;
                  // margin: 0 auto;

                  dd {
                    background: #F8F8F8;
                    padding: 12px 56px;
                    border-radius: 5px;
                    transition: $outTrans;
                    cursor: pointer;
                    border: solid 1px transparent;

                    &:hover {
                      transition: $hoverTrans;
                      background: #fff;
                      border-bottom: solid 1px #2680eb;
                    }

                    &:not(:last-child) {
                      margin-bottom: 10px;
                    }

                    ul {
                      display: flex;
                      justify-content: space-between;

                      li {
                        position: relative;
                        height: 14px;
                        line-height: 14px;
                        font-size: 18px;
                        color: #494949;

                        &:first-child {
                          &::before {
                            content: "";
                            position: absolute;
                            width: 8px;
                            height: 8px;
                            left: -24px;
                            top: 2px;
                            border-radius: 10px;
                          }

                          b {
                            position: relative;
                            display: inline-block;
                            width: 22px;
                            height: 22px;
                            // background: #f00;

                            /* font-weight:600;
                            font-size:25px;
                            margin-bottom:0px; */
                            /* cursor:pointer;
                            background-image:-webkit-linear-gradient(bottom,red,#ff5f60,#f0c41b);
                            -webkit-background-clip:text;
                            -webkit-text-fill-color:transparent; */
                            // animation: fadeRightBig 1s infinite;

                            &::before {
                              position: absolute;
                              top: 0;
                              right: 0;
                              content: '>>';
                              width: 18px;
                              height: 22px;
                              background: #f00;
                              font-weight:600;
                            font-size:16px;
                            margin-bottom:0px;
                            cursor:pointer;
                            background-image:-webkit-linear-gradient(bottom,red,#ff5f60,#f0c41b);
                            -webkit-background-clip:text;
                            -webkit-text-fill-color:transparent;

                              animation: fadeRightBig 1s infinite;
                            }
                          }
                          @keyframes fadeRightBig{
                            0%{
                              left: 0;
                              // opacity:0;
                              // transform:translateX(800px)
                            }
                            100%{
                              left: 100%;
                              // opacity:1;
                              // transform:translateY(0)
                            }
                          }

                          &.color1 {
                             &::before {
                              background: #27EC53;
                            }
                          }

                          &.color2 {
                             &::before {
                              background: #2680EB;
                            }
                          }

                          &.color3 {
                             &::before {
                              background: #FF5959;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      &.bottom_wrap {
        .bottom_cont {
          margin-bottom: 0;
          padding-bottom: 1px;

          .box_list_wrap {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .mb_box_item {
              width: 373px;
              height: $modelBoxHeight;
              margin-bottom: 18px;
              transition: $outTrans;
              overflow: hidden;

              &:hover {
                background: #f9f9f9;
                transition: $hoverTrans;
              }

              .mb_box_top {
                width: 100%;
                height: $modelBoxTopHeight;
                line-height: $modelBoxTopHeight;
                background: #2780EC;
                overflow: hidden;

                ul {
                  display: flex;
                  justify-content: space-between;
                  width: 92%;
                  height: 100%;
                  margin: 0 auto;

                  li {
                    color: #fff;
                  }
                }
              }

              .mb_box_cot {
                width: 88%;
                height: calc(#{$modelBoxHeight} - #{$modelBoxTopHeight});
                margin: 12px auto 0;
                overflow: hidden;
                cursor: pointer;

                ul {
                  li {
                    &:not(:last-child) {
                      margin-bottom: 10px;
                    }

                    dl {
                      dt, dd {
                        display: inline-block;
                        font-size: 14px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
