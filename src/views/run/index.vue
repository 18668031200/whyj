<template>
  <div class="app-container">
      <div class="progress-circle">
          <el-progress type="circle" :percentage="progressKeyCount" stroke-width=20 status="success"></el-progress>
      </div>
      <div class="count-container" style="margin-top:20px">
          <count-to ref="example" class="example" :start-val="_startVal" :end-val="_endVal" :duration="_duration" :decimals="_decimals"
      :separator="_separator" :prefix="_prefix" :suffix="_suffix" :autoplay="false"></count-to>
      </div>

    <div class="date-picker">
      <el-tag type="success" style="margin-right:20px">开始时间</el-tag>
      <el-date-picker
      style="margin-right:40px"
      v-model="begin"
      type="datetime"
      placeholder="选择日期时间"
      align="right"
      :picker-options="pickerOptions1">
    </el-date-picker>

    <el-tag type="success" style="margin-right:20px">结束时间</el-tag>
    <el-date-picker
      v-model="end"
      type="datetime"
      placeholder="选择日期时间"
      align="right"
      :picker-options="pickerOptions1">
    </el-date-picker>

    </div>

    <div >
        <el-button ref="startBtn" style="margin-top:20px;" @click="handleStart">{{$t('table.start')}}</el-button>
        <el-button ref="pauseBtn" style="margin-top:20px;" @click="pauseResume">{{$t('table.pause')}}</el-button>
    </div>

    <div>
      <el-button style="margin-top:20px;" v-waves icon="el-icon-setting" @click="handleDevice">{{$t('run.device')}}</el-button>
      <el-button style="margin-top:20px;" v-waves icon="el-icon-printer" @click="handleCollege">{{$t('run.college')}}</el-button>
    </div>
    <!-- 弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <dnd-list :list1="list1" :list2="list2" :list1Title="title1" :list2Title="title2"></dnd-list>
      <el-button type="info" style="margin-top:20px;" @click="handleConfirm" v-waves icon="el-icon-check">{{$t('table.confirm')}}</el-button>
    </el-dialog>


  </div>
</template>
<script>
import countTo from 'vue-count-to'
import waves from '@/directive/waves' // 水波纹指令
import DndList from '@/components/DndList'
import {fetchListWithUrl,getWithoutData,postReqWithUrlParams} from '@/api/httpClient'


export default {
    name: 'run',
    components: { countTo,DndList },
    directives: {
      waves
    },
  data(){
      return{
        timer:undefined,
        deviceUrl:'/device/',
        collegeUrl:'/college/',
        dialogStatus:0,
          list1:[{id:'a', name:'a -> a'},{id:'b', name:'b -> a'},{id:'c', name:'c -> a'}],
          list2:[{id:'a', name:'a -> a'},{id:'b', name:'b -> a'},{id:'c', name:'c -> a'},{id:'d', name:'d -> a'}],

          title1:'h',
          title2:'ALREADY',

          textMap:['配置设备','增加学院'],
          dialogFormVisible: false,
          // 定时器
          hasInterval:false,
          setStartVal:0,
          setEndVal:100,
          setDuration:60000,
          setDecimals: 0,
          progressKey:0,
          pickerOptions1: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        begin:'',
        end:''

      }
  },
  computed: {
    _startVal() {
      if (this.setStartVal) {
        return this.setStartVal
      } else {
        return 0
      }
    },
    _endVal() {
      if (this.setEndVal) {
        return this.setEndVal
      } else {
        return 0
      }
    },
    _duration() {
      if (this.setDuration) {
        return this.setDuration
      } else {
        return 100
      }
    },
    _decimals() {
      if (this.setDecimals) {
        if (this.setDecimals < 0 || this.setDecimals > 20) {
          alert('digits argument must be between 0 and 20')
          return 0
        }
        return this.setDecimals
      } else {
        return 0
      }
    },
    _separator() {
      return this.setSeparator
    },
    _suffix() {
      return this.setSuffix
    },
    _prefix() {
      return this.setPrefix
    },
    progressKeyCount(){
      // if(!this.$refs.example.displayValue()){
      //   return this.progressKey
      // }else{
      //   return 0
      // }
      return this.progressKey
    }
  },
  created(){
    this.getDevice()
  },
  methods:{
      handleStart(){
        this.$refs.startBtn.disabled = true
        if(!this.begin){
          this.$notify({
                title: '警告',
                message: '起始时间为空',
                type: 'warning',
                duration: 2000,
                showClose:false
              })
            return 
        }
          if(this.begin > this.end){
            this.$notify({
                title: '错误',
                message: '结束时间别起始时间早',
                type: 'error',
                duration: 2000,
                showClose:false
              })
              return
          }
          this.$refs.example.start()
          this.progressKey = this.$refs.example.displayValue
          if(!this.hasInterval){
            this.hasInterval = true
            this.timer = setInterval(() => {
              this.progressKey = this.$refs.example.displayValue
            }, 1000)
          }
          postReqWithUrlParams('/plan/' + 'start', undefined).then(response => {
            this.$notify({
                title: 'success',
                message: '跑步日程开始',
                type: 'success',
                duration: 2000,
                showClose:false
              })
          })

          this.$refs.startBtn.disabled = true

      },
      pauseResume() {
        this.$refs.pauseBtn.disabled = true
        this.$refs.example.pauseResume()
        this.progressKey = this.$refs.example.displayValue
      },
      handleDevice(){
        this.getDevice()
        this.title1 = '已配置设备'
        this.title2 = '未配置设备'
        this.dialogStatus = 0
        this.dialogFormVisible = true
      },
      handleCollege(){
        this.getCollege()
        this.title1 = '已存在学院'
        this.title2 = '未存在学院'
        this.dialogStatus = 1
        this.dialogFormVisible = true
      },
      handleConfirm(){
        if(this.title1 === '已存在学院'){
          var total = this.list1.reduce((a, b) => a + b.id + ',', '');
          var ids = total.substring(0, total.length - 1)
          // var ids = Array.from(new Set(total))
          var params = {'ids':ids}
          postReqWithUrlParams(this.collegeUrl + 'patch', params).then(response => {
            this.$notify({
                title: 'success',
                message: '更新成功',
                type: 'success',
                duration: 2000,
                showClose:false
              })
            this.dialogFormVisible = false
            this.getCollege()
          })


        } else{
          var total = this.list1.reduce((a, b) => a + b.id + ',', '');
          var ids = total.substring(0, total.length - 1)
          // var ids = Array.from(new Set(total))
          var params = {'ids':ids}
          postReqWithUrlParams(this.deviceUrl + 'patch', params).then(response => {
            this.$notify({
                title: 'success',
                message: '更新成功',
                type: 'success',
                duration: 2000,
                showClose:false
              })
            this.dialogFormVisible = false
            this.getCollege()
          })
        }
      },
      getDevice(){
        getWithoutData(this.deviceUrl + 'names').then(response => {
          console.log(response)
          this.list2 = response.data
        })
        getWithoutData(this.deviceUrl + 'planNames').then(response => {
          console.log(response)
          this.list1 = response.data
        })
      },
      getCollege(){
        getWithoutData(this.collegeUrl + 'names').then(response => {
          console.log(response)
          this.list2 = response.data
        })
        getWithoutData(this.collegeUrl + 'planNames').then(response => {
          console.log(response)
          this.list1 = response.data
        })
      }
  },
  destroyed:function(){
    clearInterval(this.timer)
  }
}
</script>
<style type="text/css"  lang="scss" scoped>
  .progress-circle{
    margin-top: 120px;
  }
  .date-picker{
      margin-top: 60px;
  }
</style>
