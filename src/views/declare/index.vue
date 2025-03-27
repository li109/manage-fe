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
    <div class="details" v-if="showFlag">
      <div class="details-part">
        <div><span>产品名称:</span><span>{{ form.productTitle }}</span></div>
        <div><span>成品数量:</span><span>{{ form.productCount }}</span></div>
      </div>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="工单详情展开" name="1">
          <div class="details-content">
            <div><span>下单时间:</span><span>{{ form.orderTime }}</span></div>
            <div><span>客户名称:</span><span>{{ form.customerName }}</span></div>
            <div><span>交货日期:</span><span>{{ form.deliveryDate }}</span></div>
            <div><span>成品尺寸:</span><span>{{ form.productSize }}</span></div>
            <div><span>拼版尺寸:</span><span>{{ form.makeUpSize }}</span></div>
            <div><span>面纸配置:</span><span>{{ form.facialTissueSet }}</span></div>
            <div><span>调纸尺寸:</span><span>{{ form.adjustPaperSize }}</span></div>
            <div><span>切纸尺寸:</span><span>{{ form.cutPaperSize }}</span></div>
            <div><span>印刷颜色:</span><span>{{ form.printColor }}</span></div>
            <div><span>瓦纸配置:</span><span>{{ form.tilePaperSet }}</span></div>
            <div><span>瓦纸尺寸:</span><span>{{ form.tilePaperSize }}</span></div>
            <div><span>刀模:</span><span>{{ form.knifeMold }}</span></div>
            <div><span>卡格要求:</span><span>{{ form.cardRequirements }}</span></div>
            <div><span>出货方式:</span><span>{{ form.shipmentWay }}</span></div>
            <div><span>打包要求:</span><span>{{ form.packRequire }}</span></div>
            <div><span>重要备注:</span><span>{{ form.remarks }}</span></div>
            <div><span>开单员:</span><span>{{ form.createUserName }}</span></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="table">
      <el-table :data="list" style="width: 100%" v-if="showFlag">
        <!-- <el-table-column type="index" label="序号" width="50" /> -->
        <el-table-column prop="label" label="工序名称" width="80">
          <template slot-scope="scope">
            <span class="label-name">{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="workmanship" label="工艺要求" />
        <el-table-column label="已申报" align="center" width="68">
          <template slot-scope="scope">
            <span v-if="scope.row.produceNum || scope.row.lossNum || scope.row.createUserName" class="apply">已申报</span>
            <span v-else class="click-btn" @click="apply(scope.row)">申报</span>
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center" width="68">
          <template slot-scope="scope">
            <span v-if="scope.row.isCheck" class="check">已审核</span>
            <span v-else class="click-btn">审核</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-space"></div>
    <el-dialog :title="applyTitle" :visible.sync="applyDialog" width="80%" :show-close="false" center>
      <el-form :model="applyForm" :rules="applyRules" ref="applyForm" :label-width="formLabelWidth">
        <el-form-item label="生产数量" prop="produceNum">
          <el-input v-model="applyForm.produceNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="损耗数量" prop="lossNum">
          <el-input v-model="applyForm.lossNum" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="applyDialog = false">取 消</el-button>
        <el-button type="primary" @click="applyDialog = false">确 定</el-button>
      </div>
    </el-dialog>
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
      orderObjList: [],
      showFlag: false,
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
      activeNames: ['2'],
      list: [],
      applyDialog: false,
      applyTitle: '申报',
      formLabelWidth: '80px',
      applyForm: {
        produceNum: '',
        lossNum: ''
      },
      applyRules:{
          produceNum: [{ required: true, message: '请输入生产数量', trigger: 'blur' }],
          lossNum: [{ required: true, message: '请输入损耗数量', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.showFlag = false;
  },
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
        if (res) {
          this.showFlag = true;
          this.form = res;
          this.list = res.list.map(x => x);
        }
      }).catch(() => {
        this.$message.error('查询失败');
      });
    },
    apply(row) {
      if(row) {
        this.applyTitle = `${row.label}工序申报`;
        this.applyDialog = true;
      }
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

  .details {
    margin-top: 20px;

    .details-part {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      font-size: 14px;

      div {
        margin-right: 20px;

        span:nth-child(2) {
          display: inline-block;
          min-width: 60px;
          margin-left: 10px;
        }
      }
    }

    .details-content {
      margin-top: 6px;

      div {
        margin-bottom: 10px;

        span {
          margin-right: 10px;
        }
      }
    }
  }

  .table {
    width: 100%;
    margin-top: 10px;
  }

  .label-name {
    font-weight: bold;
  }

  .click-btn {
    color: #409EFF;
    cursor: pointer;
  }

  .apply {
    color: #67C23A;
  }

  .check {
    color: #E6A23C;
  }

  .bottom-space {
    width: 100%;
    height: 20px;
  }
}

.no-scroll .el-table__body-wrapper {
  overflow-x: hidden !important;
  /* 禁止水平滚动 */
}

.el-table__body {
  width: 100% !important;
}
</style>