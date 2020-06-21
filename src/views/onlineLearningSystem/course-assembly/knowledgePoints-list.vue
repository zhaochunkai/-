<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 课程知识点树 -->
        <org-tree :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>                                
      </el-card>
    </el-col>
    <el-col :span="19" v-show="nodeLevel">
      <!-- 章/节/知识点列表 -->
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeLevel!='根' && this.nodeId!='-1'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>{{btnTitle}}列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
          <el-form-item label="标题">
            <el-input class="input-append" v-model="conditionForm.Title"></el-input>	
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="queryList">查询</el-button>
          </el-form-item>
        </el-form>                               
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
            <el-button type="primary" size="mini" @click="addItem()" v-show="nodeId!='-1' && nodeLevel!='知识点'  && showAdd">新增{{btnTitle}}</el-button>
            <!-- <el-button type="primary" size="mini" @click="delItem()" v-show="nodeId!='-1'">删除</el-button> -->
        </div>
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="title" sortable label="标题">
            <template slot-scope="scope">
              <el-button v-show="btnTitle=='知识点'" type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.title}}</el-button>
              <span v-show="btnTitle!='知识点'">{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" ></el-table-column>
          <el-table-column prop="creatorName" label="创建人"></el-table-column>
          <el-table-column prop="creationTime" label="创建时间">
            <template slot-scope="scope">
              {{new Date(scope.row.creationTime).toLocaleDateString()}}
            </template>
          </el-table-column>
          <el-table-column prop="order" label="排序序号" width="110">
            <template slot-scope="scope">
              <el-input v-model="scope.row.order" size="mini" placeholder="请输入序号" min="0" max="100" type="number" @change="serOrder(scope.row.id,scope.row.order)"></el-input>
            </template>
          </el-table-column>
          <el-table-column  fixed="right" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addItem(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="delItem(scope.row)">删除</el-button>
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
  <!-- 新增/编辑 -->
  <add-edit :dataForm="addEditForm" :title="btnTitle" :visible.sync="addEditVisible" @save="saveData"></add-edit>
  <!-- 知识点 -->
  <knowlodge-info :dataForm="knowlodgeInfoForm" :visible.sync="knowlodgeInfoVisible"></knowlodge-info>
</div>
</template>
<script>
import {
  getCourseTree,getChapterTree,getSectionTree,getKnowledgeTree
} from '@/server/basic-module';
import { 
  getResourceList,getChapterSectionList,getKnowledgePoint,
  createChapterSection,updateChapterSection,deleteChapterSection,
  createKnowledgePoint,updateKnowledgePoint,deleteKnowledgePoint,
  updateChapterSectionOrder,updateKnowledgePointOrder
} from '@/server/online-module';
import orgTree from "@/components/orgTree.vue"
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from "./knowledgePoints-list-add" 
import knowlodgeInfo from "./knowledgePoints-list-info" 
export default {
  data() {return {
      pageSize,
      SkipCount:0,
      style: '',
      total:0,
      resourceTree: [],
      conditionForm: {},
      tableData: [],
      btnTitle: '',
      isSelectAll:false,
      addEditVisible:false,
      addEditForm: {},
      knowlodgeInfoVisible:false,
      knowlodgeInfoForm: {},
      nodeSelect: {},
      nodeId: '',
      nodeName: '',
      nodeLevel: '',
      courseName: '',
      showAdd:true,
      courseOrQuestion: 'Course',
      orderNum:null,
  }},
  components: {orgTree,pagination,addEdit,knowlodgeInfo},
  activated() {
    this._getCourseTree();
		this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
  },
  methods: {
    showupdResourceReason(row) { // 查看未缴费原因
      this.refuseEditVisible=true;
      this.addEditForm=row;
      this.addEditForm.registrationProjectId=this.nodeId;
    },
    toInfomationPage(row) { // 跳转至课程知识点信息模块
      let programId=this.nodeId;
      this.knowlodgeInfoVisible=true;
      this.knowlodgeInfoForm.id=row.id;
    },
    _getCourseTree() {  // 获取课程树
      this.resourceTree= []
      getCourseTree().then(result => {
        this.resourceTree=result;
      })
    },
    _getChapterTree(node) {  // 获取 章列表 树
      let data={
        courseOrQuestion: this.courseOrQuestion,
        courseId:node.id
      }
      getChapterTree(data).then(result => {
        node.children=result
      })
    },
    _getSectionTree(node) {  // 获取 节列表 树
      let data={
        courseOrQuestion: this.courseOrQuestion,
        chapterId:node.id
      }
      getSectionTree(data).then(result => {
        node.children=result
      })
    },
    _getKnowledgeTree(node) {  // 获取 知识点列表 树
      let data={
        courseOrQuestion: this.courseOrQuestion,
        sectionId:node.id
      }
      getKnowledgeTree(data).then(result => {
        node.children=result
      })
    },
    /* 接收改变后每页多少条*/
    handleSize (SkipCount, pageSize) {
      this.SkipCount=SkipCount;
      this.pageSize=pageSize;
      this.queryList(SkipCount, pageSize);
    },
    /*接收当前页数*/
    handleCurrent (SkipCount, pageSize) {
      this.SkipCount=SkipCount;
      this.pageSize=pageSize;
      this.queryList(SkipCount, pageSize);
    },
    queryList() {         
      if (this.nodeLevel == '课程' || this.nodeLevel.indexOf('章')!=-1) {
        this._getChapterSectionList(this.SkipCount, this.pageSize)        
      }else if (this.nodeLevel.indexOf('节')!=-1) {
        this._getKnowledgePoint(this.SkipCount, this.pageSize);
      }
    },
    // 查询章/节列表
    _getChapterSectionList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount, 
        MaxResultCount: pageSize,
        Title: this.conditionForm.Title,
        ParentId: this.nodeId,
        ChapterSectionLevel: this.nodeLevel == '课程'?'Chapter': 'Section',
        CourseOrQuestion: this.courseOrQuestion,
      }
      getChapterSectionList(data).then(result => {
        this.tableData=result.items;
        this.total=result.totalCount;
      })
    },
    // 查询知识点列表
    _getKnowledgePoint(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount, 
        MaxResultCount: pageSize,
        Title: this.conditionForm.Title,
        sectionId: this.nodeId,
        CourseOrQuestion: this.courseOrQuestion,
      }
      getKnowledgePoint(data).then(result => {
        this.tableData=result.items;
        this.total=result.totalCount;
      })
    },
    /*选择的组织机构*/
    haddleOrganizationNode(node) {
      this.nodeSelect=node;
      this.nodeId=node.id;
      this.nodeName=node.label;        
      this.nodeLevel=node.level;  
      this.showAdd=true;
      
      if (this.nodeLevel == '课程') {
        this.btnTitle="章";
        this.courseName=this.nodeName;
        this._getChapterTree(node);  // 获取课程下的章列表树
        this._getChapterSectionList()
      }else if (this.nodeLevel.indexOf('章')!=-1) {
        this.btnTitle="节";
        this._getSectionTree(node);  // 获取章下的节列表树
        this._getChapterSectionList()
      }else if (this.nodeLevel.indexOf('节')!=-1) {
        this.btnTitle="知识点";
        this._getKnowledgeTree(node);  // 获取节下的知识点列表树
        this._getKnowledgePoint();
      }else if (this.nodeLevel.indexOf('知识点')!=-1) {
        delete(node.children)
        this.knowlodgeInfoVisible=true;
        this.knowlodgeInfoForm.id=node.id;
        this.showAdd=false;
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
    addItem(row) {
      this.addEditVisible=true;
      this.addEditForm=Object.assign(row||{},{
        nodeLevel: this.nodeLevel,
        courseName: this.courseName,
        parentId: this.nodeId,
        parentName: this.nodeName,
        btnTitle: this.btnTitle,
      })
    },
    serOrder(id,order) {
      if (Number(order)<0 || Number(order)>100) {
        this.$message.warning('请输入0~100以内的整数');
        return;
      }
      let data={id,order:Number(order)};
      if (this.btnTitle=='知识点') {
        updateKnowledgePointOrder(data).then(() => {
          this.$message.success('完成知识点排序设置');
          this._getKnowledgePoint();
          this.haddleOrganizationNode(this.nodeSelect)
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      } else {
        updateChapterSectionOrder(data).then(() => {
          this.$message.success('完成章节排序设置');
          this.haddleOrganizationNode(this.nodeSelect)
          this._getChapterSectionList();
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    saveData(row) { // 
      if (row.id) {  
        if (this.btnTitle!='知识点') { // 调用保存章/节的接口
          updateChapterSection(row).then(result => {
            this.$message.success(this.btnTitle+'修改成功！');
            this.haddleOrganizationNode(this.nodeSelect)
            this.queryList();
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else { // 调用创建知识点接口
          updateKnowledgePoint(row).then(reult=> {
            this.$message.success(this.btnTitle+'新增成功！');
            this.haddleOrganizationNode(this.nodeSelect)
            this.queryList();
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      } else {
        if (this.btnTitle!='知识点') { // 调用保存章/节的接口
          createChapterSection(row).then(result => {
            this.$message.success(this.btnTitle+'新增成功');
            this.haddleOrganizationNode(this.nodeSelect)
            this.queryList();
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else { // 调用创建知识点接口
          createKnowledgePoint(row).then(reult=> {              
            this.$message.success(this.btnTitle+'新增成功');
            this.haddleOrganizationNode(this.nodeSelect)
            this.queryList();
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }

      }
    },
    delItem(row) {
      this.$confirm(`此操作将删除选中的 【${this.btnTitle+'： '+row.title || row.name}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {                
        if (this.btnTitle!='知识点') { // 调用保存章/节的接口
          deleteChapterSection(row).then(result => {
            this.$message.success(this.btnTitle+'删除成功');
            this.haddleOrganizationNode(this.nodeSelect);
            this.SkipCount=0;
            this.$refs.pagination.currentPage=1
            this.queryList();
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        } else { // 调用创建知识点接口
          deleteKnowledgePoint(row).then(reult=> {              
            this.$message.success(this.btnTitle+'删除成功');
            this.haddleOrganizationNode(this.nodeSelect);
            this.SkipCount=0;
            this.$refs.pagination.currentPage=1
            this.queryList();
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          })
        }
      }).catch(() => {})
    },
  },
}
</script>
<style lang="less" scoped>
.specialCol{
  background:#a5f373;
  /deep/.el-button{
    span{
      color:#00f;
    }
  }
}
</style>