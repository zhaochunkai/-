<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <div slot="header" class="t-box-card-header">
          <span>课程组装-知识点列表</span>
        </div>
        <div style="margin-bottom:20px;display:block;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small" @click="preview">预览该课程</el-button>
        </div>
        <el-tree :data="TreeData" node-key="id" default-expand-all :expand-on-click-node="false" @node-click="handleNodeClick" :render-content="renderContent"></el-tree>
      </el-card>
    </el-col>
    <el-col :span="19" >
      <el-card v-show="JSON.stringify(nodeSelect) != '{}' && nodeSelect.level!='课程'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>资源绑定</span> 
        </div>
        <div class="t-header-title">
          <span>所选节点：{{nodeLabel}}</span>
        </div>
        <div>
          <el-button type="success" size="small" @click="chooseResource(nodeSelect)">选取资源</el-button>
          <el-button type="primary" size="small" @click="save">保存</el-button>
        </div> 
        <el-table class="t-table-list"  ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="title" sortable label="选取资源" show-overflow-tooltip>              
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="fileInfo(scope.row)">{{scope.row.title}}</el-button>      
            </template>
          </el-table-column>
          <el-table-column prop="type" label="资源类型"  width="100"></el-table-column>
          <el-table-column prop="standard" label="资源标准"  width="100"></el-table-column>
          <el-table-column prop="type" label="要求学习时长" align="center" width="340">
            <template slot-scope="scope"> 
              <div style="display:flex;">
                <div class="input-div">
                <el-input v-model="scope.row.hh" type="number" min="0" max="59" size="mini">
                  <el-button size="mini" slot="append">时</el-button>
                </el-input>
                </div>
                <div class="input-div">
                <el-input v-model="scope.row.mm" type="number" min="0" max="59" placeholder="数值范围：0~59" size="mini">
                  <el-button size="mini" slot="append">分</el-button>
                </el-input>
                </div>
                <div class="input-div">
                <el-input v-model="scope.row.ss" type="number" min="0" max="59" placeholder="数值范围：0~59" size="mini">
                  <el-button size="mini" slot="append">秒</el-button>
                </el-input>
                </div>
              </div>             
            </template>
          </el-table-column>
          <el-table-column  fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="unBind(scope.row)">解绑资源</el-button>
              <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">从列表中移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-button type="success" size="small" @click="chooseResource(nodeSelect)">选取资源</el-button>
          <el-button type="primary" size="small" @click="save">保存</el-button>
        </div> 
        <!-- 选取资源 -->
        <choose-resource :dataForm="addEditForm" :visible.sync="addEditVisible" @getData="getTableData"></choose-resource>
        <!-- 资源预览 -->
        <files-info ref="fileInformation" :dataForm="fileFrom" :visible.sync="fileVisible"></files-info>
      </el-card>
    </el-col>
  </el-row>
  <!--  课程预览 -->
  <knowledge-infomation :visible.sync="infomationVisible" :courseId="courseId" :title="title"></knowledge-infomation>
</div>
</template>
<script>
import { 
  getResourceMetadata,
  KnowledgePointBind,KnowledgePointUnbind,getKnowledgePointResources,
  ChapterSectionBind,ChapterSectionUnBind,getChapterSectionResources
} from '@/server/online-module';
import {
  getCourseTree,getChapterTree,getSectionTree,getKnowledgeTree
} from '@/server/basic-module';
import knowledgeInfomation from './course-knowledge-infomation'
import chooseResource from './course-assembly-bind-chooseResource'
import filesInfo from '../repository-management/repository-infomation/resource-files-info'
export default {
  props: ['dataForm', 'visible'],
  components: {chooseResource,filesInfo,knowledgeInfomation},
  data () {
    return {
      style: '',
      TreeData: [],
      form: {},
      courseOrQuestion: 'Course',
      nodeSelect: {},
      nodeLevel: '',
      nodeLabel: '',
      nodeId:null,
      parentNode:null,
      // -------选取资源---
      addEditForm: {},
      addEditVisible:false,
      // -------资源预览---
      fileFrom: {},
      fileVisible:false,
      // ------资源绑定
      tableData: [],
      // -------课程预览----
      courseId: '-1',
      infomationVisible:false,
      title: '课程预览',
    }
  },
  activated() {
		this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
    this.courseId=this.$route.query.courseId;// 课程id
    if (this.courseId) {
      this._getCourseTree();
    }
  },
  methods: {       
    renderContent(h, { node, data, store }) {  // 非根/课程节点，都可进行资源绑定。<span v-show={data.level!='根' && data.level!='课程' && data.id!="-1"}>    ;;;知识点-
      // console.log(node)
      return (
        <span class="custom-tree-node">
          <span v-show={data.level.split(',').length>1 && data.level.split(',')[1]=='True'} class="iconfont icon-charulianjie" style="
            font-size:1rem;
            margin-right:0.3rem;
            color:#0a0;"></span>
          <span v-show={data.level.split(',').length>1 && data.level.split(',')[1]=='False'} class="iconfont icon-quxiaolianjie" style="
            font-size:1rem;
            margin-right:0.3rem;
            color:#bbb;"></span>
          <el-button style="color:#666" type="text" title={node.label} on-click={()=>this.getNode(node)}>{node.label}</el-button>
        </span>
      );
    },  
    // -----------------------------------------查询----------------------------------- 
    _getCourseTree() {  // 获取课程树
      this.TreeData= []
      getCourseTree().then(result => {
        let obj=result.find(item => {
          return item.id==this.courseId;
        })
        this.TreeData.push(obj);
        this._getChapterTree(obj);
      })
    },
    _getChapterTree(node) {  // 获取 章列表 树
      let data={
        courseOrQuestion: this.courseOrQuestion,
        courseId:node.id
      }
      getChapterTree(data).then(result => {
        // result.forEach(item => {  // 自动加载子节点
        //   this._getSectionTree(item);
        // })
        node.children=result;        
      })
    },
    _getSectionTree(node) {  // 获取 节列表 树
      let data={
        courseOrQuestion: this.courseOrQuestion,
        chapterId:node.id
      }
      getSectionTree(data).then(result => {
        result.forEach(item => {  // 自动加载子节点
          this._getKnowledgeTree(item);
        })
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
    _getChapterSectionResources() {  // 获取 章|节 下绑定的资源
      this.tableData= []
      let data={
        SkipCount: 0, 
        MaxResultCount: 100,
      }
      getChapterSectionResources(this.nodeId).then(result => { 
        if (!result) return;
        result.items.forEach(item => {
          let obj={
            resourceId:item.id,
            trustedFileName:item.trustedFileName,
            title:item.title,
            standard:item.standard,
            type:item.type,
            hh:item.requiredLearningTime.split(': ')[0],
            mm:item.requiredLearningTime.split(': ')[1],
            ss:item.requiredLearningTime.split(': ')[2],
          }
          this.tableData.push(obj)
        })
      })
    },
    _getKnowledgePointResources() {  // 获取知识点下绑定的资源
      this.tableData=[]
      getKnowledgePointResources(this.nodeId).then(result => { 
        if (!result) return;
        result.items.forEach(item => {
          let obj={
            resourceId:item.id,
            trustedFileName:item.trustedFileName,
            title:item.title,
            standard:item.standard,
            type:item.type,
            hh:item.requiredLearningTime.split(': ')[0],
            mm:item.requiredLearningTime.split(': ')[1],
            ss:item.requiredLearningTime.split(': ')[2],
          }
          this.tableData.push(obj)
        })
      })
    },
    // ------------------------------------------------- 操作 ---------------------------------------------
    handleNodeClick(node) { 
      this.nodeSelect=node ;
      this.nodeId=node.id;
      this.nodeLevel=node.level;
      this.nodeLabel=node.label;
      if (node.level == '课程') {
        this._getChapterTree(node);  // 获取课程下的章列表树
      }else if (node.level.indexOf('章')!=-1) {
        this._getSectionTree(node);  // 获取章下的节列表树
        this._getChapterSectionResources();// 获取 章 下绑定的资源
      }else if (node.level.indexOf('节')!=-1) {
        this._getKnowledgeTree(node);  // 获取节下的知识点列表树
        this._getChapterSectionResources();// 获取 节 下绑定的资源
      }else if (node.level.indexOf('知识点')!=-1) {
        delete(node.children);
        this._getKnowledgePointResources()  // 获取知识点下绑定的资源
      }
    },
    getNode(node) {  // 获取父级node
      this.parentNode=node.parent.data;
    },
    fileInfo(row) {  // 预览资源
      this.fileFrom=row;
      this.$set(this.fileFrom,'id',row.resourceId);
      this.fileVisible=true;
      this.$refs.fileInformation.choose();  // 在父组件中调用子组件的方法
    }, 
    chooseResource(node) {  // 选择资源
      this.addEditForm=node;
      this.$set(this.addEditForm,'courseId',this.courseId)
      let choosesIds=[]
      this.tableData.forEach(item => {
        choosesIds.push(item.resourceId)
      })
      this.$set(this.addEditForm,'choosesIds',choosesIds);  // 已选取的资源id集合
      this.addEditVisible=true;
    },
    getTableData(data) {  // 获取已选择的资源列表
      if (this.tableData.length==0) {
        this.tableData=data;
      } else {
        let newData=JSON.parse(JSON.stringify(data));
        for(let i=data.length-1;i>=0;i--) {   // 去掉重复数据
          this.tableData.forEach(el => {
            if (el.resourceId==data[i].resourceId) {
              newData.splice(i,1)
            }
          })
        }
        this.tableData=this.tableData.concat(newData);
      }
    },
    deleteRow(index, rows) {  // 移除行
      rows.splice(index, 1);
    },
    save () {
      this.tableData.forEach(item => {
        let hh=item.hh?item.hh: '0';
        let mm=item.mm?item.mm: '0';
        let ss=item.ss?item.ss: '0';
        this.$set(item,'requiredLearningTime',hh+': '+mm+': '+ss)
      })      
      if (this.nodeLevel.indexOf('章')!=-1 || this.nodeLevel.indexOf('节')!=-1) {
        ChapterSectionBind(this.nodeId,this.tableData).then(() => {
          if (this.nodeLevel.indexOf('章')!=-1) {
            this._getCourseTree();
          } else {
            this._getSectionTree(this.parentNode);
          }
          this.$message.success('资源绑定成功');
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        }) 
      }else if (this.nodeLevel.indexOf('知识点')!=-1) {
        KnowledgePointBind(this.nodeId,this.tableData).then(() => {
          this.$message.success('资源绑定成功');
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        }) 
      }
    },  
    close() {   // 关闭模态框
      this.$router.push({path: '/courseassembly/list'})
    },
    preview() {  // 预览章|节|知识点
      // this.$router.push({path: '/knowledge/infomation',query: {courseId: this.courseId}})
      this.infomationVisible=true;

    },
    unBind(row) {    // 章|节|知识点解绑
      this.$confirm(`此操作将解绑知识点【${this.nodeLabel}】所绑定的资源：【${row.title}】， 是否继续？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {    
        if (this.nodeLevel.indexOf('章')!=-1 || this.nodeLevel.indexOf('节')!=-1) {  // 章|节    
          ChapterSectionUnBind(this.nodeId,row.resourceId).then(() => {
            this.$message.success('资源解绑成功！')
            this._getCourseTree();
            if (this.nodeLevel.indexOf('章')!=-1) {
              this._getChapterSectionResources();// 获取 章 下绑定的资源
            } else {
              this._getChapterSectionResources();// 获取 节 下绑定的资源
            }
          }).catch(err => { 
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          }) 	         
        }else if (this.nodeLevel.indexOf('知识点')!=-1) { // 知识点
          KnowledgePointUnbind(this.nodeId,row.resourceId).then(() => {
            this.$message.success('资源解绑成功！');
            this._getKnowledgePointResources()  // 获取知识点下绑定的资源
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
    bindResource(data) {     // 章|节|知识点绑定
      let KnowlodgeLevel=data.KnowlodgeLevel;   // 节点：章|节|知识点
      if (KnowlodgeLevel.indexOf('章')!=-1 || KnowlodgeLevel.indexOf('节')!=-1) {  // 章|节
        ChapterSectionBind(data).then(() => {
          this.$message.success('资源绑定成功！');
          this._getCourseTree();
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        }) 
      }else if (KnowlodgeLevel.indexOf('知识点')!=-1) { // 知识点
        KnowledgePointBind(data.id,data).then(() => {
          this.$message.success('资源绑定成功！');
          this._getCourseTree();
        }).catch(err => { 
          this.$message({
            showClose: true,
            message: err.message,
            type: 'error'
          })
        }) 
      }
    }
    
  }
}
</script>
<style lang="less" scoped>
/deep/.el-tree{
  font-size:14px;
}
.txt{
  background: #eee;
  line-height:1.8;
}
.t-header-title{
  margin-top:0px;
}
.t-header-title span{
  font-size:13px;
  width:100%;
  text-align:left;
  padding-left:1rem;
}
.input-div{
  min-width:100px;
  /deep/.el-input__inner{
    padding:0 7px;
  }
  /deep/.el-button{
    padding:12px 7px;
  }
}
</style>
