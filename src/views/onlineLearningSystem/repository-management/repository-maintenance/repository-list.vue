<template>
<div>
  <el-row :gutter="10">
    <el-col :span="5">
      <el-card :style="style">
        <!-- 资源树 -->
        <org-tree ref="orgTree" :currentNodeAll="nodeSelect" :dataList="resourceTree" @selectNode="haddleOrganizationNode"></org-tree>                                
      </el-card>
    </el-col>
    <el-col :span="19" >
      <!-- 资源列表 -->
      <el-card v-show="JSON.stringify(this.nodeSelect) != '{}'&& this.nodeSelect.level!='根'" :style="style">
        <div slot="header" class="t-box-card-header">
          <span>资源列表</span>
        </div>
        <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
            <el-form-item label="资源标题">
              <el-input class="input-append" v-model="conditionForm.Key" placeholder="资源标准/关键字"></el-input>	
            </el-form-item>
            <el-form-item label="资源类型">
              <el-select v-model="conditionForm.Type" clearable>
                <el-option v-for="(item,i) of dictionary.ZYLX" :key="i" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="资源标准">
              <el-select v-model="conditionForm.Standard" clearable>
                <el-option v-for="(item,i) of dictionary.ZYBZ" :key="i" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学科">
              <el-input class="input-append" v-model="conditionForm.Discipline"></el-input>	
            </el-form-item>
            <el-form-item label="审核状态">
              <el-select v-model="conditionForm.ApprovalStatus">
                <el-option label="全部" value="All"></el-option>
                <el-option label="通过" value="Approved"></el-option>
                <el-option label="未通过" value="Rejected"></el-option>
                <el-option label="待审核" value="Pending"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
            </el-form-item>
        </el-form>                               
        <!-- 操作按钮 -->
        <div class="t-operate-buttons">
          <el-button type="primary" size="mini" @click="addResource">上传资源</el-button>
          <!-- <el-button type="primary" size="mini" @click="delResource">删除</el-button> -->
        </div>
        <!-- 表格 -->
        <el-table class="t-table-list"  ref="multipleTable" border size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="title" sortable label="资源标题" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.title}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="资源类型"  width="100"></el-table-column>
          <el-table-column prop="type" label="建议学习时长"  width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="settingTime(scope.row)" type="text" title="点击设置学习时长">
                <span v-if="scope.row.suggestedLearningTime=='0:0:0'" style="color:#0a0;font-size:12px;">点我设置</span>
                <span v-else style="color:#0a0;font-size:12px;font-weight:600;">
                  {{scope.row.suggestedLearningTime.split(': ')[0]}}时{{scope.row.suggestedLearningTime.split(': ')[1]}}分{{scope.row.suggestedLearningTime.split(': ')[2]}}秒
                </span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="standard" label="资源标准" width="150"></el-table-column>
          <el-table-column prop="discipline" label="所属学科" width="150"></el-table-column>
          <el-table-column prop="resourceWarehouse" label="所属资源库"></el-table-column>
          <el-table-column prop="approvalStatus" label="审核状态" width="80"></el-table-column>
          <el-table-column prop="usageStatus" label="状态" width="60"></el-table-column>
          <el-table-column  fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="addResource(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="delResource(scope.row)">删除</el-button>
              <!-- <el-button type="text" size="small" >置顶</el-button>
              <el-button type="text" size="small" >取消置顶</el-button> -->
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
  <add-edit :cos="cos" :dataForm="addEditForm" :visible.sync="addEditVisible" @save="saveData" @saveMeta="metaData" @initDataList="queryList"></add-edit>
  <!-- 快捷设置学习时长 -->
  <el-dialog title="设置建议学习时长" :visible.sync="dialogFormVisible" width="500px">
    <div class="t-header-title">
      <span>资源标题：{{times.title}}</span>
    </div>
    <el-form :model="times" size="small" label-width="80px">
      <el-form-item label="小时">  
        <el-input v-model="times.hh" type="number" clearable min="0" max="59">
          <el-button slot="append">小时</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="分钟">  
        <el-input v-model="times.mm" type="number" clearable min="0" max="59" placeholder="数值范围：0~59">
          <el-button slot="append">分钟</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="秒数">  
        <el-input v-model="times.ss" type="number" clearable min="0" max="59" placeholder="数值范围：0~59">
          <el-button slot="append">秒</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false" size="small">关 闭</el-button>
      <el-button type="primary" @click="saveTimes" size="small">保 存</el-button>
    </div>
  </el-dialog>
</div>
</template>
<script>
var COS = require('cos-js-sdk-v5')  // 引入COS
import { getWarehouseResourceList } from '@/server/resource-module';
import { getWarehouseTree,getDictionaryItems } from '@/server/basic-module';
import { 
  getTempFileUploadToken,
  updateResource,deleteResource,updateResourceMetadata,SetSuggestedLearningTime
} from '@/server/online-module';
import { createResource } from '@/server/files-module';
import orgTree from "@/components/orgTree.vue"
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import addEdit from "./repository-list-add" 
// import refuseEdit from "./pay-list-refuse.vue" 
export default {
    data() {return {
      pageSizes,
      pageSize,
      SkipCount:0,
      total:0,
      style: '',
      resourceTree: [],
      conditionForm: {},
      tableData: [],
      isSelectAll:false,
      addEditVisible:false,
      addEditForm: {},
      nodeId: '',
      nodeName: '',
      nodeSelect: {},
      // ---------------学习时长
      times: {},
      dialogFormVisible:false,
      /* --------------------------------- 腾讯云存储桶配置 -------------------------------- */
      config: {
        Bucket : sessionStorage.getItem('TenancyId')+'-1301412513',
        Region : 'ap-chengdu'
      },
      cos:null,
      expireTime: '', // COSToken过期时间
      /* ------------------[-----------数据字典- 字典码-------------- */ 
      dicJudgeName: {
        ZYBZ: 'ZYBZ', // 资源标准
        ZYLX: 'ZYLX', // 资源类型
      },
      dictionary: {},
    }},
    components: {orgTree,pagination,addEdit,},
    activated() {
	  	this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
      this._getWarehouseTree();
      this._getTempFileUploadToken();
      if (this.nodeSelect && JSON.stringify(this.nodeSelect)!='{}') {
        this.foucsOnNode();
      }
      /* ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */ 
      for(let item in this.dicJudgeName) {
        getDictionaryItems(this.dicJudgeName[item]).then(result => {
          this.$set(this.dictionary, item, result)
        })
      }
    },
    methods: {
      /* ------------------------------------------- 查询 ---------------------------------------- */
      // COS 初始化实例 
      _getTempFileUploadToken() {
        getTempFileUploadToken().then(res => {  // 获取上传的token等参数
          this.expireTime=new Date(res.expireTime*1000)
          this.cos = new COS({
            getAuthorization: function (options, callback) {                          
              callback({
                TmpSecretId: res.tempAppId,
                TmpSecretKey: res.tempAppSecret,
                XCosSecurityToken:  res.tempToken,
                StartTime:  res.startTimestamp, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                ExpiredTime: res.endTimestamp, // 时间戳，单位秒，如：1580000900
              })              
            }
          })
        })
      },
    /* ------------------------------------------- 操作 ---------------------------------------- */
		foucsOnNode() {
			setTimeout(() => {
				this.$refs.orgTree.checkNode();
			},500)
		},
    toInfomationPage(row) { // 跳转至资源信息模块
      this.$router.push({path: '/repository/infomation',query: {id:row.id}})
    },
    _getWarehouseTree() {  // 资源树
      this.resourceTree= []
      getWarehouseTree().then(result => {
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
    // 获取资源列表，应该增加子库id绑定查询
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data={
        SkipCount: SkipCount, 
        MaxResultCount: pageSize,
        Key: this.conditionForm.Key,
        Type: this.conditionForm.Type,
        Standard: this.conditionForm.Standard,
        Discipline: this.conditionForm.Discipline,
        ApprovalStatus: this.conditionForm.ApprovalStatus,
        id: this.nodeId
      }
      getWarehouseResourceList(data).then(result => {
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
    settingTime(row) {     
      if (row.suggestedLearningTime=='0:0:0') {
        this.times={
          title:row.title,
          id:row.id,
          hh:null,
          mm:null,
          ss:null,
        }
      } else {
        let suggestedLearningTime=row.suggestedLearningTime.split(': ');
        this.times={
          title:row.title,
          id:row.id,
          hh:suggestedLearningTime[0],
          mm:suggestedLearningTime[1],
          ss:suggestedLearningTime[2],
        }
      }
      this.dialogFormVisible=true;   
    },
    saveTimes() {        
      this.times.hh=!this.times.hh?'0': this.times.hh;
      this.times.mm=!this.times.mm?'0': this.times.mm;
      this.times.ss=!this.times.ss?'0': this.times.ss;
      if (this.times.mm<0||this.times.mm>59) {
        this.$alert('提示：学习时长的分钟数 范围是0~59');
        return;
      }
      if (this.times.ss<0||this.times.ss>59) {
        this.$alert('提示：学习时长的秒数 范围是0~59');
        return;
      }
      let suggestedLearningTime=this.times.hh+': '+this.times.mm+': '+this.times.ss;
      this.$set(this.times,'suggestedLearningTime',suggestedLearningTime);
      SetSuggestedLearningTime(this.times).then(() => {
        this.$message.success('学习时长设置成功！');
        this.queryList();
        this.dialogFormVisible=false;   
      }).catch(err => { 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      }) 
      
    },
    addResource(row) {
      if (!this.cos || this.expireTime<new Date()) {
        this._getTempFileUploadToken();
      }
      this.addEditVisible=true;        
      this.addEditForm= row || {};
      this.addEditForm.resourceWarehouseId=this.nodeId;
      this.addEditForm.resourceWarehouse=this.nodeName;
    },
    saveData(row) {
    },
    metaData(row) {
      updateResourceMetadata(row).then(() => {
        this.$message.success('资源属性更新成功！')
        this.queryList();
      }).catch(err => { 
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      }) 
    },
    delResource(row) {
      let data=row || this.multipleSelection || {};
      this.$confirm(`此操作将删除资源： 【${data.title?data.title.substr(data.title.indexOf('_')+1):data.title}】，请确认？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {   
        deleteResource(data).then(result => {
          this.$message.success('删除成功')
          this.initDataList()
          this.$refs.pagination.currentPage=1
					this.foucsOnNode();
        }) .catch(err => { 
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
.t-header-title span{
  width:100%;
  text-align:left;
  padding-left:1rem;
}
.specialCol{
  background:#a5f373;
  /deep/.el-button{
    span{
      color:#00f;
    }
  }
}
</style>