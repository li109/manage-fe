<template>
  <el-dialog
    title="工序统计"
    width="75%"
    class="process-statistics"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-row>
      <el-col :span="22">
        <el-form ref="process" :model="fromProcess" :inline="true" label-width="80px">
          <el-form-item label="申报工序">
            <el-select v-model="fromProcess.code" placeholder="请选择申报工序" clearable>
              <el-option
                v-for="item of procedureData"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="dateArr"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:MM:SS"
              range-separator="至 "
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="2" class="search">
        <el-button type="primary" @click="getList(1)">查询</el-button>
      </el-col>
    </el-row> 

    <div class="table">
      <el-button type="primary">生产总数: {{ numTotal.produceTotal || 0 }}</el-button>
      <el-button type="danger">损耗总数: {{ numTotal.lossTotal || 0 }}</el-button>
      <el-table
        border
        v-loading="diaLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="tableData"
        style="width: 100%; margin-top: 10px;"
        stripe
      >
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column prop="orderNum" label="下单单号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="productTitle" label="产品名称" />
        <el-table-column prop="label" label="完成工序" />
        <el-table-column prop="createTime" label="申报时间" />
        <el-table-column prop="createUserName" label="申报人" />
        <el-table-column prop="produceNum" label="生产数量" />
        <el-table-column prop="lossNum" label="损耗数量" />
      </el-table>
      <el-pagination
        :page-size.sync="fromProcess.size"
        :total="total"
        :current-page.sync="fromProcess.page"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import { getListProcessStatisticians, getProcedureList, getTotal } from '@/api/private/order'
export default {
  name: 'ProcessStatistics',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      diaLoading: false,
      fromProcess: {
        page: 1,
        size: 10,
        startTime: '',
        endTime: '',
        code: ''
      },
      total: 0,
      numTotal: {},
      dateArr: [],
      procedureData: [],
      tableData: []
    }
  },
  components: {},
  mounted() {
    this.getProcedureList()
  },
  methods: {
    getList(val) {
      this.diaLoading = true
      if (val) this.fromProcess.page = val
      if (this.dateArr && this.dateArr.length > 0) {
        this.fromProcess.startTime = this.dateArr[0]
        this.fromProcess.endTime = this.dateArr[1]
      } else {
        this.fromProcess.startTime = ''
        this.fromProcess.endTime = ''
      }
      this.getTotal()
      getListProcessStatisticians(this.fromProcess)
        .then(res => {
          this.tableData = res.content
          this.total = res.totalPage
          this.diaLoading = false
        })
        .catch((e) => {
          this.diaLoading = false
        })
    },
    async getTotal() {
      let params = {
        code: this.fromProcess.code,
        startTime: '',
        endTime: ''
      }
      if (this.dateArr && this.dateArr.length > 0) {
        params.startTime = this.dateArr[0]
        params.endTime = this.dateArr[1]
      }
      this.numTotal = await getTotal(params)
    },
    async getProcedureList() {
      this.procedureData = await getProcedureList()
      this.fromProcess.code = this.procedureData[0].value
      this.getList()
    },
    // 关闭
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    // 表格条数
    handleSizeChange(val) {
      this.fromProcess.size = val
      this.getList(1)
    },
    // 表格页码
    handleCurrentChange(val) {
      this.fromProcess.page = val
      this.getList()
    },
  },
}
</script>
<style lang='scss' scoped>
.search {
  text-align: end;
}
::v-deep .el-range-separator {
  width: 7%;
}
</style>