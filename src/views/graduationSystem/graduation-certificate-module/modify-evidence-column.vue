<template>
  <el-dialog
    class="t-dialog"
    v-if="visible"
    title="技能证书管理"
    :visible="visible"
    :close-on-click-modal="true"
    @close="close"
    width="400px"
  >
    <div class="content">
      <el-form class="t-form-block" ref="form">
        <el-form-item label="名称" :rules="{ required: true }">
          <el-input v-model="materialName" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="sendMsg">确认修改</el-button>
        <el-button type="primary" size="small" @click="close">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { UpdateCertificate } from "@/server/basic-module";
export default {
  props: ["visible", "modifyIds", "modifyNames"],
  data() {
    return {
      // ---------------修改的内容----------------
      materialName: ""
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.materialName = this.modifyNames[0];
      }
    }
  },
  activated() {},
  methods: {
    _UpdateCertificate() {
      let data = {
        Id: this.modifyIds[0],
        CertificateName: this.materialName,
        CertificateType: 1
      };
      UpdateCertificate(data)
        .then(res => {
          this.materialName = "";
          this.$emit("update:visible", false);
          this.$message("修改成功");
        })
        .catch(err => {
          this.$message.error(err);
        });
    },
    sendMsg() {
      if (this.materialName == "") {
        this.$message("请输入要修改的证书名称");
        return;
      }
      this._UpdateCertificate();
    },
    close() {
      this.$emit("update:visible", false);
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
    .t-form-block {
      .el-form-item {
        display: flex;
        align-items: center;
        width: 100%;
      }
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