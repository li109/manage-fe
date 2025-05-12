<template>
  <div class="app-container">
    <div class="head-container">
      <el-row>
        <el-col :span="21">
          <el-form ref="search" :model="search" :inline="true" label-width="80px">
            <el-form-item label="生产单号">
              <el-input v-model="search.orderNum" placeholder="请输入生产单号" clearable></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="search.isFinish" placeholder="请选择订单状态" clearable>
                <el-option label="全部订单" value=""></el-option>
                <el-option label="未完成订单" value="0"></el-option>
                <el-option label="已完成订单" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成品尺寸">
              <el-input v-model="search.productSize" placeholder="请输入成品尺寸" clearable></el-input>
            </el-form-item>
            <el-form-item label="客户名称">
              <el-input v-model="search.customerName" placeholder="请输入客户名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
              <el-input v-model="search.productTitle" placeholder="请输入产品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="面纸配置">
              <el-input v-model="search.facialTissueSet" placeholder="请输入面纸配置" clearable></el-input>
            </el-form-item>
            <el-form-item label="面纸尺寸">
              <el-input v-model="search.facialTissueSize" placeholder="请输入面纸尺寸" clearable></el-input>
            </el-form-item>
            <el-form-item label="印刷专色">
              <el-input v-model="search.spotColor" placeholder="请输入印刷专色" clearable></el-input>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="dateArr"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至 "
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="3">
          <div class="btns">
            <el-button type="primary" size="mini" :loading="loading" @click="getList(1)">查询</el-button>
            <el-button size="mini" @click="reset">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-button type="success" size="mini" @click="goto('add')">新增订单</el-button>
      <el-button type="primary" size="mini" @click="handleProcess">工序统计</el-button>
    </div>

    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)"
      :data="tableData"
      style="width: 100%; margin-top: 10px;"
      stripe
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="orderNum" label="下单单号" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="click-btn" @click="goto('view', scope.row.id)">{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" />
      <el-table-column prop="productTitle" label="产品名称" />
      <el-table-column prop="productCount" label="订单数量" />
      <el-table-column prop="productSize" label="成品尺寸" />
      <el-table-column prop="facialTissueSet" label="面纸配置" />
      <el-table-column prop="facialTissueSize" label="面纸尺寸" />
      <el-table-column prop="printColor" label="印刷颜色" />
      <el-table-column prop="spotColor" label="印刷专色" />
      <el-table-column label="交货日期" width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.deliveryDate">
            {{ scope.row.deliveryDate.substring(0, scope.row.deliveryDate.lastIndexOf(' ')) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="finishProcedure" label="完成工序" />
      <el-table-column prop="finishCount" label="完成数量" />
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="生成新订单" placement="top">
            <span class="click-btn" @click="copyOrder(scope.row.id)">复制</span>
          </el-tooltip>
          <span class="click-btn" v-if="!scope.row.isFinish" @click="goto('edit', scope.row.id)">编辑</span>
          <span class="click-btn" @click="deleteItem(scope.row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size.sync="search.size"
      :total="total"
      :current-page.sync="search.page"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <ProcessStatistics
      :dialogVisible.sync="dialogVisible"
    ></ProcessStatistics>
  </div>
</template>

<script>

import { getOrderList, deleteOrder, copyOrders } from '@/api/private/order'
import ProcessStatistics from "./components/processStatistics.vue"
export default {
  name: 'Order',
  data() {
    return {
      search: {
        isFinish: '0',
        productSize: '',
        productTitle: '',
        customerName: '',
        orderNum: '',
        facialTissueSet: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: 10,
      },
      total: 0,
      dateArr: [],
      tableData: [],
      loading: false,
      dialogVisible: false,
    }
  },
  components: {
    ProcessStatistics
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取订单
    getList(val) {
      this.loading = true
      if (val) this.search.page = val
      if (this.dateArr && this.dateArr.length > 0) {
        this.search.startTime = this.dateArr[0]
        this.search.endTime = this.dateArr[1]
      } else {
        this.search.startTime = ''
        this.search.endTime = ''
      }
      getOrderList(this.search).then(res => {
        if (res && res.content) {
          this.tableData = res.content
          this.total = res.totalElements
          this.search.page = res.currPage
          this.search.size = res.pageSize
          this.loading = false
        }
      }).catch((e) => {
        this.loading = false
      })
    },
    // 重置
    reset() {
      this.search = {
        isFinish: '0',
        productSize: '',
        productTitle: '',
        customerName: '',
        orderNum: '',
        facialTissueSet: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: 10,
      }
      this.getList()
    },
    // 表格条数
    handleSizeChange(val) {
      this.search.size = val
      this.getList(1)
    },
    // 表格页码
    handleCurrentChange(val) {
      this.search.page = val
      this.getList()
    },
    // 跳转
    goto(type, id) {
      let query = { type }
      if (id == '0' || id) {
        query = { type, id }
      }
      this.$router.push({ path: '/private/detail', query })
    },
    // 删除订单
    deleteItem(id) {
      this.$confirm('此操作将【<strong>永久删除该订单</strong>】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
        dangerouslyUseHTMLString: true
      }).then(() => {
        deleteOrder([id]).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {})
    },
    // 复制订单
    copyOrder(id) {
      this.$confirm('此操作将【<strong>生成新的订单</strong>】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        copyOrders({id}).then(() => {
          this.$message.success('新订单生成成功')
          this.getList(1)
        }).catch((e) => {
          this.$message.error('新订单生成失败')
        })
      })
    },
    // 工序统计
    handleProcess() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.head-container {
    display: flex;
    justify-content: space-between;

    .condition {
        display: flex;
        align-items: center;
        .text {
          display: none;
          margin-right: 10px;
          font-size: 14px;
        }
    }

    ::v-deep .el-range-separator {
      width: 7%;
    }
}
.click-btn {
    color: #409EFF;
    cursor: pointer;
    margin-right: 6px;
}

.btns {
  text-align: end;
}
</style>
