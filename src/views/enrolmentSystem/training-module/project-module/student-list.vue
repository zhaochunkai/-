<template>
<div>
  <!-- 表格 -->
  <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark"  @row-click="toInfomationPage">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="name" label="姓名" sortable>
      <template slot-scope="scope">
        <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
    </template>
    </el-table-column>
    <el-table-column prop="age" label="年龄" sortable></el-table-column>
    <el-table-column prop="sex" label="性别"> </el-table-column>
    <el-table-column prop="education" label="学历"> </el-table-column>
    <el-table-column prop="idCard" label="身份证号"> </el-table-column>
    <el-table-column prop="tel" label="联系电话"> </el-table-column>
  </el-table>		
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>
  <!-- 学生档案 -->
  <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
</div>
</template>
<script>
import { getInstitutionList,createInstitution,updateInstitution,deleteInstitutionById,getInstitutionById,
    updateCampus,updateInstitutionStatus,getInstitutionListByCampusId
} from '@/server/basic-module'
import {getTrainingProgramsBindStudent} from '@/server/training-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import studentProfile from "@/views/common/infomation-module/student-profile.vue"
export default {
  name: 'ProjectStudentList',
  props: ['projectId','program'],
  components: {pagination,studentProfile},
  data() {return {
    pageSizes,
    pageSize,
    total:0,
    tableData: [],
    programId: '',
    profileVisible:false      
  }},
  activated() {
    this.programId=this.$route.query.id;
    if (this.programId) {
      this.initDataList();
    }
  },
  methods: {
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize);
    },
    /*接收当前页数*/
    handleCurrent (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize);
    }, 
    /*改变每页多少条*/
    handleSizeChange (val) {
      this.pageSize = val;
    },
    /*当前页数*/
    handleCurrentChange (val) {
      this.currentPage = val;
    },  
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount, 
        MaxResultCount: pageSize,
        id: this.programId,
        // PayStatus: this.conditionForm.PayStatus,
      }
      getTrainingProgramsBindStudent(data).then(result => {
        this.tableData=result.items;
        this.total=result.totalCount;
      })
    },
    toInfomationPage(row) {
      this.addEditForm = {
        studentId: row.id,
        name: row.name,
        programId: this.programId
      }
      this.profileVisible = true
    },      
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item{
  max-width:80%;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner{
  border:none;
  background: #eee;
}
</style>