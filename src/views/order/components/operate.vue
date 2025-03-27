<template>
  <div class="app-container"  v-loading="loading">
    <div class="space">工单详情：</div>
    <div class="form">
      <el-form ref="form" :disabled="type==='view'" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="生产单号" prop="orderNum">
          <el-input v-model="form.orderNum" :placeholder="type === 'view' ? '' : '生产单号'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker v-model="form.orderTime" type="datetime" :placeholder="type === 'view' ? '' : '选择下单时间'" style="width: 190px;" value-format="yyyy-MM-dd HH:mm:ss" :prefix-icon="null" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" :placeholder="type === 'view' ? '' : '客户名称'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productTitle">
          <el-input v-model="form.productTitle" :placeholder="type === 'view' ? '' : '产品名称'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker v-model="form.deliveryDate" type="datetime" :placeholder="type === 'view' ? '' : '选择交货日期'" style="width: 190px;" value-format="yyyy-MM-dd HH:mm:ss" :prefix-icon="null" />
        </el-form-item>
        <el-form-item label="成品数量" prop="productCount">
          <el-input-number v-model="form.productCount" :placeholder="type === 'view' ? '' : '成品数量'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="成品尺寸" prop="productSize">
          <el-input v-model="form.productSize" :placeholder="type === 'view' ? '' : '成品尺寸'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="拼版尺寸" prop="makeUpSize">
          <el-input v-model="form.makeUpSize" :placeholder="type === 'view' ? '' : '拼版尺寸'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="面纸配置" prop="facialTissueSet">
          <el-input v-model="form.facialTissueSet" :placeholder="type === 'view' ? '' : '面纸配置'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="调纸尺寸" prop="adjustPaperSize">
          <el-input v-model="form.adjustPaperSize" :placeholder="type === 'view' ? '' : '调纸尺寸'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="切纸尺寸" prop="cutPaperSize">
          <el-input v-model="form.cutPaperSize" :placeholder="type === 'view' ? '' : '切纸尺寸'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="印刷颜色" prop="printColor">
          <el-input v-model="form.printColor" :placeholder="type === 'view' ? '' : '印刷颜色'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="瓦纸配置" prop="tilePaperSet">
          <el-input v-model="form.tilePaperSet" :placeholder="type === 'view' ? '' : '瓦纸配置'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="瓦纸尺寸" prop="tilePaperSize">
          <el-input v-model="form.tilePaperSize" :placeholder="type === 'view' ? '' : '瓦纸尺寸'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="刀模" prop="knifeMold">
          <el-input v-model="form.knifeMold" :placeholder="type === 'view' ? '' : '刀模'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="卡格要求" prop="cardRequirements">
          <el-input v-model="form.cardRequirements" :placeholder="type === 'view' ? '' : '卡格要求'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="出货方式" prop="shipmentWay">
          <el-input v-model="form.shipmentWay" :placeholder="type === 'view' ? '' : '出货方式'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="开单员" prop="createUserName">
          <el-input v-model="form.createUserName" :placeholder="type === 'view' ? '' : '开单员'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="打包要求" prop="packRequire">
          <el-input v-model="form.packRequire" :placeholder="type === 'view' ? '' : '打包要求'" style="width: 720px;" />
        </el-form-item>
        <el-form-item label="重要备注" prop="remarks">
          <el-input v-model="form.remarks" :placeholder="type === 'view' ? '' : '重要备注'" style="width: 720px;" />
        </el-form-item>
      </el-form>
    </div>
    <div class="space">工序详情：</div>
    <el-table :data="list" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="label" label="工序名称" width="100">
        <template slot-scope="scope">
          <span class="label-name">{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="workmanship" label="工艺要求" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.workmanship }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="produceNum" label="生产数量" />
      <el-table-column prop="lossNum" label="损耗数量" width="100" />
      <el-table-column prop="createUserName" label="机长名称" />
      <el-table-column prop="createTime" label="完成时间" />
      <el-table-column prop="checkUserName" label="审核人员" />
      <el-table-column prop="checkTime" label="审核时间" />
      <el-table-column v-if="type !== 'view'" label="操作" width="79px" align="center" fixed="right">
        <template slot-scope="scope">
          <span class="click-btn">编辑</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom"></div>
    <div class="btns">
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button v-if="type==='add' || type==='edit'" type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>

import { getOrderDetails } from '@/api/private/order'
export default {
  name: 'Order',
  data() {
    return {
      type: 'add',
      id: '',
      loading: false,
      form: {
        orderNum: '', // 生产单号
        orderTime: '', // 下单时间
        customerName: '', // 客户名称
        productTitle: '', // 产品名称
        deliveryDate: '', // 交货日期
        productCount: '', // 成品数量
        productSize: '', // 成品尺寸
        makeUpSize: '', // 拼版尺寸
        facialTissueSet: '', // 面纸配置
        adjustPaperSize: '', // 调纸尺寸
        cutPaperSize: '', // 切纸尺寸
        printColor: '', // 印刷颜色
        tilePaperSet: '', // 瓦纸配置
        tilePaperSize: '', // 瓦纸尺寸
        knifeMold: '', // 刀模
        cardRequirements: '', // 卡格要求
        shipmentWay: '', // 出货方式
        packRequire: '', // 打包要求
        remarks: '', // 重要备注
        createUserName: '' // 开单员
      },
      rules: {
        orderNum: [{ required: true, message: '请输入生产单号', trigger: 'blur' }]
      },
      list: []
    }
  },
  created() {
      if(this.$route.query.type) {
        this.type = this.$route.query.type
      }
      if(this.$route.query.id) {
        this.id = this.$route.query.id
      }
      if (this.type === 'view' || this.type === 'edit') {
        this.loading = true
        this.getDetails()
      }
  },
  methods: {
    getDetails() {
      getOrderDetails(this.id).then(res => {
        this.loading = false
        if (res) {
          this.form = res
          this.list = res.list
        }
      }).catch(() => {
        this.loading = false
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          addOrder(this.form).then(res => {
            if (!res) {
              this.$message.success('新增成功')
              // 调用全局挂载的方法,关闭当前标签页
              this.$store.dispatch("tagsView/delView", this.$route);
              // 返回上一步路由，返回上一个标签页
              this.$router.push({ path: '/order/index' })
            }
          })
        }
      })
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: '/order/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .form {
    margin-bottom: 10px;
  }
  .space {
    margin-bottom: 20px;
    color: #1890ff;
    font-size: 14px;
    font-weight: 600;
  }
  .bottom{
    width: 100%;
    height: 20px;
  }
  .btns {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    text-align: right;
  }
  .label-name{
    font-weight: bold;
  }
  .click-btn {
    color: #409EFF;
    cursor: pointer;
    margin-right: 6px;
  }
}
</style>
