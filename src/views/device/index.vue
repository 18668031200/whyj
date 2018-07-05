<template>
  <div class="app-container">
      <div class="param-container">
            <!-- 通道名称 -->
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('device.name')" v-model="listQuery.name">
            </el-input>
            <!-- 设备类型 -->
            <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.type" :placeholder="$t('device.type')">
                <el-option v-for="item in deviceTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                </el-option>
            </el-select>
            <!-- 设备ip -->
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('device.ip')" v-model="listQuery.name">
            </el-input>
            <!-- 设备端口 -->
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('device.ip')" v-model="listQuery.name">
            </el-input>
            <!-- 设备位置 -->
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('device.location')" v-model="listQuery.name">
            </el-input>

            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('table.search')}}</el-button>

      </div>

      <!-- 显示内容 -->
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="loading......" border fit highlight-current-row 
    @current-change="handleCurrentChange" 
      style="width: 100%">
      <el-table-column align="center" :label="$t('device.name')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed align="center" :label="$t('device.channelName')" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.channelName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" :label="$t('device.createDate')">
        <template slot-scope="scope">
          <span>{{scope.row.createDate}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" :label="$t('device.type')">
        <template slot-scope="scope">
          <el-tag>{{scope.row.type | typeFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('device.ip')">
        <template slot-scope="scope">
          <span>{{scope.row.ip}}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" :label="$t('device.port')">
        <template slot-scope="scope">
          <span>{{scope.row.port}}</span>
        </template>
      </el-table-column>
      <el-table-column width="160px" align="center" :label="$t('device.location')">
        <template slot-scope="scope">
          <span>{{scope.row.location}}</span>
        </template>
      </el-table-column>
    
      <el-table-column class-name="status-col" :label="$t('device.status')" width="150px">
        <template slot-scope="scope">
          <el-tag :type="info">{{scope.row.status | myStatusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('table.actions')" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
          <el-button v-if="scope.row.status!='2'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{$t('table.delete')}}
          </el-button>
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

const typeOption = ['-','人脸抓拍机', '标清摄像机','高清摄像机','超清摄像机']

const statusOption = ['-', '正常', '故障']

const deviceTypeOptions = [
    {key:0 ,display_name:'不详'},
    {key:1 ,display_name:'人脸抓拍机'},
    {key:2 ,display_name:'标清摄像机'},
    {key:3 ,display_name:'高清摄像机'},
    {key:4 ,display_name:'超清摄像机'}
]

export default {
    name:'deviceList',
    directives: {
      waves
    },
  data(){
      return{
          total:0,
          tableKey:0,
          deviceTypeOptions,
          baseUrl: '/device/',
          list: null,
          listLoading: true,
          listQuery:{
              page: 1,
              size: 10,
              name: undefined,
              type: undefined,
              ip: undefined,
              port: undefined

          }
      }
  },
  filters:{
      typeFilter(type){
          return typeOption[type]
      },
      myStatusFilter(status){
          return statusOption[status]
      }
  },
  created() {
      this.getDeviceList()
    },
  methods:{
      handleFilter() {
        this.listQuery.page = 1
        this.getDeviceList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getDeviceList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getDeviceList()
      },
      getDeviceList(){
          this.listLoading = true
        fetchListWithUrl(this.baseUrl + 'pages' ,this.listQuery).then(response => {
          this.list = response.data.content
          this.total = response.data.numberOfElements
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getDeviceList()
      }
  }
}
</script>
<style type="text/css"  lang="scss" scoped>
  .param-container{
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .pagination-container{
      margin-top: 60px;
  }
</style>
