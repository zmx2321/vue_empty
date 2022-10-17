<template>
  <!-- <el-table v-bind="$attrs" v-on="$listeners" :data="tableData" :style="{height:height}" @current-change="handleBrainTbChange" :span-method="splitCellMethod" v-loading="listLoading"> -->
  <el-table v-if="isFixed" v-bind="$attrs" v-on="$listeners" :data="tableData" :style="{height:height}" v-loading="listLoading" :height="fixHeight">
    <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item" :align="item.align ? item.align : 'left'" :show-overflow-tooltip="item.isShowTool ? item.isShowTool : false"></el-table-column>
  </el-table>
  <el-table v-else v-bind="$attrs" v-on="$listeners" :data="tableData" :style="{height:height}" :span-method="splitCellMethod" v-loading="listLoading">
    <el-table-column v-for="(item, index) in columns" :key="index" v-bind="item" :align="item.align ? item.align : 'left'"></el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    // 列
    columns: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: ()=> []
    },
    height: {
      type: String,
      default: '150px'
    },
    isFixed: {
      type: Boolean,
      default: false
    },
    fixHeight: {
      type: String,
      default: '215'
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    // 是否有点击事件
    isClick: {
      type: Boolean,
      default: false
    },
    // 需要被合并的表格 - 判断是否需要拆分单元格
    splitTableName: {
      type: String,
      default: ''
    }
  },

  created() {
    this.$nextTick(()=> {
      this.handleBrainTbChange()
    })
  },

  methods: {
    // 单击表格事件
    // handleBrainTbChange(item) {
    //   // console.log(item)

    //   // 如果需要绑定点击
    //   if(this.isClick) {
    //     console.log(this.$el)
    //     /* this.$el.addEventListener('load', e=> {
    //       console.log(e)
    //     }) */

    //     // console.log(item)
    //     this.$emit('getCompanyData', item)
    //   }
    // },
    // 单击表格事件
    handleBrainTbChange() {
      if(this.isClick) {
        this.$el.addEventListener('click', e=> {
          let trNode = e.target.parentNode.parentNode
          let { textContent } = trNode

          // let tbodyList = trNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelectorAll('tbody')
          this.toggleTr(trNode)  // toggle

          this.tableData.forEach(item=> {
            let current = item.company_short_name ? item.company_short_name : item.area_anme
            if(textContent.search(current) === 0) {
              // console.log(item)

              // 是否为服务区  1 是   2 不是  isServer
              item.isServer = '2'
              this.$emit('getRowData', item)
            }
          })
        })
      }
    },
    // 删除所有表格状态
    removeTrClass(NodeClass='tr_active', tableClass='.industrial_table_wrap') {
      let tableTrList = document.querySelectorAll(tableClass)

      tableTrList.forEach(item=> {
        let trList = item.querySelectorAll('tr.el-table__row')
        trList.forEach(jitem=> {
          jitem.classList.remove(NodeClass)
        })
      })
    },
    // 删除当前表格状态
    removeCurrentTrClass(NodeClass='tr_active') {
      let { childNodes } = this.$el.querySelector('tbody')

      childNodes.forEach(item=> {
        if(item.nodeName === 'TR') {
          item.classList.remove(NodeClass)
        }
      })
    },

    // toggle
    toggleTr(trNode, NodeClass='tr_active') {
      this.removeTrClass(NodeClass)
      this.removeCurrentTrClass()
      trNode.classList.add(NodeClass)
    },

    /**
     * row 表格每一行的数据
     * column 表格每一列的数据
     * rowIndex 表格的行索引,不包括表头,从0开始
     * columnIndex 表格的列索引,从0开始
     */
    // 单元格事件
    splitCellMethod({ row, column, rowIndex, columnIndex }) {
      // 浙商文化合并单元格
      if(this.splitTableName === '浙商文化') {
        // 第一行
        if(rowIndex === 0) {
          // 第一行不变
          return [1,1]
        } else {
          // 第一列
          if(columnIndex === 0) {
            // 第二行向下合并3行
            if(rowIndex === 1) {
              return [3, 1]
            }
            // 第五行向下合并3行
            if(rowIndex === 4) {
              return [3, 1]
            }
            // 第五行向下合并3行
            if(rowIndex === 7) {
              return [3, 1]
            }
            // 第十行向下合并5行
            if(rowIndex === 10) {
              return [5, 1]
            }
            /* // 第十三行向下合并3行
            if(rowIndex === 13) {
              return [3, 1]
            } */

            // 删除多余单元格
            return [0, 0]
          }
        }
      }

      // 浙商互联合并单元格
      if(this.splitTableName === '浙商互联') {
        // 第一行
        if(rowIndex === 0) {
          // 第一行不变
          return [1,1]
        } else {
          // 第一列
          if(columnIndex === 0) {
            // 第二行向下合并4行
            if(rowIndex === 1) {
              return [4, 1]
            }

            // 删除多余单元格
            return [0, 0]
          }
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.el-table {
  width: 100%;
  background: @lgnMainColor;
  border: none;
  overflow-y: auto;

  &::before {
    display: none;
  }

  ::v-deep .hidden-columns {
    display: none;
  }

  ::v-deep .el-loading-mask {
    background-color: @loadingMask
  }

  ::v-deep .el-table__header-wrapper, ::v-deep .el-table__body-wrapper {
    .el-table__empty-block {
      span {
        font-size: 12px;
        color: #fff;
      }
    }

    table {
      colgroup {
        display: none;
      }

      thead, tbody {
        tr {
          background: @lgnMainColor;
          border: none;

          &:hover {
            td {
              background: initial;
            }
          }

          th, td {
            padding: 0;
            background: @lgnMainColor;
            border: none;

            .cell {
              padding: 0;
              background: @lgnMainColor;
              font-family: @pingFontFamily;
              font-size: 12px;
              color: #fff;
              overflow:hidden;/*内容超出后隐藏*/
              text-overflow: ellipsis;/* 超出内容显示为省略号 */
              white-space: nowrap;/* 文本不进行换行 */
            }
          }
        }
      }
    }
  }

  ::v-deep .el-table__header-wrapper {
    table {
      thead {
        tr {
          th {
            .cell {
              font-weight: 600;
              color: #58B2FF;
            }
          }
        }
      }
    }
  }

  ::v-deep .el-table__body-wrapper {
    table {
      tbody {
        tr {
          transition: .2s linear;

          td {
            .cell {
              &.el-tooltip {
                padding-right: 5px !important;
                width: initial !important;
              } 
            }
          }

          &:nth-child(odd) {
            td {
              .cell {
                background: rgba(79,135,228,0.2000);
              }
            }
          }
        }
      }
    }
  }

  // 可点击状态
  // 产业发展
  &.industrial_table_wrap, &.service_area_table_wrap {
    ::v-deep .el-table__header-wrapper, ::v-deep .el-table__body-wrapper {
      table {
        thead, tbody {
          tr {
            th, td {
              &:nth-child(1) {
                width: 63px;

                .cell {
                  padding-left: 6px;
                }
              }
              &:nth-child(2) {
                width: 132px;
              }
              &:nth-child(3) {
                width: 70px;

                .cell {
                  padding-right: 6px;
                }
              }
            }
          }
        }

        tbody {
          tr {
            &:hover, &.tr_active {
             td {
              .cell {
                  transition: .3s linear;
                  background: #447fd5;
                }
              }
            }
          }
        }
      }
    }

    ::v-deep .el-table__body-wrapper {
      tbody {
        .cell {
          cursor: pointer;
        }
      }
    }
  }

  // 服务区经营数据
  &.service_area_table_wrap {
    ::v-deep .el-table__header-wrapper {
      margin-bottom: 10px;
    }

    ::v-deep .el-table__body-wrapper {
      table {
        tbody {
          td {
            .cell {
              padding: 9px 0;
            }
          }
        }
      }
    }
  }

  // 公共服务数据
  &.public_service_table_wrap {
    overflow: hidden;
    cursor: pointer;

    ::-webkit-scrollbar {
      display: none;
    }

    ::v-deep .el-table__header-wrapper, ::v-deep .el-table__body-wrapper {
      table {
        thead, tbody {
          tr {
            th, td {
              &:nth-child(1) {
                width: 45px;
              }
              &:nth-child(2) {
                width: 82px;
              }
            }
          }
        }
      }
    }

    ::v-deep .el-table__header-wrapper {
      margin-bottom: 10px;

      table {
        thead, tbody {
          tr {
            th {
              &:nth-child(3) {
                .cell {
                  padding-left: 15px;
                }
              }
            }
          }
        }
      }
    }

    ::v-deep .el-table__body-wrapper {
      table {
        tbody {
          td {
            .cell, .cell.el-tooltip {
              padding: 6.5px 0;
            }
          }
        }
      }
    }
  }
}
</style>