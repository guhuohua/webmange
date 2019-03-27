<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入用户名" v-model="listQuery.username">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入手机号" v-model="listQuery.mobile">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <!--<el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>-->
      <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" width="100px" label="用户ID" prop="id" sortable>
      </el-table-column>

      <el-table-column align="center" label="姓名" prop="nickname">
      </el-table-column>

      <el-table-column align="center" label="手机号码" prop="tel">
      </el-table-column>

      <!--<el-table-column align="center" label="性别" prop="gender">-->
        <!--<template slot-scope="scope">-->
          <!--<el-tag >{{genderDic[scope.row.gender]}}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="申请时间" prop="createTime">
        <template slot-scope="scope">
          {{updateData(scope.row.createTime)}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="申请信息" prop="note">
      </el-table-column>
      <el-table-column align="center" label="推荐人" prop="code">
      </el-table-column>

      <el-table-column align="center" label="通过时间" prop="agreedTime">
        <template slot-scope="scope">
          {{updateData(scope.row.agreedTime)}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="拒绝信息" prop="disagreeNote">
      </el-table-column>

      <!--<el-table-column align="center" label="生日" prop="birthday">-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">{{statusDic[scope.row.status]}}</el-tag>
          <el-tag v-if="scope.row.status === 1" type="success">{{statusDic[scope.row.status]}}</el-tag>
          <el-tag v-if="scope.row.status === 2" type="danger">{{statusDic[scope.row.status]}}</el-tag>
        </template>
      </el-table-column>



      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">同意</el-button>
          <el-button type="danger" size="mini"  @click="handleDelete(scope.row)">拒绝</el-button>
        </template>
      </el-table-column>
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
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="dataForm.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item label="状态" prop="status">-->
          <!--<el-select v-model="dataForm.status">-->
            <!--<el-option label="禁用" :value="0">-->
            <!--</el-option>-->
            <!--<el-option label="可用" :value="1">-->
            <!--</el-option>-->
            <!--<el-option label="注销" :value="2">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="updateData">确定</el-button>
        <el-button v-else type="primary" @click="applyData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { applyUser, applyList, refuseUser } from '@/api/user'
import timeUtil from '../../utils/TimeUtils'

export default {
  name: 'User',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.dataForm.checkPassword !== '') {
          this.$refs.dataForm.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.dataForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
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
        password: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        nickname: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      genderDic: ['未知', '男', '女'],
      levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
      // statusDic: ['禁用', '可用', '注销']
      statusDic: ['待审核', '已通过', '已拒绝']
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      applyList(this.listQuery).then(response => {
        this.list = response.data.res.items
        this.total = response.data.res.total
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
          applyUser(this.dataForm).then(response => {
            this.list.unshift(response.data.res)
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
    applyData() {
      applyUser(this.dataForm).then((res) => {
        for (const v of this.list) {
          if (v.id === this.dataForm.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, res.data.res)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: '审核成功',
          message: '该用户已通过审核',
          type: 'success',
          duration: 2000
        })
      })

      setTimeout(() => {
        this.getList()
      }, 2000)

    },
    handleDelete(row) {
      this.$prompt('请输入拒绝理由', '拒绝审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        refuseUser({ id: row.id, value: value }).then(res => {
          for (const v of this.list) {
            if (v.id === this.dataForm.id) {
              const index = this.list.indexOf(v)
              this.list.splice(index, 1, res.data.res)
              break
            }
          }
          this.$notify({
            title: '操作成功',
            message: '已拒绝该用户审核',
            type: 'success',
            duration: 2000
          })
        })
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消操作'
        })
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
    },
    updateData(time) {
      return time == null ? '' : timeUtil.formatDate(new Date(time))
    }
  }
}
</script>
