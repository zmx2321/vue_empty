<template>
  <section id="g6Tree" class="g6_tree_wrap"></section>
</template>

<script>
import G6 from '@antv/g6'
import { getProcessNodeTree } from "@/api/manager/report";

export default {
  name: "reportRrcord",

  props: {
    params: {
      type: Object,
      default: ()=> {}
    },
    treeWidth: {
      type: Number,
      default: window.innerWidth
    },
    treeHeight: {
      type: Number,
      default: window.innerHeight
    },
  },

  components: {
  },

  data() {
    return {
      graph: {},
    }
  },

  computed: {
    // 树配置
    treeConfig() {
      return {
        /* width: window.innerWidth,
        height: window.innerHeight, */
        // width: this.treeWidth,
        width: this.treeWidth,
        height: this.treeHeight,
        modes: {
          default: [/* {
            type: 'tooltip',
            formatText(model) {
              // console.log("鼠标移入", model)

              var text = '备注: ' + model.remark;
              return text;
            },
          },  */"drag-canvas", "zoom-canvas", "drag-node", "click-select", "brush-select"],
        },
        fitView: true,
        animate: true,
        defaultNode: {
          type: 'flow-rect',
        },
        defaultEdge: {
          type: 'cubic-horizontal',
          style: {
            stroke: '#CED4D9',
          },
        },
        layout: {
          type: 'indented',
          direction: 'LR', // H / V / LR / RL / TB / BT
          dropCap: false,
          indent: 300,
          getHeight: () => {
            return 100;
          },
        }
      }
    }
  },

  methods: {
    /**
     * coommon
     * tools
     */
    // 初始化
    initPage() {
      // 第一次点击，树对象为空，不销毁
      if(this.graph.cfg) {
        // console.log("销毁")
        this.graph.destroy();  // 销毁
      }
      this.registerFn()
      this.renderBrainMap()  // 渲染脑图
    },

    // 显示隐藏
    handleCollapse(e) {
      // 获取node
      let { target } = e
      let id = target.get('modelId');
      let item = this.graph.findById(id);
      let nodeModel = item.getModel();

      // 更新并渲染
      nodeModel.collapsed = !nodeModel.collapsed;
      this.graph.layout();
      this.graph.setItemState(item, 'collapse', nodeModel.collapsed);
    },

    // tree相关点击事件
    clickNodeEvent() {
      const getNodeModel = e=> {
        let node = e.item;
        let model = node._cfg.model

        return model
      }

      // 点击图标
      this.graph.on('collapse-text:click', e => {
        this.handleCollapse(e);
      });
      // 点击文字
      this.graph.on('collapse-back:click', e => {
        this.handleCollapse(e);
      });
      // 点击节点
      this.graph.on('node:click', e => {
        let { text } = e.target.attrs
        // console.log(text)

        if(text !== '+'  && text !== '-') {
          let nodeModel = getNodeModel(e)
          console.log("点击节点", nodeModel)
        }
      })

    },

    // 渲染
    renderTree(treeData) {
      // 渲染
      this.graph.data(treeData);  // 传入数据
      this.graph.render();  // 渲染
    },

    // 闪开事件
    traverseTree(treeData, next) {
      G6.Util.traverseTree(treeData, item=> {
        next(item)
      })
    },

    // 注册节点
    registerFn() {
      let _this = this

      // 自定义节点
      G6.registerNode(
        'flow-rect',
        {
          shapeType: 'flow-rect',
          draw(cfg, group) {
            const {
              nickName,
              deptName,
              labelName,
              updateTime,
              createTime,
              collapsed
            } = cfg;
            const grey = '#CED4D9';

            // 矩形框和字体配置
            const mainConfig = {
              rectFill: '#fff',  // 矩形框填充
              fontFill: '#000',  // 字体填充
              rectCursor: 'pointer',
              fontCursor: 'text',
            }

            // 逻辑不应该在这里判断
            // 矩形框配置
            const rectConfig = {
              width: 211,
              height: 100,
              lineWidth: 1,
              fontSize: 12,
              radius: 4,
              stroke: grey,
              fill: mainConfig.rectFill,  // 框
              cursor: mainConfig.rectCursor,
              opacity: 1,
            };

            // 配置信息
            const nodeOrigin = {
              x: -rectConfig.width / 2,
              y: -rectConfig.height / 2,
            };
            const rect = group.addShape('rect', {
              attrs: {
                x: nodeOrigin.x,
                y: nodeOrigin.y,
                ...rectConfig,
              },
              name: "react-box"
            });
            const textConfig = {
              textAlign: 'left',
              textBaseline: 'bottom',
            };
            const rectBBox = rect.getBBox();  // 底部对齐
            // console.log(nodeOrigin)  // 顶部对齐

            // x,y原点坐标
            const xPosition = 12 + nodeOrigin.x;
            const yPosition = 20 + nodeOrigin.y;

            /**
             * 字段显示
             */
            // label nickName
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: xPosition,
                y: yPosition,
                text: `创建人员：${nickName}`,
                fontSize: rectConfig.fontSize,
                opacity: rectConfig.opacity,
                fill: mainConfig.fontFill,
                cursor: mainConfig.fontCursor,
              },
              name: 'name-shape'
            });
            // label deptName
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: xPosition,
                y: yPosition + 20,
                text: `部门：${deptName}`,
                fontSize: rectConfig.fontSize,
                opacity: rectConfig.opacity,
                fill: mainConfig.fontFill,
                cursor: mainConfig.fontCursor,
              }
            });
            // label labelName
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: xPosition,
                y: yPosition + 40,
                // text: `状态：${labelName} (下级数目： ${cfg.children.length})`,
                text: cfg.children.length===0?`状态：${labelName}`:`状态：${labelName} (下级数目： ${cfg.children.length})`,
                fontSize: rectConfig.fontSize,
                opacity: rectConfig.opacity,
                fill: mainConfig.fontFill,
                cursor: mainConfig.fontCursor,
              }
            });
            // label createTime
            group.addShape('text', {
              attrs: {
                ...textConfig,
                x: xPosition,
                y: rectBBox.maxY - 12,
                text: `操作时间：${createTime}`,
                fontSize: rectConfig.fontSize,
                opacity: rectConfig.opacity,
                fill: mainConfig.fontFill,
                cursor: mainConfig.fontCursor,
              }
            });

            /**
             * 小框
             */
            // collapse rect
            if (cfg.children && cfg.children.length) {
              // 形状
              group.addShape('rect', {
                attrs: {
                  x: rectConfig.width / 2 - 8,
                  y: -8,
                  width: 16,
                  height: 16,
                  stroke: 'rgba(0, 0, 0, 0.25)',
                  cursor: 'pointer',
                  fill: '#fff',
                },
                name: 'collapse-back',
                modelId: cfg.id,
              });

              // collpase text
              group.addShape('text', {
                attrs: {
                  x: rectConfig.width / 2,
                  y: 1.2,
                  textAlign: 'center',
                  textBaseline: 'middle',
                  text: collapsed ? '+' : '-',
                  fontSize: 16,
                  cursor: 'pointer',
                  fill: 'rgba(0, 0, 0, 0.25)',
                },
                name: 'collapse-text',
                modelId: cfg.id,
              });
            }

            this.drawLinkPoints(cfg, group);
            return rect;
          },
          update(cfg, item) {
            const group = item.getContainer();
            this.updateLinkPoints(cfg, group);
          },
          setState(name, value, item) {
            if (name === 'collapse') {
              const group = item.getContainer();
              const collapseText = group.find((e) => e.get('name') === 'collapse-text');
              if (collapseText) {
                if (!value) {
                  collapseText.attr({
                    text: '-',
                  });
                } else {
                  collapseText.attr({
                    text: '+',
                  });
                }
              }
            }
          },
          getAnchorPoints() {
            return [
              [0, 0.5],
              [1, 0.5],
            ];
          },
        },
        'rect',
      );
    },

    // 注册tooltip
    getToolTip() {
      return new G6.Tooltip({
        offsetX: 20,
        offsetY: 30,
        // 允许出现 tooltip 的 item 类型
        itemTypes: ['node'],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
          // console.log(e)
          const outDiv = document.createElement('div');
          // style
          outDiv.style.padding = '8px 15px';

          const nodeRemark = e.item.getModel().remark;
          // console.log(nodeRemark)

          if(nodeRemark !== undefined) {
            if(nodeRemark) {
              let formatedNodeInof = '';
              for (let i = 0; i < nodeRemark.length; i++) {
                formatedNodeInof = `${formatedNodeInof}${nodeRemark[i]}`;
                if (i !== 0 && i % 20 === 0) formatedNodeInof = `${formatedNodeInof}<br/>`;
              }
              outDiv.innerHTML = `备注：${formatedNodeInof}`;
            } else {
              outDiv.innerHTML = `备注：${null}`
            }

            return outDiv;
          }

          return false
        },

        shouldBegin: (e) => {
          if (e.target.get('name') === 'react-box') {
            return true;
          }
          return false;
        }
      });
    },

    /**
     * api tools
     */
    // 获取树结构接口数据
    getAsyncTreeData() {
      // console.log(this.params)

      return new Promise((resolve, reject)=> {
        getProcessNodeTree(this.params).then(res=> {
          // console.log(res)

          let { rows } = res
          // console.log(rows[0])

          resolve(rows[0])
        }).catch(err=> {
          reject(err)
        })
      })
    },

    /**
     * tree
     */
    // 渲染脑图
    async renderBrainMap() {
      let treeData = await this.getAsyncTreeData()
      // console.log("000", brainMapData, treeData)

      // 渲染树
      this.graph = new G6.TreeGraph({
        container: 'g6Tree',  // dom节点
        ...this.treeConfig,  // g6配置
        plugins: [this.getToolTip()],
      })

      // 先执行，并渲染，否则找不到depth
      this.traverseTree(treeData, item=> {
        item.collapsed = !item.collapsed;
      })
      this.renderTree(treeData)  // 渲染

      // tree点击相关事件
      this.clickNodeEvent()

      // 再次渲染，判断depth
      this.traverseTree(treeData, item=> {
        // console.log(item.depth)
        /* if(item.depth > 3) {
          item.collapsed = true;  // 节点大于3收起，不加默认全部展开
        } */
      })
      this.renderTree(treeData)  // 渲染
      this.graph.fitView(120, 0);  // 自适应
    },
  },

  created() {
    this.initPage()  // 初始化
  }
}
</script>

<style lang="scss" scoped>

</style>
