<template>
  <div class="content" id="printDiploma">
    <div
      class="img_left"
      :style="{backgroundImage: 'url(' + (data.backgroundImg) + ')', backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat'}"
    >
      <div class="leftImg_content">
        <div class="c_top">
          <!-- <img :src="imageUrl_2" width="80px" alt /> -->
          <p style="font-size:26px;letter-spacing:6px">普通高等学校</p>
          <p style="font-size:48px;margin-top:-20px;color:red;letter-spacing:12px">毕业证书</p>
        </div>
        <div class="c_center">
          <div style="width:120px;height:120px;">
            <img :src="data.photo" width="120px" alt />
          </div>
          <div class="center_content">
            学生
            <span>{{data.studentName}}</span>
            性别
            <span>{{data.sex==0?"女":"男"}}</span>，
            <span>{{new Date(data.birthday) | formatDate_1}}</span>日生，
            于
            <span>{{new Date(data.startTime) | formatDate_1}} 至 {{new Date(data.endTime) | formatDate_1}}</span>
            在本校学习
            <span>{{data.projectName}}</span>项目，修完教学计划规定的全部课程，成绩合格，准予毕业。
          </div>
        </div>
        <div class="c_bot">
          <div class="bot_one"></div>
          <div class="bot_two">
            <span>证件编号：{{data.certificateCode}}</span>
            <span>校名：{{data.schoolName}}</span>
            <span>发证日期：{{new Date(data.grantTime) | formatDate_1}}</span>
          </div>
          <img :src="data.officialSealImgUrl" alt class="botf_img" width="120px" />
        </div>
      </div>
    </div>
    <el-tooltip class="item" effect="dark" content="建议横向打印" placement="right">
      <el-button
        v-show="isShow"
        type="primary"
        v-print="'#printDiploma'"
        @click="printDiploma(data.certificatesGrantId)"
        style="width:120px;letter-spacing:10px;"
      >打印</el-button>
    </el-tooltip>
  </div>
</template>
<script>
import {
  GetInstitutionsBasicInfo,
  GetCertificatePageList,
  SetBackgroundImg,
  DeleteCertificate,
  UpdateCertificatesGrantStatus
} from "@/server/basic-module";
export default {
  props: ["visible", "data"],
  data() {
    return {
      isShow: true,
      imageUrl_1: null, //学校logo
      imageUrl_2: null, //公章
      id: "",
      digitalMark: 0
    };
  },
  watch: {},
  mounted() {},
  activated() {
    this._GetInstitutionsBasicInfo();
  },
  methods: {
    _UpdateCertificatesGrantStatus(id) {
      UpdateCertificatesGrantStatus(id).then(res => {});
    },
    printDiploma(id) {
      this._UpdateCertificatesGrantStatus(id);
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 1000);
    },
    // 选择证书模板
    _SetBackgroundImg(id, img) {
      let data = {
        id: id,
        backgroundImg: img
      };
      SetBackgroundImg(data);
    },
    //证书模板保存
    handleUploadFileToCos() {
      this._SetBackgroundImg(this.id, this.imgUrlBig);
      this.digitalMark = 0;
    },
    // 获取机构logo
    _GetInstitutionsBasicInfo() {
      GetInstitutionsBasicInfo().then(res => {
        this.imageUrl_1 = res.logoImgUrl;
        this.imageUrl_2 = res.officialSealImgUrl;
      });
    },
    changeImg(el) {
      this.imgUrlBig = el.target.src;
      this.digitalMark = el.target.alt;
    },
    close() {
      this.digitalMark = 0;
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style lang="less" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  .img_left {
    width: 990px;
    min-width: 990px;
    height: 700px;
    .leftImg_content {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .c_top {
        width: 80%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 60px;
      }
      .c_center {
        margin-top: 40px;
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
          right: 34px;
        }
      }
    }
    .big {
      width: 100%;
    }
  }
}
</style>