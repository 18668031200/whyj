<template>
  <div class="app-container">
      <el-container style="height: 100%; border: 1px solid #eee">
  <el-aside width="200px" style="background-color: rgb(238, 241, 246);height:100%">
    <el-menu :default-openeds="['1', '3']">
      <el-submenu index="1" style="margin-top:60px;">
        <template slot="title"><i class="el-icon-message"></i>个人签到信息</template>
        <el-menu-item-group>
          <template slot="title">实时</template>
          <el-menu-item style="background-color:#fff;" index="1-1">正常</el-menu-item>
          <el-menu-item @click="handleCheat" index="1-2">作弊</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      
    </el-menu>
  </el-aside>
  
  <el-container style="height:100%">
    <el-header style="text-align: right; font-size: 12px">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>user</span>
    </el-header>
    
    <el-main style="height:100%">
      <el-table :data="tableData" :key="tableKey" border fit highlight-current-row :max-height=800 height="600">
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
                <span>{{scope.row.type | myTypeFilter}}</span>
            </template>
        </el-table-column>

      </el-table>
    </el-main>
    <el-footer height="60px"></el-footer>
  </el-container>
</el-container>
  </div>
</template>
<script>
// import Stomp from 'stompjs'
// import { MQTT_SERVICE, MQTT_USERNAME, MQTT_PASSWORD } from '../../../config/stompConfig.js'

import SockJS from 'sockjs-client'
import Stomp from 'webstomp-client'

export default {
    name:'show',
    data(){
        return{
            tableKey:0,
            // client: Stomp.client(MQTT_SERVICE)
            received_messages: [],
            send_message: null,
            connected: false,
            tableData: [],
            cheatData:[]
        }
    },
    filters:{
        myTypeFilter(val){
            if(val === 0){
                return '正常'
            }else{
                return '非正常'
            }
        }
    },
    methods:{
       
    connect () {
      this.socket = new SockJS('http://localhost:9092/ygdxd')
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect({}, (frame) => {
        this.connected = true
        console.log(frame)
        this.stompClient.subscribe('/topic/greetings', (tick) => {
            let json = JSON.parse(tick.body)
            if(json.type === 1){
                this.$notify({
                    title: 'warning',
                    message: '该同学在跑步中有可能进行作弊的行为',
                    offset: 100
                });
            } else if(json.type === 2){
                this.cheatData.unshift(json)
                if(this.cheatData.length > 5){
                    this.cheatData.pop()
                }
                this.$notify.error({
                    title: '警告',
                    message: '该同学在跑步中进行作弊的行为',
                    offset: 100
                });
            }
            else if(json.type === 4){
                this.cheatData.unshift(json)
                if(this.cheatData.length > 5){
                    this.cheatData.pop()
                }
                this.$notify.error({
                    title: '警告',
                    message: '该同学未到勤,请联系',
                    offset: 100
                });
            }
          this.tableData.unshift(json)
          if(this.tableData.length > 6){
              this.tableData.pop()
          }
          this.received_messages.push(tick.body)
        })
      }, (error) => {
        console.log(error)
        this.connected = false
      })
    },
    handleCheat(){

    }
    },
    mounted () {
        this.connect()
    }
  
}
</script>
<style type="text/css" rel="stylesheet/scss" lang="scss" scoped>
.el-header {
    background-color: #f3f0f1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
.header{
    width: 100px;
    height: 60px;
}
.el-submenu .el-menu-item{
    background-color:#fff !important;
    &:hover {
      background-color: #ddd !important;
    }
}
.app-container{
    height: 100%;
}
</style>

