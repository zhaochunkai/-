<template>
  <el-dialog class="t-dialog" title="知识点信息" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <div style="display:block;margin-bottom:20px;">
      <el-button size="small" @click="close">返 回</el-button>
    </div>
    <el-form class="t-form-block" ref="form" :model="form" label-width="100px" size="small">         
      <el-form-item label="标题" >
        <div class="t-info-div">{{form.title}} </div>
      </el-form-item>
      <!-- <el-form-item label="类型">
        <div class="t-info-div">{{form.title}}</div>
      </el-form-item>
      <el-form-item label="所属课程">
        <div class="t-info-div">{{form.title}}</div>
      </el-form-item>
      <el-form-item label="上级节点">
        <div class="t-info-div">{{form.title}}</div>
      </el-form-item> -->
      <el-form-item label="创建人">
        <div class="t-info-div">{{form.creatorName}} </div>
      </el-form-item>
      <el-form-item label="创建时间">
        <div class="t-info-div">{{new Date(form.creationTime).toLocaleDateString()}}</div>
      </el-form-item>
      <el-form-item label="最后修改人">
        <div class="t-info-div">{{form.lastModifierName}}</div>
      </el-form-item>
      <el-form-item label="更新时间">
        <div class="t-info-div">{{form.lastModificationTime?new Date(form.lastModificationTime).toLocaleDateString(): ''}}</div>
      </el-form-item>
      <el-form-item label="描述">
        <div class="t-info-div t-textarea">{{form.description}} </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { getKnowledgePointById } from '@/server/online-module';
export default {
  props: ['dataForm', 'visible','title'],
  data () {
    return {
      form: {},
      id: '',
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm);
        if (this.dataForm.id) {
          getKnowledgePointById(this.dataForm.id).then(result => {
            this.form=Object.assign({},result)
          })
        }
      }
    },
  },
  activated() {},
  methods: {   
    
    close() {
      this.$emit('update:visible', false);
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
