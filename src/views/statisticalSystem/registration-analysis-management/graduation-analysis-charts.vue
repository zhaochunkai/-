
<template>
<!-- 毕业分析 -->
<el-card class="box-card">
  <div slot="header" class="clearfix">
  <!-- 查询表单 -->
    <el-form :inline="true" :model="queryForm" class="t-operate-filter" size="small">
      <!-- 查询项目 -->
      <el-form-item label="培训项目">
          <el-select v-model="queryForm.tpId" filterable remote reserve-keyword placeholder="请培训项目" :remote-method="_getTrainingProgramsPullDown" :loading="resourceloading">
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      <!-- 查询班级 -->
      <el-form-item label="班级">
        <el-select v-model="queryForm.classId" placeholder="班级">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 查询 -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 饼图 -->
  <ve-pie :data="chartData"></ve-pie>
</el-card>
</template>
<script>
import { getTrainingProgramsPullDown, getClassList, getAnalysisOfGraduation } from '@/server/training-module'
export default {
  data () {
    return {
      queryForm: {
        tpId: '',
        classId: ''
      },
      projectList: [],
      classList: [],
      chartData: {
        columns: ['类型', '人数'],
        rows: []
      },
      resourceloading: false
    }
  },
  activated () {
    this._getTrainingProgramsPullDown()
  },
  watch: {
    'queryForm.tpId' (newVal) {
      this.$set(this.queryForm, 'classId', '')
      if (newVal) {
        this._getClassList()
      }
    }
  },
  methods: {
    onSubmit () {
      getAnalysisOfGraduation(this.queryForm).then(res => {
        console.log(res)
        let rows = [
          { '类型': '合格人数', '人数': res.graduationNum },
          { '类型': '不合格人数', '人数': res.undergraduate }
        ]
        this.$set(this.chartData, 'rows', rows)
      })
    },
    // 查询项目
    _getTrainingProgramsPullDown (e) {
      this.projectList = []
      this.resourceloading = true
      if (e === undefined) {
        e = ''
      }
      getTrainingProgramsPullDown({
        status: '3,4',
        name: e
      }).then(result => {
        this.resourceloading = false
        // 查询状态为3-培训中、4-已结束的项目
        this.projectList = result
      })
    },
    // 根据项目id查找班级
    _getClassList () {
      getClassList({
        tpId: this.queryForm.tpId
      }).then(res => {
        this.classList = []
        this.classList = res.items
      })
    }
  }
}
</script>
<style>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

</style>
