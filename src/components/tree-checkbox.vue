<template>
<div>
  <el-input placeholder="输入名称进行过滤" v-model="filterText" size="mini" style="margin-bottom:10px;"></el-input>
  <el-tag style="color:#f00" type="danger" v-if="!isMultiple">注意：只能选择一条数据！</el-tag>
  <el-tree accordion check-strictly show-checkbox class="filter-tree" ref="OrganizationTree" node-key="id" :data="treeData" :props="props" :expand-on-click-node="false" default-expand-all check-on-click-node :highlight-current="true" :filter-node-method="filterNode" @check="checkChange"></el-tree>
  <!-- <el-button @click="getCheckedNodes">获取节点</el-button>
  <el-button @click="setCheckedNodes">清除选择</el-button> -->
</div>
</template>
<script>
import { getSchoolTree,getEnterpriseTree } from '@/server/basic-module'

export default {
  data() {
    return {
      props: {
        children: 'children',
        label: 'label'          
      },
      filterText: '',
      treeData: [],
      checkedId: '',
    };
  },
  /* treeType-树类型：
    用户树: Faculty-机构树,EnterpriseUser-企业树,
    
  
  */
  // props：currentNodeKeysAll-当前节点的id集合,checkBoxLevel-指定的节点level名称,isMultiple-是否可多选,
  props: ['treeType','currentNodeKeysAll','checkBoxLevel','isMultiple'],
  watch: {
    filterText(val) {
      this.$refs.OrganizationTree.filter(val);
    },
    treeType(newVal) {
      if (newVal) {
        if (newVal=='Faculty') {
          this._getSchoolTree();
        }else if (newVal=='EnterpriseUser') {
          this._getEnterpriseTree();
        }
      }
    },
  },
  computed: {
    reconstructed() {
      this.treeData=this.clearChecked(this.treeData);
    }
  },
  mounted() {
    if (this.treeType=='Faculty') {
      this._getSchoolTree();
    }else if (this.treeType=='EnterpriseUser') {
      this._getEnterpriseTree();
    }
  },
  methods: { 
    /* --------------------------------- 查询 --------------------------------- */    
    // 获取学校信息树
    _getSchoolTree() {
      this.treeData= []
      getSchoolTree().then(result => {
        this.treeData.push(result);
        this.treeData=this.clearChecked(this.treeData,{})
      })
    },
    // 获取企业信息树
    _getEnterpriseTree() {
      this.treeData= []
      getEnterpriseTree().then(result => {
        this.treeData.push(result);
      })
    },
    /* --------------------------------- 操作 --------------------------------- */ 
    setCheckedNodes() { // 清除所有选择的节点
      this.$refs.OrganizationTree.setCheckedNodes([])
    },
    getCheckedNodes() {
      // console.log(this.$refs.OrganizationTree.getCheckedNodes()); // 获取勾选的完整节点集合
      // console.log(this.$refs.OrganizationTree.getCheckedKeys());  // 获取勾选的节点id集合
    },
    checkChange(node) { // 监听节点点击事件
      if (!this.isMultiple) {
        this.setCheckedNodes();
        this.$refs.OrganizationTree.setCheckedNodes([node])
      }
      this.$emit('transmitCheckedList',this.$refs.OrganizationTree.getCheckedNodes()) // 将选中的数据传递给父组件
    },
    checkNode() { // 设置节点集合被选中
      this.$refs.OrganizationTree.setCheckedKeys(this.currentNodeKeysAll); 
    },
  
    clearChecked(data) {  // 批量处理树节点的可用状态： disabled
      if (Array.isArray(data) && data.length>0) {
        data.forEach(item => {
          if (!item.level || item.level.indexOf(this.checkBoxLevel)==-1) {
            this.$set(item,'disabled',true);
          }
          if (item.children) {
            this.clearChecked(item.children);
          }
        })
      }
      return data;
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  }
};
</script>
<style lang="less" scoped>
/deep/.el-tree-node__content{
  font-size:14px;
}
</style>