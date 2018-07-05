<template>
  <div class="app-container">
    <div class="param-container">
      <!-- 学院名称 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.college.title')" v-model="listQuery.name">
      </el-input>
      <!-- 学院类型 -->
      <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.type" :placeholder="$t('table.college.type')">
        <el-option v-for="item in collegeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('table.add')}}</el-button>

      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <!-- 显示内容 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="loading......" border fit highlight-current-row 
    @current-change="handleCurrentChange" 
      style="width: 100%">
      <el-table-column align="center" :label="$t('table.college.name')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('table.college.date')">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('table.college.type')">
        <template slot-scope="scope">
          <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.type}}</span>
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('table.author')">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="180px" :label="$t('table.college.evaluation')">
        <template slot-scope="scope">

          <el-rate
            v-model="scope.row.evaluation"
            disabled
            show-score
            text-color="#ff9900"
            score-template="{value}">
          </el-rate>

        </template>
      </el-table-column>
    
      <el-table-column class-name="status-col" :label="$t('table.college.status')" width="150px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | myStatusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="280px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='0'" size="mini" type="success" @click="handleModifyStatus(scope.row,'normal')">{{$t('table.normal')}}
          </el-button>
          <el-button v-if="scope.row.status!='1'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{$t('table.draft')}}
          </el-button>
          <el-button v-if="scope.row.status!='2'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>



    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px" style='width: 400px; margin-left:50px;'>
        <!-- 名称 -->
        <el-form-item :label="$t('table.college.name')" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('table.college.type')" prop="type">
          <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
            <el-option v-for="item in  collegeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.college.date')" prop="timestamp">
          <el-date-picker v-model="temp.createDate" type="datetime" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('table.college.status')">
          <el-select class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in  myStatusOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.college.evaluation')">
          <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900', '#0011ee', '#ee0ecc']" :max='5'></el-rate>
        </el-form-item>
        <el-form-item :label="$t('table.remark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('table.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('table.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import {postReq, fetchListWithUrl,postReqWithUrl, putReqWithUrl} from '@/api/httpClient'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

const collegeTypeOptions = [
  { key:'0' , display_name: '理科类' },
  { key:'1' , display_name: '工科类' },
  { key:'2' , display_name: '艺术类' },
  { key:'3' , display_name: '体育类' },
  { key:'4' , display_name: '文学类' },
  { key:'5' , display_name: '化工类' },
  { key:'6' , display_name: '信息类' }
]

const myStatusOptions = [
  {key: '0', name: 'normal'},
  {key: '1', name: 'draft'},
  {key: '2', name: 'deleted'}
]

const collegeTypeKeyValue = collegeTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

  export default{
    name: 'collegeList',
    directives: {
      waves
    },

    data() {
      return {
        total: null,
        myStatusOptions,
        tableKey: 0,
        baseUrl:'/college/',
        //类型
        collegeTypeOptions,
        downloadLoading: false,

        currentRow: null,

        list: null,
        listLoading: true,
        //更新|增加

        dialogStatus: '',
        statusOptions: ['normal', 'draft', 'deleted'],

        listQuery: {
          page: 1,
          limit: 20,
          importance: undefined,
          name: undefined,
          type: undefined,
          sort: '+id'
        },
        //是否显示
        dialogFormVisible: false,
        temp: {
          id: undefined,
          name: '',
          importance: 1,
          remark: '',
          createDate: new Date(),
          title: '',
          type: '',
          status: 'published',
          creater:'admin'
        },
      textMap: {
        update: '学院编辑',
        create: '学院添加'
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        createDate: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'blur' }]
      },
      list: null,

      }

    },
    filters:{
      statusFilter(status) {
        console.log(status)
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      },
      typeFilter(type) {
        return collegeTypeKeyValue[type]
      },
      myStatusFilter(status){
        return myStatusOptions[status].name
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      resetTemp() {
        this.temp = {
          id: undefined,
          importance: 1,
          remark: '',
          createDate: new Date(),
          title: '',
          status: 'published',
          type: '',
          creater:'admin'
        }
      },
      getList() {
        this.listLoading = true
        fetchListWithUrl(this.baseUrl + 'pages' ,this.listQuery).then(response => {
          console.log(response)
          this.list = response.data.content
          this.total = response.data.numberOfElements
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'admin'
            postReqWithUrl(this.baseUrl, this.temp).then(() => {
              this.list.unshift(this.temp)
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.createDate = new Date(this.temp.createDate)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.createDate = +new Date(tempData.createDate) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            putReqWithUrl(this.baseUrl + '/update', tempData).then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
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
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['name', 'createDate', 'type', 'author', 'importance','status']
          const filterVal = ['name', 'createDate', 'type', 'author', 'importance','status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'createDate') {
          return v[j]
        } else {
          return v[j]
        }
      }))
     },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      handleModifyStatus(row, status) {
        console.log(row)
        const dataA = Object.assign({}, row)
        if (status === 'draft') {
                dataA.status = 1
              }else if (status === 'normal') {
                dataA.status = 0
              } else if (status === 'deleted') {
                dataA.status = 2
              }
        putReqWithUrl(this.baseUrl + '/update', dataA).then(() => {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            })
        if (status === 'draft') {
          row.status = 1
        }else if (status === 'normal') {
          row.status = 0
        }else if (status === 'deleted') {
           row.status = 2
         }
      }

    }

  }
</script>

<style type="text/css"  lang="scss" scoped>
  .param-container{
    margin-top: 20px;
  }
</style>