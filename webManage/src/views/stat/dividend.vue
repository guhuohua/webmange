<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名" v-model="listQuery.username">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号" v-model="listQuery.tel">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!--<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>-->
      <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="序号" prop="id" sortable>
      </el-table-column>

      <!--<el-table-column align="center" label="头像" prop="photoImg">-->
        <!--<template slot-scope="scope">-->
          <!--<img :src="scope.row.photoImg" width="40" v-if="scope.row.photoImg"/>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="用户id" prop="userId">
      </el-table-column>

      <el-table-column align="center" label="来源id" prop="sourceUserId">
      </el-table-column>

      <el-table-column align="center" label="订单号" prop="ordId">
      </el-table-column>

      <el-table-column align="center" label="时间" prop="createTime">
      </el-table-column>

      <!--<el-table-column align="center" label="用户等级" prop="userLevel">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag >{{levelDic[scope.row.userLevel]}}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="金额" prop="money">
      </el-table-column>

     <!-- <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">详情</el-button>
        </template>
      </el-table-column>-->
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="姓名" prop="username">
          <el-input v-model="dataForm.nickname" placeholder="真实姓名" :disabled="dialogStatus == 'update'"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="dataForm.tel" placeholder="手机号码为登录账号" :disabled="dialogStatus == 'update'"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="dataForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword" >
          <el-input type="password" v-if="dialogStatus === 'create'" v-model="dataForm.checkPassword" auto-complete="off"></el-input>
          <el-input type="password" v-if="dialogStatus === 'update'" v-model="dataForm.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="dataForm.gender">
            <el-option label="未知" :value="0">
            </el-option>
            <el-option label="男" :value="1">
            </el-option>
            <el-option label="女" :value="2">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker v-model="dataForm.birthday" type="date" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <!--<el-form-item label="用户等级" prop="userLevel">-->
          <!--<el-select v-model="dataForm.userLevel">-->
            <!--<el-option label="普通用户" :value="0">-->
            <!--</el-option>-->
            <!--<el-option label="VIP用户" :value="1">-->
            <!--</el-option>-->
            <!--<el-option label="高级VIP用户" :value="2">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="状态" prop="status">
          <el-select v-model="dataForm.status">
            <el-option label="禁用" :value="0">
            </el-option>
            <el-option label="可用" :value="1">
            </el-option>
            <el-option label="注销" :value="2">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { createUser, updateUser, dividendUser } from '@/api/user'

export default {
  name: 'Dividend',
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        nickname: undefined,
        tel: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      dataForm: {
        id: undefined,
        username: '',
        tel: '',
        password: undefined,
        checkPassword: undefined,
        gender: 0,
        userLevel: 0,
        birthday: undefined,
        status: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {},
      downloadLoading: false,
      genderDic: ['未知', '男', '女'],
      levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
      statusDic: ['禁用', '可用', '注销']
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      dividendUser(this.listQuery).then(response => {
        console.log('response', response)
        const res = response.data.res
        this.list = res.content
        this.total = res.totalElements
        // this.list = response.data.res.items
        // this.total = response.data.res.total
        this.listLoading = false
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        username: '',
        mobile: '',
        pass: undefined,
        checkPass: undefined,
        gender: 0,
        userLevel: 0,
        birthday: undefined,
        status: 0
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.dataForm).then(response => {
            this.list.unshift(response.data.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '警告',
        message: '用户删除操作不支持！',
        type: 'warning',
        duration: 3000
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['用户名', '手机号码', '性别', '生日', '状态']
        const filterVal = ['username', 'mobile', 'gender', 'birthday', 'status']
        excel.export_json_to_excel2(tHeader, this.list, filterVal, '用户信息')
        this.downloadLoading = false
      })
    }
  }
}
</script>
