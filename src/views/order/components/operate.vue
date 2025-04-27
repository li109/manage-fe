<template>
  <div class="app-container" v-loading="loading">
    <div class="space">工单详情：</div>
    <div class="form">
      <el-form ref="form" :disabled="type === 'view'" :inline="true" :model="form" :rules="rules" size="small"
        label-width="80px">
        <!-- <el-form-item label="生产单号" prop="orderNum">
          <el-input v-model="form.orderNum" :placeholder="type === 'view' ? '' : '生产单号'" style="width: 190px;" />
        </el-form-item> -->
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" :placeholder="type === 'view' ? '' : '客户名称'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productTitle">
          <el-input v-model="form.productTitle" :placeholder="type === 'view' ? '' : '产品名称'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="交货日期" prop="deliveryDate">
          <el-date-picker v-model="form.deliveryDate" type="date" :placeholder="type === 'view' ? '' : '选择交货日期'"
            style="width: 190px;" value-format="yyyy-MM-dd" :prefix-icon="null" />
        </el-form-item>
        <el-form-item label="成品数量" prop="productCount">
          <el-input-number v-model="form.productCount" :placeholder="type === 'view' ? '' : '成品数量'"
            style="width: 190px;" />
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
        <el-form-item label="面纸尺寸" prop="facialTissueSize">
          <el-input v-model="form.facialTissueSize" :placeholder="type === 'view' ? '' : '面纸尺寸'" style="width: 190px;" />
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
        <el-form-item label="印刷专色" prop="spotColor">
          <el-input v-model="form.spotColor" :placeholder="type === 'view' ? '' : '印刷专色'" style="width: 190px;" />
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
          <el-input v-model="form.cardRequirements" :placeholder="type === 'view' ? '' : '卡格要求'"
            style="width: 190px;" />
        </el-form-item>
        <el-form-item label="出货方式" prop="shipmentWay">
          <el-input v-model="form.shipmentWay" :placeholder="type === 'view' ? '' : '出货方式'" style="width: 190px;" />
        </el-form-item>
        <el-form-item label="开单员" prop="createUserName" v-if="type === 'edit'">
          <el-input v-model="form.createUserName" :placeholder="type === 'view' ? '' : '开单员'" disabled style="width: 190px;" />
        </el-form-item>
        <el-form-item label="打包要求" prop="packRequire">
          <el-input v-model="form.packRequire" :placeholder="type === 'view' ? '' : '打包要求'" style="width: 475px;" />
        </el-form-item>
        <el-form-item label="重要备注" prop="remarks">
          <el-input v-model="form.remarks" :placeholder="type === 'view' ? '' : '重要备注'" style="width: 475px;" />
        </el-form-item>
        <el-form-item label="示例图片" style="width: 100%">
          <el-upload
            :class="{ upload: uploadDisabled }"
            action
            :http-request="uploadSection"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-error="handleError"
            :before-upload="handleUpload"
            :limit="3"
            :file-list="fileList"
            accept=".png, .jpg, .jpeg"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div class="space">工序详情：</div>
    <el-table
      :data="list"
      ref="multipleTable"
      style="width: 100%"
      @select="handleSelectChange"
      @select-all="handleSelectAllChange"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" v-if="type != 'view'"/>
      <el-table-column type="index" label="序号" width="55" />
      <el-table-column prop="label" label="工序名称" width="100">
        <template slot-scope="scope">
          <span class="label-name">{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="produceNum" label="生产数量" />
      <el-table-column prop="lossNum" label="损耗数量" />
      <el-table-column prop="createUserName" label="机长名称" />
      <el-table-column prop="createTime" label="完成时间" />
      <!-- <el-table-column prop="checkUserName" label="审核人员" />
      <el-table-column prop="checkTime" label="审核时间" /> -->
      <el-table-column prop="remarks" label="备注信息" show-overflow-tooltip />
      <el-table-column v-if="type !== 'view'" label="操作" width="79" align="center" fixed="right">
        <template slot-scope="scope">
          <span v-if="scope.row.isShow" class="click-btn" @click="showEdit(scope.row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom"></div>
    <div class="btns">
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button v-if="type === 'add' || type === 'edit'" type="primary" @click="submit">提交</el-button>
      <el-button v-if="type === 'edit'" type="success" @click="submitOrders">完成订单</el-button>
    </div>

    <!-- 弹框 -->
    <el-dialog :title="editTitle" :visible.sync="editDialog" width="40%" :show-close="false" center>
      <el-form :model="editForm" ref="editForm" :label-width="formLabelWidth">
        <el-form-item label="生产数量">
          <el-input v-model="editForm.produceNum" autocomplete="off" placeholder="请输入生产数量"></el-input>
        </el-form-item>
        <el-form-item label="损耗数量">
          <el-input v-model="editForm.lossNum" autocomplete="off" placeholder="请输入损耗数量"></el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="editForm.remarks" type="textarea" autosize autocomplete="off" placeholder="请输入备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="confirmEdit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 放大图片 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="imageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

import { deepClone } from '@/utils/index'
import { getOrderDetails, getProcedureList, addOrder, editOrder, finishOrders } from '@/api/private/order'
import axios from 'axios'
import { getToken } from '@/utils/auth'
export default {
  name: 'Order',
  data() {
    return {
      type: 'add',
      id: '',
      loading: false,
      form: {
        // orderNum: '', // 生产单号
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
        createUserName: '', // 开单员,
        fileUrl: '' // 附件地址
      },
      rules: {
        orderNum: [{ required: true, message: '请输入生产单号', trigger: 'blur' }]
      },
      list: [],
      editDialog: false,
      editTitle: '编辑',
      formLabelWidth: '80px',
      editForm: {
        produceNum: '',
        lossNum: '',
        remarks: ''
      },
      imageUrl: '',
      uploadDisabled: false,
      dialogVisible: false,
      fileList: [],
      multipleSelection: [],
      disableAll: true
    }
  },
  beforeCreate() {
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
  },
  created() {
    if (this.$route.query.type) {
      this.type = this.$route.query.type
    }
    if (this.$route.query.id) {
      this.id = this.$route.query.id
    }
    if (this.type === 'view' || this.type === 'edit') {
      this.loading = true
      this.getDetails()
    }
    if (this.type === 'add') {
      this.loading = true
      this.getProcedure()
    }
  },
  mounted() {
  },
  methods: {
    getDetails() {
      this.getProcedure().then(() => {
        getOrderDetails(this.id).then(res => {
          this.loading = false
          if (res) {
            this.form = res
            // 查看只显示返回数据
            if (this.type === 'view') {
              this.list = res.list
            } else {
              if (res.list) {
                this.multipleSelection = res.list
                console.log('list2222', this.list)
                res.list.forEach(item => {
                  this.list.forEach(row => {
                    if (row.label == item.label) {
                      row.produceNum = item.produceNum
                      row.lossNum = item.lossNum
                      row.createUserName = item.createUserName
                      row.createTime = item.createTime
                      row.remarks = item.remarks
                      row.id = item.id
                      row.isShow = true
                      this.$refs.multipleTable.toggleRowSelection(row);
                    }
                  })
                });
              } else {
                this.$refs.multipleTable.clearSelection();
              }
            }
            if (res.fileUrl) {
              this.fileList = res.fileUrl.split(',').map((x, i) => {
                return { name: i + '.png', url: x }
              })
            } else {
              this.fileList = []
            }
          }
        }).catch(() => {
          this.loading = false
        })
      })
    },
    async getProcedure() {
      let list = await getProcedureList()
      this.loading = false
      this.list = list.map(x => {
        return {
          label: x.label,
          detailValue: x.value,
          workmanship: '',
          produceNum: '',
          lossNum: '',
          createUserName: '',
          createTime: '',
          remarks: '',
          id: '',
          isShow: false
        }
      })
      console.log('list1111', this.list)
      // getProcedureList().then(res => {
      //   this.loading = false
      //   if (res && res.length) {
      //     this.list = res.map(x => {
      //       return {
      //         label: x.label,
      //         detailValue: x.value,
      //         workmanship: '',
      //         produceNum: '',
      //         lossNum: '',
      //         createUserName: '',
      //         createTime: '',
      //         remarks: '',
      //         id: '',
      //         isShow: false
      //       }
      //     })
      //   }
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    submit() {
      if (this.type === 'add') {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            this.form.list = this.multipleSelection
            this.form.fileUrl = this.fileList.map(x => x.url).join(',')
            addOrder(this.form).then(res => {
              this.loading = false
              if (!res) {
                this.$message.success('新增成功')
                // 调用全局挂载的方法,关闭当前标签页
                this.$store.dispatch("tagsView/delView", this.$route);
                // 返回上一步路由，返回上一个标签页
                this.$router.push({ path: '/order/index' })
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
      if (this.type === 'edit') {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.loading = true
            this.form.list = this.multipleSelection
            console.log('multipleSelection', this.multipleSelection)
            this.form.fileUrl = this.fileList.map(x => x.url).join(',')
            editOrder(this.form).then(res => {
              this.loading = false
              if (!res) {
                this.$message.success('编辑成功')
                // 调用全局挂载的方法,关闭当前标签页
                this.$store.dispatch("tagsView/delView", this.$route);
                // 返回上一步路由，返回上一个标签页
                this.$router.push({ path: '/order/index' })
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    },
    cancel() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: '/order/index' })
    },
    showEdit(row) {
      this.editForm = deepClone(row)
      this.editTitle = `${row.label}工序编辑`
      this.editDialog = true
    },
    cancelEdit() {
      this.editForm = {
        produceNum: '',
        lossNum: '',
        remarks: ''
      }
      this.editDialog = false
    },
    confirmEdit() {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].label === this.editForm.label) {
          this.list[i].remarks = this.editForm.remarks
          this.list[i].produceNum = this.editForm.produceNum
          this.list[i].lossNum = this.editForm.lossNum
          break
        }
      }
      this.cancelEdit()
    },
    // 限制图片上传大小
    handleUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isJPG) {
        this.$message.error('上传示例图片只能是 JPG/PNG 格式!');
      }
      if (!isLt5M) {
        this.$message.error('上传示例图片大小不能超过 5MB!');
      }
      return isJPG && isLt5M;
    },
    // 查看图片
    handlePreview(file) {
      this.imageUrl = file.url;
      this.dialogVisible = true;
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    // 上传出误
    handleError() {
      this.$message.error('上传错误，请稍后重试。')
    },
    // 上传图片
    uploadSection(file) {
      const formData = new FormData();
      formData.append('file', file.file);
      axios.post(process.env.VUE_APP_BASE_API + '/api/order/upload', formData, {
        headers: {
          'Authorization': getToken(),
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (this.fileList.length < 3) {
          this.fileList.push({ name: file.name, url: process.env.VUE_APP_BASE_API + res.data[0] })
        }
      }).catch((e) => {
        this.$message.error('上传错误，请联系管理员')
      })
    },
    // 完成订单
    submitOrders() {
      this.$confirm('此操作将完成订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        finishOrders({ id: this.id }).then((res) => {
          this.$message.success('订单已完成')
          this.$router.go(-1)
        }).catch((e) => {
          this.$message.error('订单完成失败')
        });
      })
    },
    // 选择工序
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 单个选择
    handleSelectChange(val, row) {
      this.list.forEach(item => {
        if (item.label == row.label) item.isShow = !row.isShow
      })
    },
    // 全选
    handleSelectAllChange(val) {
      if (val.length > 0) {
        this.list.forEach(item => item.isShow = true)
      } else {
        this.list.forEach(item => item.isShow = false)
      }
    }
    // isSelectable(row) {
    //   if (this.type === 'edit' || this.type === 'add') {
    //     return this.disableAll;
    //   } else {
    //     return !this.disableAll;
    //   }
    // }
  },
  watch: {
    fileList: {
      handler(newVal) {
        if (newVal.length >= 3) {
          this.uploadDisabled = true 
        } else {
          this.uploadDisabled = false 
        }
      },
      deep: true
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

  .bottom {
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

  .label-name {
    font-weight: bold;
  }

  .click-btn {
    color: #409EFF;
    cursor: pointer;
    margin-right: 6px;
  }

  .upload {
    ::v-deep .el-upload--picture-card {
      display: none !important;
    }
  }
}
</style>
