<template>
  <div class="app-container">
      <div class="param-container">
      <!-- 学生名称 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('student.name')" v-model="listQuery.studentName">
      </el-input>
      <!-- 学院类型 -->
      <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.collegeType" :placeholder="$t('table.college.type')">
        <el-option v-for="item in collegeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <!-- 结果类型 -->
      <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.type" :placeholder="$t('result.type')">
        <el-option v-for="item in resultTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <el-button style="margin-left:60px;" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>


    <!-- 显示内容 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="loading......" border fit highlight-current-row 
    @current-change="handleCurrentChange" 
      style="width: 100%;margin-top:20px;">
      <el-table-column label="图片" fixed min-width="140">
            <template slot-scope="scope">
                <img style="width:100px;height:80px" :src="'http://localhost:9092/' + scope.row.imgUrl" />
            </template>
      </el-table-column>
      <el-table-column label="日期" width="140">
            <template slot-scope="scope">
                <span>{{scope.row.signTime}}</span>
            </template>
        </el-table-column>
        <el-table-column  label="姓名" width="120">
            <template slot-scope="scope">
                <span>{{scope.row.studentName}}</span>
            </template>
        </el-table-column>
        <el-table-column label="学号">
            <template slot-scope="scope">
                <span>{{scope.row.studentNo}}</span>
            </template>
        </el-table-column>
        <el-table-column label="设备名称">
            <template slot-scope="scope">
                <span>{{scope.row.deviceName}}</span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="签到状态">
            <template slot-scope="scope">
                <span>{{scope.row.type | myTypeFileter}}</span>
            </template>
        </el-table-column>
    </el-table>


    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

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

const resultTypeOptions = [
  { key:0 , display_name: '正常' },
  { key:1 , display_name: '异常' },
  { key:2 , display_name: '作弊' },
  { key:4 , display_name: '缺勤' }
]

export default {
  name: 'resultList',
  directives: {
      waves
  },
  data(){
    return{
      tableKey:0,
      total:10,
      baseUrl:'/result/',
      downloadLoading:false,
      collegeTypeOptions,
      resultTypeOptions,
      listQuery:{
        page:1,
        size:10,
        name:undefined,
        type:undefined,
        collegeType:undefined,
        studentName:undefined
      },
      list:null
    }
  },
  created(){
    this.getList()
  },
  filters:{
    myTypeFileter(val){
      // return resultTypeOptions.map(t => {
      //   if(val === t.key){
      //     return t.display_name
      //   }else{
      //     return
      //   }
      // }).filter(x => x !== null)
      for(let type of resultTypeOptions){
        if(val === type.key){
          return type.display_name
        }
      }
    }
  },
  methods:{
    handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
    handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
    },
    handleSizeChange(val) {
        this.listQuery.size = val
        this.getList()
      },
    getList(){
      this.listLoading = true
        fetchListWithUrl(this.baseUrl + 'pages' ,this.listQuery).then(response => {
          console.log(response)
          this.list = response.data.content
          this.total = response.data.numberOfElements
          this.listLoading = false
        })

    },
    handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'signTime', 'type', 'studentNo', 'studentName','collegeName','deviceName']
          const filterVal = ['id', 'signTime', 'type', 'studentNo', 'studentName','collegeName','deviceName']
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
        if (j === 'signTime') {
          return v[j]
        } else {
          return v[j]
        }
      }))
     }
  }
  
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container{
  margin-top: 20px;
  .filter-item{
    margin-right: 20px;
  }
}
</style>

