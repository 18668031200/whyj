<template>
   <el-row class="panel-group" :gutter="40">
       <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
            <div class="card-panel-text">排行榜</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="messageCount" :duration="2600"></count-to>
            </div>
        </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('messages')">
            <div class="card-panel-icon-wrapper icon-message">
            <svg-icon icon-class="message" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
            <div class="card-panel-text">学生总数</div>
            <count-to class="card-panel-num" :startVal="0" :endVal="studentCount" :duration="3000"></count-to>
            </div>
        </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="collegeCount" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">学院总数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="collegeCount" :duration="3200"></count-to>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
          <svg-icon icon-class="resultCount" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">跑步信息总数</div>
          <count-to class="card-panel-num" :startVal="0" :endVal="resultCount" :duration="3600"></count-to>
        </div>
      </div>
    </el-col>
   </el-row>
</template>
<script>
import CountTo from 'vue-count-to'
import {getCount} from '@/api/httpClient'

import {get} from '@/api/httpClient'

export default {
    components: {
        CountTo
    },
    data(){
        return{
            studentCount:0,
            messageCount:3,
            collegeCount:0,
            resultCount:0,
            resultCountUrl:'/result/',
            studentCountUrl:'/student/',
            collegeCountUrl:'/college/',
            status:1
        }
    },
    created(){
        getCount(this.studentCountUrl + 'count' ,this.status).then(response => {
          console.log(response)
          this.studentCount = response.data
        })
        getCount(this.collegeCountUrl + 'count' ,this.status).then(response => {
          console.log(response)
          this.collegeCount = response.data
        })
        getCount(this.resultCountUrl + 'count' ,this.status).then(response => {
          console.log(response)
          this.resultCount = response.data
        })
    },
    methods: {
        handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
        }
    }
  
}
</script>
<style type="text/css"  lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
