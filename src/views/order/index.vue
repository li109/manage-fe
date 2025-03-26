<template>
  <div class="app-container">
    <div class="head-container">
      <div class="condition">
        <el-input size="mini" placeholder="订单编号" style="width: 200px;" clearable />
      </div>
      <div class="btns">
        <el-button type="primary" size="mini">查询</el-button>
        <el-button type="success" size="mini" @click="goto('add')">新增</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="orderNum" label="生产单号" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="click-btn" @click="goto('view', scope.row.id)">{{ scope.row.orderNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productTitle" label="产品名称" />
      <el-table-column prop="customerName" label="客户名称" width="100" />
      <el-table-column prop="deliveryDate" label="交货日期" />
      <el-table-column prop="productCount" label="成品数量" />
      <!-- <el-table-column prop="shipmentWay" label="订单状态" /> -->
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="click-btn" @click="goto('edit', scope.row.id)">编辑</span>
          <span class="click-btn" @click="deleteItem(scope.row.id)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size.sync="page.size"
      :total="page.total"
      :current-page.sync="page.page"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>

import { getOrderList, deleteOrder } from '@/api/private/order'
export default {
  name: 'Order',
  data() {
    return {
      tableData: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getOrderList().then(res => {
        if (res && res.content) {
          this.tableData = res.content
          this.page.total = res.totalElements
          this.page.page = res.currPage
          this.page.size = res.pageSize
        }
      })
    },
    handleSizeChange(val) {
      this.page.size = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page.page = val
      this.getList()
    },
    goto(type, id) {
      let query = { type }
      if (id == '0' || id) {
        query = { type, id }
      }
      this.$router.push({ path: '/private/detail', query })
    },
    deleteItem(id) {
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder([id]).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    }
}
.click-btn {
    color: #409EFF;
    cursor: pointer;
    margin-right: 6px;
}
</style>
