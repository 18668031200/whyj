<template>
  <div class="app-container">
    <split-pane v-on:resize="resize" split="vertical">
      <template slot="paneL">
        <div class="left-container">
          <el-form :rules="rules" style="width: 80%;margin: 10% auto" ref="userForm" label-width="80px" label-position="left"  :model="temp">

            <el-form-item  :label="$t('student.name')" prop="name">
              <el-input class="filter-item" v-model="temp.name" style="width: 48%;" :placeholder="$t('student.name')"></el-input>
            </el-form-item>
            <el-form-item :label="$t('student.gender')" prop="gender">
              <el-select class="filter-item" v-model="temp.gender" placeholder="Please select">
                <el-option v-for="item in  genderTypeOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('student.type')" prop="type">
              <el-select class="filter-item" v-model="temp.type" placeholder="Please select">
                <el-option v-for="item in  typeOptions" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item  :label="$t('student.studentNo')" prop="studentNo">
              <el-input class="filter-item" v-model="temp.studentNo" style="width: 48%;" :placeholder="$t('student.studentNo')"></el-input>
            </el-form-item>

            <el-upload
              ref="oneUpload"
              class="student-upload"
              action="http://localhost:9092/upload/student"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onSuccess"
              :file-list="fileList"
              list-type="picture">
              <el-tag class="student-upload-tag" type="success">头像上传</el-tag>
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
            </el-upload>
            
            <el-form-item  :label="$t('student.phone')" prop="phone">
              <el-input type="number" class="filter-item" v-model="temp.phone" style="width: 48%;" :placeholder="$t('student.phone')"></el-input>
            </el-form-item>

            <el-form-item :label="$t('student.address')">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 2}" placeholder="Please input address" v-model="temp.address" style="width: 200px">
              </el-input>
            </el-form-item>

            <div class="student-footer">
              <el-button class="footer-reset" @click="resetData">{{$t('student.reset')}}</el-button>
              <el-button  style="width:100px" type="primary" @click="createData">{{$t('student.confirm')}}</el-button>
            </div>

          </el-form>
        </div>
      </template>
      <template slot="paneR">
        <div class="right-container">
          <el-upload
            class="student-uploads"
            drag
            action="http://localhost:9092/upload/batch"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过5Mb</div>
          </el-upload>
        </div>
      </template>
    </split-pane>
    
  </div>
</template>
<script type="text/javascript">
import {postReqWithUrl} from '@/api/httpClient'
import splitPane from 'vue-splitpane'


const genderTypeOptions = [
  {key:0, name: '待定'},
  {key:1, name: '男'},
  {key:2, name: '女'}
]

const typeOptions = [
  {key:0, name: '大专'},
  {key:1, name: '本科'},
  {key:2, name: '硕士'},
  {key:3, name: '博士'}
]
  export default {
    name:'studentCreate',
    components: { splitPane },
    data(){
      return {
        baseUrl:'/student',
        fileList:[],
        genderTypeOptions,
        typeOptions,
        temp: {
          id:undefined,
          name:undefined,
          gender:0,
          type:0,
          studentNo:undefined,
          personId:undefined,
          status:0,
          classId:undefined,
          address:undefined,
          phone:undefined,
          level:0,
          imgList:[],
          imgListStr:''
        },
        rules:{
          name: [{ required: true, message: 'name is required', trigger: 'blur' },{ min: 2, max: 25, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
          createDate: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
          studentNo:[{ required: true, message: 'name is required', trigger: 'blur' }]
        }
      }
    },
    methods: {
      resize(){
      },
      handleRemove(file, fileList) {
        const index = this.temp.imgList.indexOf(file.response)
        this.temp.imgList.splice(index, 1)
        console.log(this.temp.imgList)
      },
      handlePreview(file) {
        console.log(
          
        );
      },
      onSuccess(response, file, fileList){
        this.temp.imgList.push(response)
        console.log(this.temp.imgList)
        console.log(file)
        console.log(fileList)
      },
      createData(){
        this.$refs['userForm'].validate((valid) => {
          if(valid){
            this.temp.imgListStr = this.temp.imgList.join()
            postReqWithUrl(this.baseUrl, this.temp).then(() => {
              this.$refs['userForm'].resetFields()
              this.$refs['oneUpload'].clearFiles()
              this.temp.imgList = [],
              this.temp.imgListStr = '',
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000,
                showClose:false
              })
            })
          }
      })
    },
    resetData(){
      this.$refs['oneUpload'].clearFiles()
      this.$refs['userForm'].resetFields()
    }
    }
  }
</script>

<style type="text/css" lang="scss" scoped>
  .app-container {
    position: relative;
    height: 100vh;
  }
  .left-container {
    background-color: #f3fefe;
    height: 100%;
  }
  .student-upload{
    width: 80%;
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .student-upload-tag{
    position: relative;
    margin-right: 200px;
  }
  .footer-reset{
    width: 100px;
    margin-right: 100px;
  }
  .student-footer{
    margin-top: 50px;
  }
  .student-uploads{
    margin-top: 100px;
  }
</style>