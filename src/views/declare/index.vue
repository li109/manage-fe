<template>
  <div class="app-container">
    <div class="header-container">
      <div class="left">
        <span class="input-label">生产单号:</span>
        <el-autocomplete v-model="orderNum" :fetch-suggestions="querySearchAsync" placeholder="请输入生产单号"
          @select="handleSelect" clearable></el-autocomplete>
      </div>
      <div class="right">
        <el-button type="primary" size="mini" @click="queryOrder">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>

import { getOrderNumList, getOrderDetails } from '@/api/private/order'
export default {
  name: 'Order',
  data() {
    return {
      orderNum: '',
      orderId: '',
      orderObj: {},
      orderObjList: []
    }
  },
  created() { },
  methods: {
    handleSelect(item) {
      this.orderId = this.orderObjList.find(x => x.orderNum === item.value).id;
    },
    querySearchAsync(queryString, cb) {
      if (!queryString) {
        cb([]);
        return;
      }
      getOrderNumList(queryString).then(res => {
        if (res && res.length) {
          this.orderObjList = res.map(x => x);
          cb(res.map(item => ({ value: item.orderNum })));
        } else {
          cb([]);
        }
      }).catch(() => {
        cb([]);
      });
    },
    queryOrder() {
      if (!this.orderNum) {
        return;
      }
      getOrderDetails(this.orderId).then(res => {
        console.log(res);
      }).catch(() => {
        this.$message.error('查询失败');
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .header-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .input-label {
      font-size: 14px;
      margin-right: 10px;
    }
  }
}
</style>