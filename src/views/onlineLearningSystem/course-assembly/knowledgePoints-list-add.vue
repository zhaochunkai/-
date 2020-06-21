<template>
  <el-dialog class="t-dialog" :title="title+'信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="90px" size="small">         
      <!-- <el-form-item label="所属课程">
        <el-input  v-model="form.courseName" :disabled="true"></el-input>
      </el-form-item> -->
      <el-form-item label="上级节点" prop="parentId">
        <el-input  v-model="form.parentName" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="name">
        <el-input  v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input  v-model="form.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
      <el-button type="primary" size="small" @click="saveGoon">保存并继续新增</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {  } from '@/server/basic-module';
export default {
  props: ['dataForm', 'visible','title'],
  data () {
    return {
      form: {},   
      rules: {
        parentId: [{ required: true, trigger: 'blur' }],
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        chapterSectionLevel: [{ required: true, message: '章/节', trigger: 'blur' }],
        courseOrQuestion: [{ required: true, message: '课程/问题', trigger: 'blur' }],
        description: [{ max:200, message: '字符长度不得超出200个', trigger: 'blur' }]
      },
    }
  },
  watch: {
    visible (newVal) {
      console.log(this.dataForm)
      if (newVal) {
        let chapterSectionLevel='';
        if (this.dataForm.btnTitle=='章') {
          chapterSectionLevel='Chapter';
        }else if (this.dataForm.btnTitle=='节') {
          chapterSectionLevel='Section';          
        }
        this.form = Object.assign({}, this.dataForm,{
          courseOrQuestion: 'Course',
          sectionId: this.dataForm.parentId,
          title: this.dataForm.name || this.dataForm.title,
          name: this.dataForm.name || this.dataForm.title,
          chapterSectionLevel:chapterSectionLevel
        })
      }
    },
  },
  activated() {},
  methods: {   
    close() {
      this.$emit('update:visible', false);
    },
    save () {        
      this.form.sectionId=this.form.parentId;
      this.form.title=this.form.name;
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$emit('save', this.form);
        this.close();
      })
    },
    saveGoon() {
      this.form.sectionId=this.form.parentId;
      this.form.title=this.form.name;
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$emit('save', this.form);
      })
    },
  }
}
</script>
<style lang="less" scoped>
.txt{
  background: #eee;
  line-height:1.8;
}
</style>
