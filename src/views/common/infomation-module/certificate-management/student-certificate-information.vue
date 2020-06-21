<template>
  <el-drawer title="证书发放信息" v-if="visible" :visible="visible" size="70%" :before-close="close">
    <div class="content">
      <div class="t-operate-buttons">
        <h4>{{viewForm.studentName}}</h4>
        <el-button type="primary" size="small">上一位</el-button>
        <el-button type="primary" size="small">下一位</el-button>
      </div>
      <ul class="list">
        <li>
          <span>姓名</span>
          <span>{{viewForm.studentName}}</span>
          <span>身份证号</span>
          <span>{{viewForm.idCard}}</span>
        </li>
        <li>
          <span>培训项目</span>
          <span>{{viewForm.projectName}}</span>
          <span>学期</span>
          <span>{{viewForm.semesterName}}</span>
        </li>
        <li>
          <span>班级</span>
          <span>{{viewForm.className}}</span>
          <span>毕业年月</span>
          <span>{{new Date(viewForm.grantTime) | formatDate_1}}</span>
        </li>
        <li>
          <span>证书类型</span>
          <span>{{viewForm.certificateType=="Skill"?"技能证书":"毕业证书"}}</span>
          <span>证书编号</span>
          <span>{{viewForm.certificateCode}}</span>
        </li>
        <li>
          <span>证书名称</span>
          <span>{{viewForm.certificateName}}</span>
          <span>是否打印</span>
          <span>{{viewForm.printStatus==0?"未打印":"已打印"}}</span>
        </li>
        <li>
          <span>是否发放证书</span>
          <span>{{viewForm.grantStatus==1?'是':'否'}}</span>
          <span>发证日期</span>
          <span>{{new Date() | formatDate_1}}</span>
        </li>
        <li>
          <span>证书附件</span>
          <span>
            <el-button type="primary" size="small" @click="previewCert()">预览证书</el-button>
          </span>
          <span>备注</span>
          <span></span>
        </li>
      </ul>
    </div>
    <!-- 预览证书 -->
    <el-drawer
      title="证书预览"
      :append-to-body="true"
      :before-close="innerClose"
      :visible.sync="innerDrawer"
      size="60%"
      class="innerCert"
    >
      <div class="inner_content">
        <div
          class="img_left"
          :style="{backgroundImage: 'url(' + (viewForm.backgroundImg) + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
        >
          <div class="leftImg_content">
            <div class="c_top">
              <img :src="viewForm.logoImgUrl" width="80" alt />
              <p style="font-size:22px">{{viewForm.schoolName}}</p>
              <p style="color:#FF0000;font-size:26px;margin-left:20px"></p>
            </div>
            <div class="c_center">
              <div style="width:120px;height:120px;">
                <img :src="viewForm.photo" width="120px" alt />
              </div>
              <div class="center_content">
                学生
                <span>{{viewForm.studentName}}</span>
                性别
                <span>{{viewForm.sex==0?"女":"男"}}</span>，
                <span>{{new Date(viewForm.birthday) | formatDate_1}}</span>生，
                于
                <span>{{new Date(viewForm.startTime) | formatDate_1}} 至 {{new Date(viewForm.endTime) | formatDate_1}}</span>
                在本校学习
                <span>{{viewForm.projectName}}</span>项目，
                课时
                <span>{{viewForm.classHours}}</span>小时
                <span>{{viewForm.minutes}}</span>分钟
                ，修完教学计划规定的全部课程，成绩合格，准予毕业。
              </div>
            </div>
            <div class="c_bot">
              <div class="bot_one"></div>
              <div class="bot_two">
                <span>证件编号：{{viewForm.certificateCode}}</span>
                <span>校名：{{viewForm.schoolName}}</span>
                <span>发证日期：{{new Date(viewForm.grantTime) | formatDate_1}}</span>
              </div>
              <img :src="viewForm.officialSealImgUrl" alt class="botf_img" width="120px" />
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </el-drawer>
</template>
<script>
export default {
  props: ["visible", "viewForm"],
  data() {
    return {
      innerDrawer: false
    };
  },
  watch: {
    visible() {
      if (this.visible) {
      }
    }
  },
  activated() {},
  methods: {
    // ------------------------证书发放信息----------------------
    previewCert() {
      this.innerDrawer = true;
    },
    close() {
      this.$emit("update:visible", false);
    },
    innerClose() {
      this.innerDrawer = false;
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-drawer__header {
  margin: 0;
  border-bottom: 1px solid #e5e5ee;
  span {
    margin: 10px;
  }
}
/deep/.el-drawer__body {
  overflow: scroll;
  .content {
    .t-operate-buttons {
      display: flex;
      align-items: center;
      h4 {
        font-size: 24px;
        margin-right: 40px;
      }
      .el-button {
        width: 72px;
        height: 34px;
        margin: 10px;
      }
    }
    ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      padding-left: 0;
      margin: 0;
      li {
        width: 100%;
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        border: 1px solid #e5e5ee;
        border-top: none;
        border-left: none;
        text-align: center;
        &:nth-child(2n-1) {
          background-color: rgba(238, 238, 238, 0.5);
        }
        span {
          display: block;
          &:nth-child(2n-1) {
            width: 30%;
            font-size: 14px;
            color: #333;
            padding-left: 10px;
            white-space: nowrap;
            border-right: 1px solid #e5e5ee;
            border-left: 1px solid #e5e5ee;
          }
          &:nth-child(2n) {
            width: 70%;
            color: #000;
            font-size: 12px;
            padding-left: 10px;
          }
        }
      }
    }
  }
  .inner_content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;
    .img_left {
      border:1px solid #aaa;
      width: 840px;
      min-width: 840px;
      height: 594px;
      margin: 20px;
      .leftImg_content {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .c_top {
          width: 80%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 80px;
        }
        .c_center {
          margin-top: 60px;
          width: 80%;
          display: flex;
          justify-content: center;
          align-items: center;
          .center_content {
            line-height: 30px;
            margin-left: 40px;
            & > span {
              margin: 10px;
            }
          }
        }
        .c_bot {
          margin-top: 40px;
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 70%;
          .bot_one {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            span {
              margin: 20px;
              text-align: center;
            }
          }
          .bot_two {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            span {
              margin: 10px;
              text-align: center;
            }
          }
          .botf_img {
            position: absolute;
            top: 0;
            right: 0;
          }
        }
      }
      .big {
        width: 100%;
      }
    }
  }
}
</style>