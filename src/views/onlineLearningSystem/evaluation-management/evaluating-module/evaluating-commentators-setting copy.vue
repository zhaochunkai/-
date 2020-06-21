<template>
<el-dialog class="t-dialog" :title="title" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" append-to-body @close="close"> 
  <div slot="footer" class="dialog-footer">
    <el-button size="small" @click="close">返 回</el-button>
    <el-button type="primary" size="small" @click="save">确 定</el-button>
  </div>
  <!-- dataForm.isBeCommentator  false-评价者     true-被评者
    dataForm.evaluationType        评价者       ,  被评价者
    StudentEvaluationTeacher 学生评老师：多个班级， 1个老师
    TeacherMutualEvaluation  老师评老师：多个老师， 1个老师
    TeacherEvaluationStudent 老师评学生：1个班级 ， 多个老师
  -->
  <!-- 数据列表：班级|老师 -->
  <el-table class="t-table-list"  ref="multipleTable" stripe size="small" v-if="!showTreeTransfer" :data="commentatorData" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"> </el-table-column>
    <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
    <el-table-column prop="name" sortable label="姓名"></el-table-column>
  </el-table>
  <tree-transfer v-else TreeType="user" :alias="alias" :chooseValue="chooseValue" isMultiple="true" @saveTransfer="getNewTransfer"></tree-transfer>
</el-dialog>
</template>
<script>
import {
  getEvaluationNotPlanTeacherOrganizeInfo,
  getEvaluationNotPlanTeacherListByCourseId,
  getEvaluationNotPlanStudentOrganizeInfo,
  getEvaluationNotPlanStudentListByClassId
} from '@/server/online-module'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import treeTransfer from '@/components/tree-transfer'
export default {
  components: {treeTransfer, pagination},
  props: ['dataForm', 'visible'],
  data () {
    return {
      commentatorData: [],
      title: '',
      // 选择机构的所有老师
      alias: {key: 'id', label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      chooseValue: [],
      showTreeTransfer: false,
      /* ------------------------左侧树--------------------------- */
      TreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      nodeSelected: {},
      /* ------------------------未分配--------------------------- */
      isSelectAll: false,
      tableData: [],
      multipleSelection: [],
      pageSizes,
      pageSize,
      SkipCount: 0,
      total: 0
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.tableData = []
        this.showTreeTransfer = false
        this.isSelectAll = false
        this.multipleSelection = []
        if (this.dataForm.evaluationType === 'StudentEvaluationTeacher') {
          // 学生评老师 评价者默认为所选择的班级
          if (this.dataForm.isBeCommentator) {
            // 被评价者-老师： 根据项目id（this.dataForm.programeId）+班级id（this.dataForm.classId）查看授课的教师列表 ，单选
            this.title = '选取被评价的老师'
            this._getEvaluationNotPlanTeacherOrganizeInfo()
          }
        } else if (this.dataForm.evaluationType === 'TeacherEvaluationStudent') {
          // 老师评学生 被考评者默认为所选的班级；评价者默认为所选择的班级
          if (!this.dataForm.isBeCommentator) {
            // 评价者-老师： 根据项目id（this.dataForm.programeId）+班级id（this.dataForm.classId）查看授课的教师列表 ，多选
            this.title = '选取参与评价的老师'
            this._getEvaluationNotPlanTeacherOrganizeInfo()
          }
        } else {
          // 教师互评
          if (this.dataForm.isBeCommentator) {
            // 被评价者-老师： 根据项目id（this.dataForm.programeId）查看授课的教师列表 ，单选
            this.title = '选取被评价的老师'
            this._getEvaluationNotPlanTeacherOrganizeInfo()
          } else {
            // 评价者：机构的所有老师
            this.title = '选取参与评价的老师'
            this.showTreeTransfer = true
          }
        }
      }
    }
  },
  methods: {
    /* ********************************************** 查询 ********************************************** */
    /* ---------------------------------- 获取课程列表 ---------------------------------- */
    _getEvaluationNotPlanTeacherOrganizeInfo () {
      this.commentatorData = []
      getEvaluationNotPlanTeacherOrganizeInfo(this.dataForm.programeId).then(result => {
        result.forEach(item => {
          this._getEvaluationNotPlanTeacherListByCourseId(item.id)
        })
      })
      console.log(this.commentatorData, '所得税的方式的')
    },
    /* ---------------------------------- 获取教师列表 ---------------------------------- */
    _getEvaluationNotPlanTeacherListByCourseId (courseId) {
      getEvaluationNotPlanTeacherListByCourseId(this.dataForm.programeId, courseId).then(res => {
        // this.tableData = res // {id,name}
        this.commentatorData.concat(res)
      })
    },
    /* ---------------------------------- 获取班级列表 ---------------------------------- */
    _getEvaluationNotPlanStudentOrganizeInfo () {
      this.TreeData = []
      getEvaluationNotPlanStudentOrganizeInfo(this.dataForm.programeId).then(result => {
        this.TreeData = result
      })
    },
    /* ---------------------------------- 获取学生列表 ---------------------------------- */
    _getEvaluationNotPlanStudentListByClassId () {
      getEvaluationNotPlanStudentListByClassId(this.nodeSelected.id).then(res => {
        this.tableData = res // {id,name}
      })
    },
    /* ---------------------------------- 右侧人员列表 ---------------------------------- */
    // 全选
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // 全选
    selectAll () {
      this.$refs.multipleTable.toggleAllSelection()
    },
    // 多选
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.isSelectAll = this.tableData.length === this.multipleSelection.length // 判断是否是全选
    },
    // 接收改变后每页多少条
    handleSize (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataListAll(SkipCount, pageSize)
    },
    // 接收当前页数
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount = SkipCount
      this.pageSize = pageSize
      this.initDataListAll(SkipCount, pageSize)
    },
    queryList () {
      this.initDataListAll(this.SkipCount, this.pageSize)
    },
    initDataListAll (SkipCount = 0, pageSize = this.pageSize) { // 初始化：根据获取指标列表
      // let data = {
      //   SkipCount: SkipCount,
      //   MaxResultCount: pageSize
      // }
      // getEvaluationIndicator(data).then(result => {
      //   this.tableData=result.items;
      //   this.total=result.totalCount;
      // })
    },
    /* ********************************************** 操作 ********************************************** */
    getNewTransfer (data) {
      this.chooseValue = data
    },
    handleNodeClick (data) {
      this.nodeSelected = data
      if (this.dataForm.personType === 'Teacher') {
        this._getEvaluationNotPlanTeacherListByCourseId() // 根据课程获取教师列表
      } else {
        this._getEvaluationNotPlanStudentListByClassId() // 根据班级获取学员列表
      }
    },
    // 评价计划保存
    save () {
      this.$emit('getProfessional', this.multipleSelection, this.dataForm)
      this.close()
    },
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
