<template>
  <div class="app-container">
    <div class="form">
      <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="80px">
        <el-form-item label="生产单号" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="生产单号" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="下单时间" prop="orderTime">
          <el-date-picker v-model="form.orderTime" type="date" placeholder="选择下单时间" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="客户名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productTitle">
          <el-input v-model="form.productTitle" placeholder="产品名称" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker
            v-model="form.deliveryDate"
            type="date"
            placeholder="选择交货日期"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item label="成品数量" prop="productCount">
          <el-input-number v-model="form.productCount" placeholder="成品数量" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="成品尺寸" prop="productSize">
          <el-input v-model="form.productSize" placeholder="成品尺寸" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="拼版尺寸" prop="makeUpSize">
          <el-input v-model="form.makeUpSize" placeholder="拼版尺寸" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="面纸配置" prop="facialTissueSet">
          <el-input v-model="form.facialTissueSet" placeholder="面纸配置" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="调纸尺寸" prop="adjustPaperSize">
          <el-input v-model="form.adjustPaperSize" placeholder="调纸尺寸" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="切纸尺寸" prop="cutPaperSize">
          <el-input v-model="form.cutPaperSize" placeholder="切纸尺寸" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="印刷颜色" prop="printColor">
          <el-input v-model="form.printColor" placeholder="印刷颜色" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="瓦纸配置" prop="tilePaperSet">
          <el-input v-model="form.tilePaperSet" placeholder="瓦纸配置" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="瓦纸尺寸" prop="tilePaperSize">
          <el-input v-model="form.tilePaperSize" placeholder="瓦纸尺寸" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="刀模" prop="knifeMold">
          <el-input v-model="form.knifeMold" placeholder="刀模" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="卡格要求" prop="cardRequirements">
          <el-input v-model="form.cardRequirements" placeholder="卡格要求" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="出货方式" prop="shipmentWay">
          <el-input v-model="form.shipmentWay" placeholder="出货方式" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="开单员" prop="createUserName">
          <el-input v-model="form.createUserName" placeholder="开单员" style="width: 178px;" />
        </el-form-item>
        <el-form-item label="打包要求" prop="packRequire">
          <el-input v-model="form.packRequire" placeholder="打包要求" style="width: 720px;" />
        </el-form-item>
        <el-form-item label="重要备注" prop="remarks">
          <el-input v-model="form.remarks" placeholder="重要备注" style="width: 720px;" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getOrderList } from '@/api/private/order'
export default {
  name: 'Order',
  data() {
    return {
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
      }
    }
  },
  // beforeCreate() {
  //     this.$route.meta.title = '订单管理'
  // },
  created() {
    // this.$route.meta.title = '新增订单'
    // this.$router.go(0);
    // window.location.reload();
    this.getList()
  },
  methods: {
    getList() {
      getOrderList().then(res => {
        console.log(res)
        if (res && res.content) {
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
