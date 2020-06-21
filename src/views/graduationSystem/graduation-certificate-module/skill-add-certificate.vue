<template>
  <el-dialog
    class="t-dialog"
    v-if="visible"
    title="证书基本信息"
    :visible="visible"
    :close-on-click-modal="true"
    width="500px"
    @close="close"
  >
    <div class="content">
      <div class="int">
        <p style="width:80px">证书名称</p>
        <el-input v-model="input" placeholder="请输入" @keyup.enter.native="sendMsg"></el-input>
        <p style="color:red;width:20px;text-align:center">*</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sendMsg">保存</el-button>
        <el-button type="primary" size="small" @click="close">返回</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { CreateCertificate } from "@/server/basic-module";
export default {
  props: ["visible"],
  data() {
    return {
      input: "",
      changeList: []
    };
  },
  watch: {
    visible(newVal) {
      this.tableData = [];
      if (newVal) {
        this.tableData.push(this.dataForm);
      }
    }
  },
  activated() {},
  methods: {
    sendMsg() {
      if (this.input == "") {
        this.$message("请输入证书名称");
        return;
      }
      setTimeout(() => {
        this._CreateCertificate(this.input, 1);
      }, 100);
    },
    close() {
      this.input = "";
      this.$emit("update:visible", false);
    },
    // 添加
    _CreateCertificate(CertificateName, CertificateType) {
      let data = {
        CertificateName: CertificateName,
        CertificateType: CertificateType
      };
      CreateCertificate(data)
        .then(res => {
          this.input = "";
          this.$message.success("添加成功");
          this.$emit("update:visible", false);
        })
        .catch(err => {
          this.$message.error(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-dialog__body {
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .int {
      display: flex;
      width: 100%;
    }
    .btn {
      margin-top: 20px;
      .el-button {
        margin: 10px;
      }
    }
  }
}
</style>