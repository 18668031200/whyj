<template>
<div class="app-container">
    <el-row :gutter="12">
        <el-col :span="12">
            <el-card class="resultList" shadow="hover">
                <div class="studentList">
                    <el-button style="margin-bottom:20px;" type="info" icon="el-icon-loading" disabled>学生</el-button>
                    <el-collapse v-model="activeNames">
                        <el-collapse-item title="规范次数最多" name="1">
                            <el-tooltip v-if="normalStudent" v-for="student in normalStudent" :key="student.studentId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.name | nullStudentChecker}}</el-button><br />
                            </el-tooltip>
                            <el-tooltip v-else  :content="'次数???'" placement="top">
                                <el-button type="text">小明的室友</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        <el-collapse-item title="警告次数最多" name="2">
                            <el-tooltip v-for="student in warningStudent" :key="student.studentId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.name | nullStudentChecker}}</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        <el-collapse-item title="作弊次数最多" name="3">
                            <el-tooltip v-for="student in errorStudent" :key="student.studentId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.name | nullStudentChecker}}</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        <el-collapse-item title="缺勤次数最多" name="4">
                            <el-tooltip v-for="student in absenteeismStudent" :key="student.studentId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.name | nullStudentChecker}}</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        
                    </el-collapse>
                </div>


                </el-card>
        </el-col>
        <el-col :span="12">
        <el-card class="resultList" shadow="hover">
            <div class="collegeList">
                    <el-button style="margin-bottom:20px;" type="info" icon="el-icon-loading" disabled>学院</el-button>
                    <el-collapse v-model="activeCollegeNames">
                        <el-collapse-item title="规范次数最多" name="1">
                            <el-tooltip v-for="student in normalCollege" :key="student.collegeId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.collegeName | nullCollegeChecker}}</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        <el-collapse-item title="警告次数最多" name="2">
                            <el-tooltip v-for="student in warningCollege" :key="student.collegeId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.collegeName | nullCollegeChecker}}</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        <el-collapse-item title="作弊次数最多" name="3">
                            <el-tooltip v-for="student in errorCollege" :key="student.collegeId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.collegeName | nullCollegeChecker}}</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        <el-collapse-item title="缺勤次数最多" name="4">
                            <el-tooltip v-for="student in absenteeismCollege" :key="student.collegeId" :content="'次数'+student.count" placement="top">
                                <el-button type="text">{{student.collegeName | nullCollegeChecker}}</el-button><br />
                            </el-tooltip>
                        </el-collapse-item>
                        
                    </el-collapse>
                </div>
            </el-card>
        </el-col>
    </el-row>
</div>
  
</template>

<script>
import {get} from '@/api/httpClient'


const normalStudent = [
    {
        name:'大雄',
        count: 9,
        collegeName: '外国语'
    },
    {
        name:'胖虎',
        count: 998,
        collegeName: '外国语'
    },
    {
        name:'静香',
        count: 1080,
        collegeName: '外国语'
    }
]

const warningStudent = [
    {
        name:'大雄',
        count: 998,
        collegeName: '外国语'
    },
    {
        name:'胖虎',
        count: 99,
        collegeName: '外国语'
    },
    {
        name:'静香',
        count: 8,
        collegeName: '外国语'
    }
]
const errorStudent = [
    {
        name:'大雄',
        count: 100,
        collegeName: '外国语'
    },
    {
        name:'胖虎',
        count: 99,
        collegeName: '外国语'
    },
    {
        name:'静香',
        count: 0,
        collegeName: '外国语'
    }
]
const absenteeismStudent = [
    {
        name:'大雄',
        count: 1,
        collegeName: '外国语'
    },
    {
        name:'胖虎',
        count: 1,
        collegeName: '外国语'
    },
    {
        name:'静香',
        count: 0,
        collegeName: '外国语'
    }
]

const normalCollege = [
    {
        name:'经管',
        count: 1,
        collegeName: '外国语'
    },
    {
        name:'国贸',
        count: 9,
        collegeName: '外国语'
    },
    {
        name:'外语',
        count: 12,
        collegeName: '外国语'
    }
]
const warningCollege = [{
    name:'经管',
    count: 112,
    collegeName: '经济与管理'
}]
const errorCollege = [{
    name:'电信',
    count: 1,
    collegeName: '电子信息'
}]
const absenteeismCollege = [
    {
        name:'通信',
        count: 2,
        collegeName: '通信'
    }
]
export default {
    
    data(){
        return {
            errorCollege,
            warningCollege,
            errorCollege,
            absenteeismCollege,
            normalCollege,
            baseUrl: '/result/',
            normalStudent,
            warningStudent,
            errorStudent,
            absenteeismStudent,
            activeNames:['1'],
            activeCollegeNames:['1']
        }
    },
    filters:{
        nullStudentChecker(val){
            if(!val){
                return '小明'
            }else {
                return val
            }
        },
        nullCollegeChecker(val){
            if(!val){
                return '计算机'
            }else {
                return val
            }
        }
    },
    created(){
        this.getStudentInfo()
        this.getCollegeInfo()
    },
    methods:{
        getStudentInfo(){
            get(this.baseUrl + 'normalOne').then(response => {
                this.normalStudent = response.data
            })
            get(this.baseUrl + 'warningOne').then(response => {
                this.warningStudent = response.data
            })
            get(this.baseUrl + 'errorOne').then(response => {
                this.errorStudent = response.data
            })
            get(this.baseUrl + 'absenteeismOneCollege').then(response => {
                this.absenteeismStudent = response.data
            })
        },
        getCollegeInfo(){
            get(this.baseUrl + 'normalOneCollege').then(response => {
                this.normalCollege = response.data
            })
            get(this.baseUrl + 'warningOneCollege').then(response => {
                this.warningCollege = response.data
            })
            get(this.baseUrl + 'errorOneCollege').then(response => {
                this.errorCollege = response.data
            })
            get(this.baseUrl + 'absenteeismOneCollege').then(response => {
                this.absenteeismCollege = response.data
            })
        }
    }
  
}
</script>
<style scoped>
.resultList{
    width: 100%;
    margin-top: 50px;
}

</style>

