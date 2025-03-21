<template>
  <div class="app-container">
    <div class="head-container">
      <div class="condition">
        <el-input size="mini" placeholder="订单编号" style="width: 200px;" clearable />
      </div>
      <div class="btns">
        <el-button type="primary" size="mini">查询</el-button>
        <el-button type="success" size="mini">新增</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="productTitle" label="产品名称" />
      <el-table-column prop="customerName" label="客户名称" width="100" />
      <el-table-column prop="deliveryDate" label="交货日期" />
      <el-table-column prop="productCount" label="成品数量" />
      <el-table-column prop="shipmentWay" label="出货方式" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <!-- <template slot-scope="scope"> -->
        <template>
          <span>编辑</span>
          <span>删除</span>
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
    <el-dialog
      append-to-body
      :close-on-click-modal="false"
      :visible.sync="addVisible"
      :title="addTitle"
      width="580px"
    >
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item v-if="form.type.toString() === '2'" label="按钮名称" prop="title">
          <el-input v-model="form.title" placeholder="按钮名称" style="width: 178px;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="cancelAdd">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { getOrderList } from '@/api/private/order'
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
      addVisible: true,
      addTitle: '新增订单',
      form: {
        type: '0',
        iFrame: 'false',
        cache: 'false',
        hidden: 'false',
        menuSort: 0,
        pid: null
      },
      rules: {
        type: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
        title: [{ required: true, message: '请输入菜单标题', trigger: 'blur' }],
        permission: [{ required: true, message: '请输入权限标识', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getOrderList().then(res => {
        console.log(res)
        if (res && res.content) {
          this.tableData = res.content
          this.page.total = res.totalElements
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
    cancelAdd() {
      this.addVisible = false
    },
    confirmAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.addVisible = false
        }
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
</style>
