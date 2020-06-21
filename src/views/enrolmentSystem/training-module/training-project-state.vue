<template>
  <el-dialog class="t-dialog" title="设置学习项目状态" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">      
    <el-form class="t-form-block" ref="form" :model="form" label-width="120px" size="small">      
        <el-form-item label="学习项目状态" prop="state" >
          <el-select v-model="form.state">
            <el-option v-for="(item,i) of dictionary.PXXMZT" :key="i" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close">返 回</el-button>
      <el-button type="primary" size="small" @click="save">保 存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getDictionaryItems} from '@/server/basic-module';
import { getTrainingProgramsById} from '@/server/training-module';

export default {
  props: ['dataForm', 'visible'],
  data () {
    return {
      form: {},
      /* ------------------[-----------数据字典- 字典码-------------- */ 
      dicJudgeName: {
        PXXMZT: 'PXXMZT', // 学习项目状态
      },
      dictionary: {},
    }
  },
  components: {},
  watch: {
    visible (newVal) {
      if (newVal) {        
        this.id=this.dataForm.id;
        getTrainingProgramsById(this.id).then(result => {
          this.form = Object.assign({}, result);
        })
      }
    }
  },
  activated() {    
    /* ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */ 
    for(let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
          this.$set(this.dictionary, item, result)   
      })
    }
  },
  methods: {    
    close() {
      this.$emit('update:visible', false);
    },
    save () {
      console.log(this.form)
      this.$emit('save', this.form);
      this.close();
    },
  }
}
</script>
<style lang="less" scoped>
/deep/.el-form .el-form-item{
  max-width:50%;
}
</style>
