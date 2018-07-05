<template>
  <div class="app-container">
    <split-pane v-on:resize="resize" split="vertical">
      <template slot="paneL">
          <div class="left-container">
              <el-collapse v-model="activeName" @change="handleChange" accordion>

                  <el-collapse-item v-if="!devices">
                    <template slot="title">
                      <span>暂无设备 或 网络异常</span><i class="header-icon el-icon-info"></i>
                    </template>
                </el-collapse-item>
                <el-collapse-item v-for="device in devices" :key="device.id" v-else>
                    <template slot="title" >
                    <span @click="choseItem(device)">{{device.channelName}}</span>
                    </template>
                    <el-alert
                        :title="device.name"
                        type="success"
                        :description="device.ip + device.port"
                        show-icon>
                    </el-alert>
                </el-collapse-item>

              </el-collapse>
          </div>
      </template>
      <template slot="paneR">
          <div class="right-container">
            <d-player :options="options"
                            @play="play"
                            ref="player">
                    </d-player>
          </div>
      </template>
    </split-pane>
  </div>
</template>
<script>
import {fetchListWithUrl,getWithoutData,postReqWithUrlParams} from '@/api/httpClient'
import splitPane from 'vue-splitpane'
export default {
    components:{
        splitPane
    },
    data(){
        return {
            activeName:'1',
            deviceUrl:'/device/',
            devices:null,
            options: {
                video: {
                    url: 'http://static.smartisanos.cn/common/video/t1-ui.mp4',
                    pic: 'http://static.smartisanos.cn/pr/img/video/video_03_cc87ce5bdb.jpg'
                },
                autoplay: false,
                contextmenu: [
                    {
                        text: 'GitHub',
                        link: 'https://github.com/MoePlayer/vue-dplayer'
                    }
                ]
            },
            player: null
            }
        
    },
    created(){
        this.getDevice()
    },
    mounted() {
      this.player = this.$refs.player.dp
    },
    methods:{
        play() {
            console.log('play callback')
        },
        resize(){
        },
        getDevice(){
            getWithoutData(this.deviceUrl + 'names').then(response => {
                console.log(response)
                this.devices = response.data
            })
        },
        choseItem(device){
            console.log(device)
            if(device.address){
                this.player.switchVideo({
                    url: 'http://localhost:9092' + device.address
                })
            }
        },
        handleChange(val){
        }
    }
  
}
</script>
</script>
<style rel="stylesheet/scss" lang="scss" scoped>

.app-container {
    position: relative;
    height: 100vh;
  }
.left-container {
    background-color: #f3fefe;
    height: 100%;
  }

</style>
