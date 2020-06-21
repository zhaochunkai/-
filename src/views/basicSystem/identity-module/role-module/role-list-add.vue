<template>
<el-dialog class="t-dialog" :title="form.id?'编辑角色信息': '新增角色信息'" v-if="visible" :visible="visible" :close-on-click-modal="false" width="60%" @close="close">      
<!-- <el-drawer title="角色管理" :visible.sync="visible" direction="rtl" size="84%" :before-close="handleClose"> --> 
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="角色信息" name="info">
      <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-bottom:20px">
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="primary" size="small" @click="saveInfo">保 存</el-button>
        <el-button type="primary" size="small" @click="saveInfoGoon" v-show="!this.form.id">保存并继续新增</el-button>
      </div>        
    </el-tab-pane>
    <el-tab-pane label="批量添加用户" name="auth" v-if="id?true:false">
      <div style="margin-bottom:20px;">
        <el-button size="small" @click="close">返 回</el-button>
        <el-button type="primary" size="small" @click="saveAuth">保 存</el-button>
      </div>				
      <el-row :gutter="10">
        <el-col :span="6">      
          <!-- 树 -->
          <org-tree :dataList="TreeData" @selectNode="haddleOrganizationNode"></org-tree>   
        </el-col>
        <el-col :span="18">
          <el-transfer  filterable :filter-method="filterMethod" filter-placeholder="请输入名称检索" v-model="value" :data="transferData" :props="alias" :titles="['未分配', '已分配']"></el-transfer>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>    
<!-- </el-drawer> -->
</el-dialog>
</template>
<script>
import orgTree from "@/components/orgTree.vue"
import treeTransfer from '@/components/tree-transfer'
import { getUserListByAttach,getProfilePermission,getIdentityUsersToRole} from '@/server/identity-module'
import { getSchoolTree,getEnterpriseTree} from '@/server/basic-module';
export default {
  name: 'roleListAdd',
  props: ['dataForm', 'visible'],
  data () {
    return {
      filterlabel: '',
      item: {},
      form: {},
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
      activeName: 'info',
      // -------
      nodeId: '',
      nodeLevel: '',
      nodeName: '',
      // ---------
      userType: 'Faculty', // 用于判断用户类型是企业还是学校。默认学校用户
			title: '',
      alias: {key: 'id',label: 'name'}, // 穿梭框默认选中列表，由alias.key组成的数组
      TreeData: [],
      transferData: [],
      value: [],
      filterMethod(query, item) {
        if (item.title) {
          item.name=item.title
        }
        return item.name.indexOf(query) > -1;
      },
      // -------
      id: '',
    }
  },
  components: {orgTree,treeTransfer},
  activated() {},
  watch: {
    visible (newVal) {
      if (newVal) {
        this.form = Object.assign({}, this.dataForm);
        this.id=this.dataForm.id;
        this._getTeachTreeData();
        if (this.id) {
          this._getIdentityUsersToRole()
        }
      }
    }
  },
  methods: {   
    /* ------------------------------------------------------用户->-----右侧数据列表--初始化-------------------------- */
    _getIdentityUsersToRole() {
      this.value= []
      getIdentityUsersToRole(this.id).then(result => {
        let arr=result.items;
        arr.forEach(item => {
          this.value.push(item.id)
        })
        
      })
    },
    usersDataList() { // ----------------获取用户列表，传递数据给穿梭框
      this.transferData= []
      let data={
        id: this.nodeId,
        type: this.userType
      }
      getUserListByAttach(data).then(result => {
        this.transferData=result;
      })
    },  
    _getTeachTreeData() {  // ----------------用户树（学校+企业）
      this.TreeData= []  
      getSchoolTree().then(result => {
        this.TreeData.push(result); 
      })  
    },
    handleClick(tab, event) { // tab切换
      // console.log(tab, event);
    },
    handleClose(done) {
      this.$emit('changeVisibility', false);      
    },
    close() {
      this.$emit('changeVisibility', false);      
    },
    /* --------------------保存角色信息-------------------- */
    saveInfo() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$emit('save', this.form);        
        if (this.form.id) {
          this.activeName='auth';
        } else {
          this.close();
        }
      })
    },
    saveInfoGoon() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$emit('save', this.form);
      })
      this.form={};
    },
    /* --------------------保存角色权限-------------------- */
		saveAuth() {
      this.$refs.form.validate((valid) => {
      if (!valid) return;
        this.$emit('saveAuth',this.form.id,this.value)
      })
    },
    haddleOrganizationNode(node) { /*选择的树节点。根据树的不同，加载不同的数据*/
      this.nodeId=node.id;
      this.nodeName=node.label;        
      this.nodeLevel=node.level; 
      if (this.nodeLevel=='企业') {   
        this.userType='EnterpriseUser';
      }
      if (node.level!=null) {
        this.usersDataList();
      }
    }, 
  }
}
</script>
<style lang="less" scoped>
.t-header-content{
  /deep/.el-form .el-form-item{
    max-width:100%;
  }
}

</style>