<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 学习项目树 -->
        <org-tree ref="orgTree" :currentNodeAll="nodeSelect" :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>                                
      </el-card>
    </el-col>
    <el-col :span="19" >
      <!-- 报名信息列表 -->
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>报名人员列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
            <el-form-item label="姓名/手机号/身份证号">
                <el-input class="input-append" v-model="conditionForm.IdCardOrTelOrName"></el-input>	
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="conditionForm.Status">
                <el-option label="全部" value="All"></el-option>
                <el-option label="待审核" value="ToAudit"></el-option>
                <el-option label="未通过" value="NotPass"></el-option>
                <el-option label="已通过" value="Pass"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="来源">
              <el-select v-model="conditionForm.Source">
                <el-option label="全部" value="All"></el-option>
                <el-option label="线上（公众号）" value="Online"></el-option>
                <el-option label="线下" value="Offline"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="缴费">
              <el-select v-model="conditionForm.PayStatus">
                <el-option label="全部" value="All"></el-option>
                <el-option label="已结清" value="Paid"></el-option>
                <el-option label="未缴费" value="NotPay"></el-option>
                <el-option label="未结清" value="Uncleared"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
            </el-form-item>
        </el-form>                              
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <!-- <el-button type="primary" size="mini">导入</el-button> -->
          <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
          <!-- <el-button type="primary" size="mini" @click="del()">删除</el-button> -->
          <!-- <el-button type="primary" size="mini" @click="del()">导出</el-button> -->
          <!-- <el-button type="primary" size="mini" @click="importFile">导入</el-button> -->
          <!-- <el-button type="primary" size="mini" @click="del()">下载模板</el-button> -->
        </div>
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="name" sortable label="姓名">
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="sex" label="性别">
          </el-table-column>
          <el-table-column prop="birthday" label="出生日期">
            <template slot-scope="scope">
              {{new Date(scope.row.birthday).toLocaleDateString()}}
            </template>
          </el-table-column>
          <el-table-column prop="idCard" label="身份证号" width="150"></el-table-column>
          <el-table-column prop="tel" label="联系电话"></el-table-column>
          <el-table-column prop="education" label="学历"></el-table-column>
          <el-table-column prop="source" label="来源"></el-table-column>
          <el-table-column prop="bindWeChat" label="绑定微信" width="80">
            <template slot-scope="scope">
              {{scope.row.bindWeChat?'是': '否'}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="60"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addEdit(scope.row)">修改</el-button>
              <el-button type="text" size="small" v-if="scope.row.status=='待审核'" @click="del(scope.row)">删除</el-button>
              <el-button style="color:#f00;" type="text" size="small" v-if="scope.row.bindWeChat" @click="UnBindWechat(scope.row)">微信解绑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 全选 -->
        <div class="t-batch-operate">
            <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
        </div>			
        <!-- 分页组件 -->
        <div class="t-operate-footer">
          <pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 弹出层：新增/编辑报名信息 -->
  <add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave" @updateList="queryList"></add-edit>
  <!-- 文件导入 -->
  <import-file :programId="nodeId" :visible.sync="importVisible"></import-file>
  <!-- 学生档案 -->
  <student-profile :dataForm="addEditForm" :visible.sync="profileVisible"></student-profile>
</div>
</template>
<script>
import { getTrainingProgramsTree, } from '@/server/basic-module';
import { 
  getStudentInfoListByProgramId,updateStudentInfo,createStudentEntry,getStudentInfoListBy,
  deleteStudentInfo,unBindWechat
} from '@/server/training-module';
import orgTree from "@/components/orgTree.vue"
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from "./registration-list-add.vue" 
import importFile from "./registration-list-import.vue" 
import studentProfile from "@/views/common/infomation-module/student-profile.vue"
export default {
  data() {return {
    pageSizes,
    pageSize,
		SkipCount:0,
    style: '',
    currentPage:0,
    total:0,
    resourceTree: [],
    conditionForm: {
      Status: 'ToAudit' // 待审核
    },
    tableData: [],
    isSelectAll:false,
    addEditVisible:false,
    addEditForm: {},
    importVisible:false,
    nodeId: '',
    nodeName: '',
    nodeSelect: {},
    profileVisible:false
  }},
  components: {orgTree,pagination,addEdit,importFile,studentProfile},
  activated() {
		this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
    this._getTrainingProgramsTree();
    this.foucsOnNode();
  },
  methods: {
    toInfomationPage(row) {
      this.addEditForm = {
        studentId: row.id,
        name: row.name,
        programId: this.nodeId
      }
      this.profileVisible = true
    },
    _getTrainingProgramsTree() {
      this.resourceTree= []
      getTrainingProgramsTree().then(result => {
        this.resourceTree.push(result);
      }).then(() => {   
        if (this.nodeId && this.nodeSelect.level!='根') {
          this.initDataList()
        }        
      })
    },
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
			this.SkipCount=SkipCount;
			this.pageSize=pageSize;
      this.initDataList(SkipCount, pageSize);
    },
    /*接收当前页数*/
    handleCurrent (SkipCount, pageSize) {
			this.SkipCount=SkipCount;
			this.pageSize=pageSize;
      this.initDataList(SkipCount, pageSize);
    },
    queryList() {      
      this.initDataList(this.SkipCount, this.pageSize);
    },    
    // 根据项目id获取报名列表
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount, 
        MaxResultCount: pageSize,
        Source: this.conditionForm.Source,
        Status: this.conditionForm.Status,
        IdCardOrTelOrName: this.conditionForm.IdCardOrTelOrName,
        // PayStatus: this.conditionForm.PayStatus,
      }
      getStudentInfoListByProgramId(this.nodeId,data).then(result => {
        this.tableData=result.items;
        this.total=result.totalCount;
      })
    },
    /*选择的组织机构*/
    haddleOrganizationNode(node) {
      this.nodeSelect=node;
      this.nodeId=node.id;
      this.nodeName=node.label;
      if (this.nodeSelect.level!='根') {
        this.initDataList()
      }
    },
    // 全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        })
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    selectAll() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
        // 判断是否是全选
      this.isSelectAll = this.tableData.length === this.multipleSelection.length;
    },
    /* ---------------------------------------------操作----------------------------------------------- */
		foucsOnNode() {
			setTimeout(() => {
        if (this.nodeSelect && JSON.stringify(this.nodeSelect)!='{}') {
          this.$refs.orgTree.checkNode();
        }
			},500)
		},
    importFile() {
      this.importVisible=true;
    },
    addEdit(row) {
      this.addEditForm = row || {};
      this.addEditVisible = true;
      this.addEditForm.nodeId=this.nodeId;
      this.addEditForm.nodeName=this.nodeName;
      this.addEditForm.registrationProject=this.nodeId;
    },
    addEditSave (data) {
      if (data.id) {
        updateStudentInfo(data).then(result => {
          this.$message.success('保存成功')
          this.queryList();
          this.foucsOnNode();
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        createStudentEntry(data).then(result => {
          this.$message.success('保存成功')
          this.queryList();
          this.foucsOnNode();
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    del(data) {
      let row= data || this.multipleSelection[0];
      this.$confirm(`此操作将删除选中数据 【${row.name}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {             
        let obj={
          id:row.id,
          trainingProgramsId: this.nodeId
        };   
        deleteStudentInfo(obj).then(() => {
          this.$message.success('数据删除成功！')
          this._getTrainingProgramsTree();
          this.initDataList();
          this.$refs.pagination.currentPage=1
          this.foucsOnNode();
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })          
      }).catch(() => {})
    },
    UnBindWechat(row) {  // 微信解绑      
      this.$confirm(`此操作将解除学生 【${row.name}】的微信绑定， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { 
        unBindWechat(row.id).then(() => {
          this.$message.success('微信解绑成功！')
          this._getTrainingProgramsTree();
          this.foucsOnNode();
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })          
      }).catch(() => {})
    },  
  },
}
</script>
<style lang="less" scoped>

</style>