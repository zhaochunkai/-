<template>
<div>
	<el-row :gutter="10">
		<el-col :span="5">
			<el-card :style="style">
				<!-- 机构树 -->
				<org-tree :dataList="schoolListTree" @selectNode="haddleOrganizationNode"></org-tree>                             
			</el-card>
			<!-- <el-card>
				<el-tabs v-model="activeTreeName" @tab-click="handleClick" tab-position="left">
					<el-tab-pane label="学校" name="school">44</el-tab-pane>
					<el-tab-pane label="企业" name="enterprise">55</el-tab-pane>
				</el-tabs>          
			</el-card> -->
		</el-col>
		<el-col :span="19">
			<!-- 学校信息列表 -->
			<el-card v-show="nodeId==-1 && nodeLevel==null && nodeLable=='学校'" :style="style">
				<div slot="header" class="t-box-card-header">
					<span>学校列表</span>
				</div>
				<el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
					<el-form-item label="学校名称">
						<el-input class="input-append"  v-model="conditionForm.name" placeholder="请输入学校名称"></el-input>	
					</el-form-item>
					<!-- <el-form-item label="状态">
						<el-select v-model="conditionForm.keyword2">
								<el-option label="全部" value="0"></el-option>
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
					<!-- <el-button type="primary" size="mini">启用</el-button>
					<el-button type="primary" size="mini">停用</el-button> -->
				</div>
				<!-- 表格 -->
				<el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"> </el-table-column>
					<el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
					<el-table-column prop="name" sortable label="学校名称">
						<!-- <template slot-scope="scope">{{ scope.row.date }}</template> -->
					</el-table-column>
					<el-table-column prop="code" label="学校代码" width="110" >
					</el-table-column>
					<!-- <el-table-column prop="isAvailable" label="状态" width="100">
						<template slot-scope="scope">
							<el-checkbox :value="scope.row.isAvailable"></el-checkbox>
						</template>
					</el-table-column> -->
					<el-table-column prop="address" label="地址">
					</el-table-column>
					<el-table-column  fixed="right" label="操作" width="150" align="center">
							<template slot-scope="scope">
								<el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
								<!-- <el-button type="text" size="small" @click="del(scope.row)">删除</el-button> -->
								<!-- <el-button type="text" size="small" @click="isEneble(scope.row)">{{scope.row.isAvailable?'启用': '停用'}}</el-button> -->
							</template>
					</el-table-column>
				</el-table>
				<!-- 全选 -->
				<div class="t-batch-operate">
					<el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
				</div>			
				<!-- 分页组件 -->
				<!-- <div class="t-operate-footer">
						<pagination ref="pagination" :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
				</div> -->
			</el-card>
			<!-- 学校信息 -->
			<campus-list v-show="nodeId!=-1 &&nodeLevel=='学校'" :schoolData="schoolData" @updateSchoolTree="_getSchoolTree" ></campus-list> 
			<!-- 校区信息 -->
			<institution-list v-show="nodeLevel=='校区'" :campusData="campusData" @updateSchoolTree="_getSchoolTree"></institution-list>
			<!-- 机构列表 -->
			<office-list v-show="nodeLevel=='机构'" :nodeId="nodeId" :nodeLevel="nodeLevel" :institutionData="institutionData" @updateSchoolTree="_getSchoolTree"></office-list>
			<!-- 企业列表 -->
			<enterprise-list v-show="nodeId==-1 && nodeLevel=='企业'" @updateSchoolTree="_getSchoolTree"></enterprise-list>
			<!-- 企业详细信息 -->
			<enterprise-detail v-show="nodeId!=-1 && nodeLevel=='企业'" :nodeId="nodeId" :nodeLevel="nodeLevel" @updateSchoolTree="_getSchoolTree"></enterprise-detail>
		</el-col>
	</el-row>
	<!-- 弹出层：新增/编辑学校信息 -->
	<add-edit :dataForm="addEditForm" :visible.sync="addEditVisible" @save="addEditSave"></add-edit>
</div>
</template>
<script>
import { getSchoolTree,getEnterpriseTree,
    getSchoolList,getSchoolById,createSchool,updateSchool,
    deleteCampusById,getCampusById,getInstitutionById,getEnterpriseById,
    
} from '@/server/basic-module'

import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import orgTree from "@/components/orgTree.vue"
import campusList from "./campus-list.vue"
import institutionList from "./institution-list.vue"
import officeList from "./office-list.vue"
import enterpriseList from "./enterprise-list.vue"
import enterpriseDetail from "./enterprise-detail.vue"
import addEdit from "./school-list-add.vue" 
export default {
	data() { return {
		pageSizes,
		pageSize,
		SkipCount:0,
		style: '',
		currentPage:0,
		isSelectAll:false,
		addEditVisible:false,
		addEditForm: {},
		conditionForm: {},
		tableData: [],
		nodeLevel:null,
		nodeLable: '学校',
		nodeId: '',
		// tab切换
		activeName: 'first',activeTreeName: 'school',
		form: [],
		total:0,
		schoolListTree: [],
		enterpriseList: [],
		schoolData: {},
		campusData: {},
		institutionData: {},
		enterpriseInfo: {}
	}},
	components: {pagination,orgTree,addEdit,campusList,institutionList,officeList,enterpriseList,enterpriseDetail},

	activated() {
		this._getSchoolTree();  
		this.initDataList();
		this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
	},
	methods: {
		queryList() {
			this.initDataList(this.SkipCount, this.pageSize);
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
		_getSchoolTree() {
			this.schoolListTree=[]
			getSchoolTree().then(result => { // 获取学校信息树
				this.schoolListTree.push(result);
				getEnterpriseTree().then(result => { // 获取企业信息树
					this.schoolListTree.push(result);
				})
			})
		},
		// 获取学校列表
		initDataList(SkipCount = 0, pageSize = this.pageSize) {
			let data = {
				SkipCount: SkipCount, 
				MaxResultCount: pageSize,
				name: this.conditionForm.name
			};
			getSchoolList(data).then(result => {
				this.tableData=result.items;
				this.total=result.totalCount
			})
		},
		// 学校据id获取学校信息
		
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
		addEdit(row) {
			this.addEditForm = row || {};
			this.addEditVisible = true;
		},
		addEditSave (data) {
			if (data.id) {
				updateSchool(data).then(result => {
					this.$message.success('保存成功')
					this.queryList();
					this._getSchoolTree();
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				})
			} else {
				createSchool(data).then(result => {
					this.$message.success('保存成功')
					this.queryList();
					this._getSchoolTree();
				}).catch(err => {
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				})
			}
		},
		del(row) {             //删除学校
			// this.$confirm(`此操作将 删除学校 【${row.name}】数据， 是否继续？`, '提示', {
			// 	confirmButtonText: '确定',
			// 	cancelButtonText: '取消',
			// 	type: 'warning'
			// }).then(() => {
			// 	deleteCampusById(row).then(() => {
			// 		this.$message.success('校区删除成功！');
			// 		this.initDataList();
			// 		this.$refs.pagination.currentPage=1
			// 	}).catch(err => { 
			// 		this.$message({
			// 				showClose: true,
			// 				message: err.message,
			// 				type: 'error'
			// 		})
			// 	})
			// }).catch(() => {})
		},
		// 启用停用
		isEneble(row) {
			this.$confirm(`此操作将 ${row.isAvailable?'停用': '启用'} 【${row.name}】数据， 是否继续？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				row.enable=!row.enable;
				updateCampusStatus(row).then(() => {
					this.$message.success('状态修改成功！');
					this.queryList();
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				})
			}).catch(() => {})
		},
		// tab切换
		handleClick(tab, event) {
				// console.log(tab, event);
		},
		/*选择的组织机构*/
		haddleOrganizationNode(node) {
			console.log(node)
			this.nodeLevel=node.level;
			this.nodeLable=node.label;
			this.nodeId=node.id;
			this.institutionData={};
			let nodeId='';
			// 学校据机构号或者校区代码查询机构信息
			if (node) { nodeId=node.id;}
			if (node.id==-1 && node.level==null && node.label=='学校') {
				this.initDataList()
				return ;
			}else if (node.id!=-1 && node.level=='学校') { // 学校据id查询学校信息
				getSchoolById(nodeId).then(result => {
					this.schoolData=result;
				})
				return ;
			}else if (node.level=='校区') { // 学校据id查询校区信息
				getCampusById(nodeId).then(result => {
					this.campusData=result;
				})
				return ;
			}else if (node.level=='机构') { // 学校据id查询机构信息
				getInstitutionById(nodeId).then(result => {
					this.institutionData=result;
				})
				return ;
			}else if (node.level==null && node.label=='企业') {
				return ;
			}else if (node.id!=-1 && node.level=='企业') {
				// getEnterpriseById(nodeId).then(result => {
				//     this.enterpriseInfo=Object.assign({},result);
				// })
				// return ;
			}
		},
	}
}
</script>
<style lang="less" scoped>

</style>