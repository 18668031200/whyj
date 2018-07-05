<template>
  <div class="info-container">
    <div class="param-container info-param">
      <!-- 学院类型 -->
      <el-select clearable style="width: 90px;margin-left20px;" class="filter-item" v-model="listQuery.type" :placeholder="$t('table.college.type')">
        <el-option v-for="item in collegeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
        </el-option>
      </el-select>

      <!-- 班级名称 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;margin-left:20px;" class="filter-item" :placeholder="$t('table.college.title')" v-model="listQuery.collegeName">
      </el-input>

      <!-- 学生姓名 -->
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('table.class.name')" v-model="listQuery.name">
      </el-input>

      <el-button style="margin-left:60px;" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>
      <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">{{$t('table.export')}}</el-button>
    </div>

    <!-- 显示内容 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="loading......" border fit highlight-current-row 
    @current-change="handleCurrentChange" height="400"
      style="width: 100%">
      <el-table-column align="center" fixed :label="$t('student.image')" min-width="200px">
        <template slot-scope="scope">
          <!-- <img :src="'http://localhost:9092/' + scope.row.imgListStr" /> -->
          <img  style="width:80px;height:80px" :src="'http://localhost:9092/' + url" v-for="url in scope.row.imgListStr.split(',')"  :key="url"/>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('student.name')">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" align="center" :label="$t('student.gender')">
        <template slot-scope="scope">
          <span>{{scope.row.gender | genderFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" :label="$t('student.type')">
        <template slot-scope="scope">
          <el-tag @click="handleUpdate(scope.row)" >{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('student.address')">
        <template slot-scope="scope">
          <span>{{scope.row.address | nullFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="$t('student.phone')">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="$t('student.className')">
        <template slot-scope="scope">
          <span>{{scope.row.className}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" :label="$t('student.collegeName')">
        <template slot-scope="scope">
          <span>{{scope.row.collegeName}}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" :label="$t('table.actions')" fixed="right"  width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!='2'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
          <el-button v-if="scope.row.status!='2'" size="mini" type="info" @click="move2attendance(scope.row)">{{$t('student.attendance')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="'签到率'" :visible.sync="dialogFormVisible">
       <pie-chart style="margin-top:30px;" :myData="myData"></pie-chart>
      <!-- <el-button type="info" style="margin-top:20px;" @click="handleConfirm" v-waves icon="el-icon-check">{{$t('table.confirm')}}</el-button> -->
    </el-dialog>

  </div>
</template>
<script type="text/javascript">
import PieChart from '@/components/PieChart'
import waves from '@/directive/waves' // 水波纹指令
import {postReq, fetchListWithUrl,postReqWithUrl, putReqWithUrl,myDeleteReqWithUrl} from '@/api/httpClient'

const collegeTypeOptions = [
  { key:'0' , display_name: '理科类' },
  { key:'1' , display_name: '工科类' },
  { key:'2' , display_name: '艺术类' },
  { key:'3' , display_name: '体育类' },
  { key:'4' , display_name: '文学类' },
  { key:'5' , display_name: '化工类' },
  { key:'6' , display_name: '信息类' }
]

const genderType = ['-', '男', '女']
const typeOptions = ['大专', '本科', '硕士','博士']

  export default{
    name: 'studentList',
    components:{PieChart},
    directives:{
      waves
    },
    data() {
      return{
        myData:[{value:0, name:'正常'},{value:1,name:'缺勤'},{value:0, name:'作弊'},{value:0 ,name:'警告'}],
        downloadLoading:false,
        dialogFormVisible:false,
        typeOptions,
        genderType,
        tableKey: 0,
        total: 0,
        list: null,
        collegeTypeOptions,
        baseUrl:'/student/',
        listQuery: {
          page: 1,
            size: 20,
            importance: undefined,
            name: undefined,
            type: undefined,
            sort: '+id',
            collegeName:undefined
        }
      }
    },
    filters:{
      genderFilter(gender){
        return genderType[gender]
      },
      typeFilter(type){
        return typeOptions[type]
      },
      nullFilter(obj){
        if(!obj){
          return '-'
        }else{
          return obj
        }
      }
    },
    created() {
      this.getStudentList()
    },
    methods:{
      handleCurrentChange(val) {
        this.listQuery.page = val
        //this.getStudentList()
      },
      handleFilter(val){
        this.listQuery.name = val
        this.getStudentList()
      },
      handleSizeChange(val){
        this.listQuery.size = val
        this.getStudentList()
      },
      getStudentList(){
        this.listLoading = true
        fetchListWithUrl(this.baseUrl + 'pages' ,this.listQuery).then(response => {
          console.log(response)
          this.list = response.data.content
          this.total = response.data.numberOfElements
          this.listLoading = false
        })
      },
      handleModifyStatus(row, status){
        var id = {'id':row.id}
        myDeleteReqWithUrl(this.baseUrl, id).then(() =>{

        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      },
      handleFace(str){
        console.log('aa')
        console.log(str)
      },
      move2attendance(row){
      this.dialogFormVisible = true
    },
    handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['id', 'name', 'type', 'studentNo', 'gender','collegeName','address','phone']
          const filterVal = ['id', 'name', 'type', 'studentNo', 'gender','collegeName','address','phone']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'student-list'
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
<style lang="scss" type="text/css" scoped>
.param-container{
  margin: 50px;
  text-align: left;
}
.filter-item{
  margin-left: 20px;
}
</style>

