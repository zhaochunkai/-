<template>
  <el-drawer
    title="学生档案"
    v-if="visible"
    :visible="visible"
    :direction="direction"
    size="80%"
    @close="close"
  >
    <div slot="header" class="t-box-card-header">
      <span>学生信息</span>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本信息" name="basicInfo">
        <basic-info :basicForm="student" :dictionary="dictionary"></basic-info>
      </el-tab-pane>
      <el-tab-pane label="缴费信息" name="payment">
        <payment-info ref="paymentInfo" :dataForm="dataForm" :basicForm="basicForm"></payment-info>
      </el-tab-pane>
      <el-tab-pane label="考勤信息" name="attendance">
        <attendance-page
          ref="attendance"
          :studentName="dataForm.name"
          :studentId="studentId"
          :trainingProgramId="programId"
          :courseList="courseList"
        ></attendance-page>
      </el-tab-pane>
      <el-tab-pane label="学习进度" name="learningProgress">
        <learning-progress
          :dataForm="dataForm"
          :studentId="studentId"
          :trainingProgramId="programId"
          :courseList="courseList"
          :classList="classList"
        ></learning-progress>
      </el-tab-pane>
      <el-tab-pane label="成绩信息" name="achievement">
        <achievement-info :performanceInformation="performanceInformation"></achievement-info>
      </el-tab-pane>
      <el-tab-pane label="毕业信息" name="graduation">毕业信息</el-tab-pane>
      <el-tab-pane label="学习报告" name="learningReport">
        <learning-report :dataForm="dataForm" :ClassId="nodeId"></learning-report>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>
<script>
import { getDictionaryItems } from "@/server/basic-module";
import {
  getStudentBasicInfoById,
  getTrainingProgramsBindCourse,
  getClassList
} from "@/server/training-module";
import basicInfo from "./basic-info/basic-info.vue";
import paymentInfo from "./payment-info/payment-info.vue";
import attendancePage from "./attendance-info/attendance-page";
import learningReport from "./learning-report/learning-report.vue";
import learningProgress from "./learning-progress/learning-progress.vue";
import achievementInfo from "./achievement-info/achievement-info.vue";
export default {
  props: ["visible", "dataForm", "nodeId"],
  components: {
    basicInfo,
    paymentInfo,
    attendancePage,
    learningReport,
    learningProgress,
    achievementInfo
  },
  data() {
    return {
      style: "",
      direction: "rtl",
      activeName: "basicInfo",
      id: "",
      basicForm: {},
      program: {},
      student: {},
      programId: "",
      studentId: "",
      courseList: [],
      classList: [],
      /* ------------------[-----------数据字典- 字典码-------------- */

      dicJudgeName: {
        SEX: "SEX", // 性别
        Education: "Education", // 学历
        PXXMZT: "PXXMZT", // 学习项目状态
        PXXMLX: "PXXMLX" // 学习项目类型
      },
      dictionary: {},
      performanceInformation: {}
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        /*  ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */

        for (let item in this.dicJudgeName) {
          getDictionaryItems(this.dicJudgeName[item]).then(result => {
            this.$set(this.dictionary, item, result);
          });
        }
        this.activeName = "basicInfo";
        this.studentId = this.dataForm.studentId;
        this.programId = this.dataForm.programId;
        this.$set(
          this.performanceInformation,
          "TrainingProgramId",
          this.dataForm.programId
        );
        if (this.dataForm.studentId && this.dataForm.programId) {
          this._getStudentBasicInfoById();
          this._getTrainingProgramsBindCourse();
          this._getClassList();
        }
      }
    },
    nodeId: {
      handler(newVal) {
        if (newVal) {
          this.$set(this.performanceInformation, "ClassId", this.nodeId);
        }
      },
      immediate: true,
      deep: true
    },
    activeName(newVal) {
      if (newVal === "basicInfo") {
        this._getStudentBasicInfoById();
      } else if (newVal === "payment") {
        this.$refs.paymentInfo.recordList();
        this.$refs.paymentInfo._getPayInfo();
      } else if (newVal === "attendance") {
        this.$refs.attendance._getAttendanceStatisticByStudentId();
        this.$refs.attendance._getAttendanceItemByStudentId();
      }
      // else if (newVal === 'learningReport') {
      // }
    }
  },
  activated() {},
  methods: {
    /* ------------------------------------------- 查询 ----------------------------------- */
    // 根据项目id查询课程
    _getTrainingProgramsBindCourse() {
      getTrainingProgramsBindCourse(this.programId).then(result => {
        this.courseList = result;
      });
    },
    // 根据项目id查询班级
    _getClassList() {
      let data = {
        tpId: this.programId,
        studentId: this.studentId
      };
      getClassList(data).then(result => {
        this.classList = result.items;
      });
    },
    // 根据学生id获取学生信息
    _getStudentBasicInfoById() {
      let data = {
        id: this.dataForm.studentId,
        trainingProgramsId: this.dataForm.programId
      };
      getStudentBasicInfoById(data)
        .then(result => {
          this.student = Object.assign({}, result);
          this.$set(this.performanceInformation, "Tel", this.student.tel);
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: err.message,
            type: "error"
          });
        });
    },
    /* ------------------------------------------- 操作 ----------------------------------- */
    handleClick(tab, event) {},
    close() {
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style lang = "less" scoped>
.t-header-title span {
  text-align: center !important;
}
/deep/.el-drawer__body {
  overflow: scroll;
}
</style>
