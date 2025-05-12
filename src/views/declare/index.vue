<template>
  <div class="app-container">
    <div class="header-container">
      <!-- <el-col :span="18">
        <span class="input-label">产品名称:</span>
        <el-input v-model="search.productTitle" placeholder="请输入产品名称"></el-input>
        <el-autocomplete v-model="orderNum" :fetch-suggestions="querySearchAsync" placeholder="请输入产品名称"
          @select="handleSelect" clearable></el-autocomplete>
      </el-col>
      <el-col :span="6">
        <div class="btns">
          <el-button type="primary" @click="queryOrder">查询</el-button>
          <el-button size="mini" @click="reset">重置</el-button>
        </div>
      </el-col> -->
      <el-form :inline="true" :model="search" class="form-inline">
        <el-form-item label="产品名称">
          <el-input v-model="search.productTitle" placeholder="请输入产品名称"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
      </el-form>
    </div>

    <div v-if="!showFlag">
      <el-table 
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.3)"
        :data="tableData" style="width: 100%" stripe
      >
        <el-table-column type="index" label="序号" width="55"></el-table-column>
        <el-table-column prop="orderNum" label="订单编号" min-width="100px">
          <template slot-scope="scope">
            <span class="click-btn" @click="gotoOrder(scope.row)">{{ scope.row.orderNum }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="productTitle" label="产品名称"></el-table-column>
        <el-table-column prop="facialTissueSet" label="面纸配置"></el-table-column>
        <el-table-column prop="tilePaperSet" label="瓦纸配置"></el-table-column>
        <el-table-column prop="tilePaperSize" label="瓦纸尺寸"></el-table-column>
        <el-table-column prop="productSize" label="成品尺寸"></el-table-column>
        <el-table-column prop="specialStr" label="特殊工序"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
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
    </div>

    <div class="details" v-if="showFlag">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="工单详情展开" name="1">
          <div class="details-content">
            <div class="content-item"><div>产品名称:</div><div>{{ form.productTitle }}</div></div>
            <div class="content-item"><div>成品数量:</div><div>{{ form.productCount }}</div></div>
            <!-- <div class="content-item"><div>下单时间:</div><div>{{ form.orderTime }}</div></div> -->
            <div class="content-item"><div>客户名称:</div><div>{{ form.customerName }}</div></div>
            <div class="content-item"><div>交货日期:</div>
              <div v-if="form.deliveryDate">{{ form.deliveryDate.substring(0, form.deliveryDate.lastIndexOf(' ')) }}</div>
            </div>
            <div class="content-item"><div>成品尺寸:</div><div>{{ form.productSize }}</div></div>
            <div class="content-item"><div>拼版尺寸:</div><div>{{ form.makeUpSize }}</div></div>
            <div class="content-item"><div>面纸配置:</div><div>{{ form.facialTissueSet }}</div></div>
            <div class="content-item"><div>面纸尺寸:</div><div>{{ form.facialTissueSize }}</div></div>
            <div class="content-item"><div>调纸尺寸:</div><div>{{ form.adjustPaperSize }}</div></div>
            <div class="content-item"><div>切纸尺寸:</div><div>{{ form.cutPaperSize }}</div></div>
            <div class="content-item"><div>印刷颜色:</div><div>{{ form.printColor }}</div></div>
            <div class="content-item"><div>印刷专色:</div><div>{{ form.printColor }}</div></div>
            <div class="content-item"><div>瓦纸配置:</div><div>{{ form.tilePaperSet }}</div></div>
            <div class="content-item"><div>瓦纸尺寸:</div><div>{{ form.tilePaperSize }}</div></div>
            <div class="content-item"><div>刀模:</div><div>{{ form.knifeMold }}</div></div>
            <div class="content-item"><div>卡格要求:</div><div>{{ form.cardRequirements }}</div></div>
            <div class="content-item"><div>出货方式:</div><div>{{ form.shipmentWay }}</div></div>
            <div class="content-item"><div>打包要求:</div><div>{{ form.packRequire }}</div></div>
            <div class="content-item"><div>重要备注:</div><div>{{ form.remarks }}</div></div>
            <div class="content-item"><div>开单员:</div><div>{{ form.createUserName }}</div></div>
            <div class="content-item"><div>示例图片:</div>
              <el-upload
                :class="{ upload: uploadDisabled }"
                action
                disabled
                :on-preview="handlePreview"
                :file-list="fileList"
                list-type="picture-card">
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div class="table">
      <el-table :data="list" style="width: 100%" v-if="showFlag" stripe>
        <!-- <el-table-column type="index" label="序号" width="50" /> -->
        <el-table-column prop="label" label="工序名称" width="80">
          <template slot-scope="scope">
            <span class="label-name">{{ scope.row.label }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="已申报" align="center" width="68"> -->
        <el-table-column label="已申报" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.createUser" class="apply">已申报</span>
            <span v-else class="click-btn" @click="apply(scope.row)">申报</span>
          </template>
        </el-table-column>
        <el-table-column label="机长签字" align="center" prop="createUserName"></el-table-column>
        <el-table-column label="申报数量" align="center" prop="produceNum"></el-table-column>
        <el-table-column label="损耗数量" align="center" prop="lossNum"></el-table-column>
        <el-table-column label="备注" align="center" prop="remarks"></el-table-column>
        <!-- <el-table-column label="审核" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isCheck" class="check">已审核</span>
            <span v-else class="click-btn" @click="check(scope.row)">审核</span>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <div class="bottom-space"></div>
    <el-dialog :title="applyTitle" :visible.sync="applyDialog" width="80%" :show-close="false" center>
      <el-form :model="applyForm" :rules="applyRules" ref="applyForm" :label-width="formLabelWidth">
        <el-form-item label="生产数量" prop="produceNum">
          <el-input v-model="applyForm.produceNum" autocomplete="off" placeholder="请输入生产数量"></el-input>
        </el-form-item>
        <el-form-item label="损耗数量" prop="lossNum">
          <el-input v-model="applyForm.lossNum" autocomplete="off" placeholder="请输入损耗数量"></el-input>
        </el-form-item>
        <!-- <el-form-item label="备注信息" >
          <el-input v-model="applyForm.remarks" disabled type="textarea" autocomplete="off" placeholder="请输入备注信息"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelApply">取 消</el-button>
        <el-button type="primary" @click="confirmApply">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="checkTitle" :visible.sync="checkDialog" width="80%" :show-close="false" center>
      <div class="check-content">
        <div class="item">
          <div>生产数量</div>
          <div>{{ currentCheck.produceNum }}</div>
        </div>
        <div class="item">
          <div>损耗数量</div>
          <div>{{ currentCheck.lossNum }}</div>
        </div>
        <div class="item">
          <div>备注信息</div>
          <div>{{ currentCheck.remarks }}</div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCheck">取 消</el-button>
        <el-button type="primary" @click="confirmCheck">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 放大图片 -->
    <el-dialog :visible.sync="dialogVisible" width="100%">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
 
import { deepClone } from '@/utils/index'
import {
  getOrderNumList,
  getOrderDetails,
  updateProcedure,
  updateCheck,
  getOrderList
} from '@/api/private/order'
import { search } from 'core-js/fn/symbol';
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
      activeNames: ['1'],
      list: [],
      applyDialog: false,
      applyTitle: '申报',
      formLabelWidth: '80px',
      applyForm: {
        produceNum: '',
        lossNum: '',
        remarks: ''
      },
      applyRules:{
          produceNum: [{ required: true, message: '请输入生产数量', trigger: 'blur' }],
          lossNum: [{ required: true, message: '请输入损耗数量', trigger: 'blur' }]
      },
      currentProcedure: {},
      checkDialog: false,
      checkTitle: '审核',
      currentCheck: {},
      fileList: [],
      dialogVisible: false,
      uploadDisabled: false,
      imageUrl: '',
      tableData: [],
      total: 0,
      loading: false,
      search: {
        isFinish: 0,
        productTitle: '',
        page: 1,
        size: 10,
      }
    }
  },
  created() {
    this.showFlag = false;
    this.getList(1)
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
          if (res.fileUrl) {
            this.fileList = res.fileUrl.split(',').map((x, i) => {
              return { name: i + '.png', url: x }
            })
          } else {
            this.fileList = []
          }
          this.uploadDisabled = true
        }
      }).catch(() => {
        this.$message.error('查询失败');
      });
    },
    reset() {
      this.orderNum = ''
      this.form = {
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
      }
      this.fileList = []
      this.showFlag = false
      this.getList(1)
    },
    apply(row) {
      if(row) {
        this.currentProcedure = deepClone(row);
        this.applyTitle = `${row.label}工序申报`;
        this.applyDialog = true;
        this.applyForm.remarks = row.remarks
      }
    },
    cancelApply() {
      this.currentProcedure = {};
      this.applyForm.produceNum = '';
      this.applyForm.lossNum = '';
      this.applyForm.remarks = '';
      this.applyDialog = false;
    },
    confirmApply() {
      this.$refs.applyForm.validate(valid => {
        if (valid) {
          this.currentProcedure.produceNum = this.applyForm.produceNum;
          this.currentProcedure.lossNum = this.applyForm.lossNum;
          this.currentProcedure.remarks = this.applyForm.remarks;
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
    },
    // 查看图片
    handlePreview(file) {
      this.imageUrl = file.url;
      this.dialogVisible = true;
    },
    // 获取未完成订单
    getList(val) {
      this.loading = true
      if (val) this.search.page = val
      getOrderList(this.search).then(res => {
        if (res && res.content) {
          this.tableData = res.content
          this.total = res.totalElements
          this.loading = false
          this.showFlag = false
        }
      }).catch((e) => {
        this.loading = false
      })
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
    // 订单详细
    gotoOrder(row) {
      this.orderId = row.id
      this.orderNum = row.orderNum
      this.queryOrder()
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
    // margin-bottom: 15px;
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

.upload {
  ::v-deep .el-upload--picture-card {
    display: none !important;
  }
}

.btns {
  text-align: end;
  .el-button {
    margin-bottom: 10px;
  }
}
</style>