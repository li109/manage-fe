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
      <el-collapse v-model="activeNames">
        <el-collapse-item title="工单详情展开" name="1">
          <div class="details-content">
            <div class="content-item"><div>产品名称:</div><div>{{ form.productTitle }}</div></div>
            <div class="content-item"><div>成品数量:</div><div>{{ form.productCount }}</div></div>
            <div class="content-item"><div>下单时间:</div><div>{{ form.orderTime }}</div></div>
            <div class="content-item"><div>客户名称:</div><div>{{ form.customerName }}</div></div>
            <div class="content-item"><div>交货日期:</div><div>{{ form.deliveryDate }}</div></div>
            <div class="content-item"><div>成品尺寸:</div><div>{{ form.productSize }}</div></div>
            <div class="content-item"><div>拼版尺寸:</div><div>{{ form.makeUpSize }}</div></div>
            <div class="content-item"><div>面纸配置:</div><div>{{ form.facialTissueSet }}</div></div>
            <div class="content-item"><div>调纸尺寸:</div><div>{{ form.adjustPaperSize }}</div></div>
            <div class="content-item"><div>切纸尺寸:</div><div>{{ form.cutPaperSize }}</div></div>
            <div class="content-item"><div>印刷颜色:</div><div>{{ form.printColor }}</div></div>
            <div class="content-item"><div>瓦纸配置:</div><div>{{ form.tilePaperSet }}</div></div>
            <div class="content-item"><div>瓦纸尺寸:</div><div>{{ form.tilePaperSize }}</div></div>
            <div class="content-item"><div>刀模:</div><div>{{ form.knifeMold }}</div></div>
            <div class="content-item"><div>卡格要求:</div><div>{{ form.cardRequirements }}</div></div>
            <div class="content-item"><div>出货方式:</div><div>{{ form.shipmentWay }}</div></div>
            <div class="content-item"><div>打包要求:</div><div>{{ form.packRequire }}</div></div>
            <div class="content-item"><div>重要备注:</div><div>{{ form.remarks }}</div></div>
            <div class="content-item"><div>开单员:</div><div>{{ form.createUserName }}</div></div>
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
            <span v-else class="click-btn" @click="check(scope.row)">审核</span>
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
        <el-button @click="cancelApply">取 消</el-button>
        <el-button type="primary" @click="confirmApply">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="checkTitle" :visible.sync="checkDialog" width="80%" :show-close="false" center>
      <div class="check-content">
        <div class="item">
          <div>工艺要求</div>
          <div>{{ currentCheck.workmanship }}</div>
        </div>
        <div class="item">
          <div>生产数量</div>
          <div>{{ currentCheck.produceNum }}</div>
        </div>
        <div class="item">
          <div>损耗数量</div>
          <div>{{ currentCheck.lossNum }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCheck">取 消</el-button>
        <el-button type="primary" @click="confirmCheck">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
 
import { deepClone } from '@/utils/index'
import { getOrderNumList, getOrderDetails, updateProcedure, updateCheck } from '@/api/private/order'
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
      },
      currentProcedure: {},
      checkDialog: false,
      checkTitle: '审核',
      currentCheck: {},
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
        this.currentProcedure = deepClone(row);
        this.applyTitle = `${row.label}工序申报`;
        this.applyDialog = true;
      }
    },
    cancelApply() {
      this.currentProcedure = {};
      this.applyForm.produceNum = '';
      this.applyForm.lossNum = '';
      this.applyDialog = false;
    },
    confirmApply() {
      this.$refs.applyForm.validate(valid => {
        if (valid) {
          this.currentProcedure.produceNum = this.applyForm.produceNum;
          this.currentProcedure.lossNum = this.applyForm.lossNum;
          updateProcedure(this.currentProcedure).then(res => {
            if (!res) {
              this.cancelApply();
              this.queryOrder();
              this.$message.success('申报成功');
            }
          }).catch(() => {
            this.$message.error('申报失败');
          });
        }
      });
    },
    check(row) {
      if(row) {
        this.currentCheck = deepClone(row);
        if(this.currentCheck.produceNum || this.currentCheck.lossNum || this.currentCheck.createUserName) {
          this.checkTitle = `${row.label}工序审核`;
          this.checkDialog = true;
        } else {
          this.$message({
            message: '该工序未申报！',
            type: 'warning'
          });
        }
      }
    },
    cancelCheck() {
      this.currentCheck = {};
      this.checkDialog = false;
    },
    confirmCheck() {
      updateCheck({id: this.currentCheck.id}).then(res => {
        if (!res) {
          this.cancelCheck();
          this.queryOrder();
          this.$message.success('审核成功');
        }
      }).catch(() => {
        this.$message.error('审核失败');
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
    .left {
      display: flex;
      align-items: center;
      .input-label {
        font-size: 13px;
        margin-right: 4px;
      }
    }
  }

  .details {
    margin-top: 20px;

    .details-content {
      margin-top: 6px;

      .content-item {
        width: 100%;
        display: flex;
        margin-bottom: 10px;
        div:nth-child(1) {
          width: 70px;
          text-align: right;
          font-weight: 600;
        }
        div:nth-child(2) {
          width: calc(100% - 82px);
          margin-left: 10px;
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

.check-content {
  width: 100%;
  .item {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    div:nth-child(1) {
      width: 80px;
      text-align: right;
      font-weight: 600;
    }
    div:nth-child(2) {
      width: calc(100% - 112px);
      margin-left: 10px;
    }
  }
}
</style>