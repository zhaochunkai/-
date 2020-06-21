<template>
<div>
    <!-- 学年信息 -->
    <el-form class="t-operate-filter" :inline="true" :model="conditionForm" size="small">
        <el-form-item label="状态">
            <el-select v-model="conditionForm.status">
                <el-option label="全部" value="All"></el-option>
                <el-option label="启用" value="Enable"></el-option>
                <el-option label="停用" value="Disable"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
        </el-form-item>
    </el-form>  
    <div class="t-operate-buttons">
        <el-button type="primary" size="mini" @click="addEdit()">新增</el-button>
        <!-- <el-button type="primary" size="mini">启用</el-button>
        <el-button type="primary" size="mini">停用</el-button> -->
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="schoolYearData" tooltip-effect="dark" style="width: 100%;margin-top:10px;" @selection-change="handleSelectionChange" @row-click="selectRow">
        <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
        <el-table-column prop="academicYearName" sortable label="学年名称">
        </el-table-column>
        <el-table-column prop="academicYearBeginTime" label="开始时间">
            <template slot-scope="scope">
                <!-- {{scope.row.academicYearBeginTime.toLocaleString()}} -->
                {{new Date(scope.row.academicYearBeginTime).toLocaleDateString()}}
            </template>
        </el-table-column>
        <el-table-column prop="academicYearEndTime" label="结束时间">
            <template slot-scope="scope">
                {{new Date(scope.row.academicYearEndTime).toLocaleDateString()}}
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="60">
            <template slot-scope="scope">
                {{scope.row.status=='Enable'?'启用': '停用'}}
            </template>
        </el-table-column>
        <el-table-column  fixed="right" label="操作" width="140" align="center">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="addEdit(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="del(scope.row)">删除</el-button>
                <el-button type="text" size="small" @click="isEneble(scope.row)">{{scope.row.status=='Enable'?'停用': '启用'}}</el-button>
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
    <!-- 新增/修改页面 -->
	<add-edit :visible="table" :dataForm="addEditForm" @changeVisibility="Visibility" @save="addEditSave"></add-edit>
</div>
</template>
<script>
import { 
    getAcademicYearList,createAcademicYear,updateAcademicYear,deleteAcademicYear,updateAcademicYearStatus
} from '@/server/basic-module'
import { pageSizes, pageSize } from '@/config.js'
import addEdit from "./academicYear-list-add"
import pagination from '@/components/pagination'
export default {
	data() {return {
		pageSize,
		SkipCount:0,
		total:0,
		isSelectAll:false,
		addEditVisible:false,
		addEditForm: {},
		schoolYearData: [],
		activeName: 'first',
		form: {},
		conditionForm: {},
		table: false,
		selectRowData: {},
	}},
	components: {addEdit,pagination},
	activated() {
		this.initDataList();
	},
	methods: {
		// 子组件传回父组件的值控制抽屉隐藏
		Visibility(value) {
			this.table=value
		},
		selectRow(row) {
			this.selectRowData=row;            
			this.$emit('chooseRowDate',row)
			this.$refs.multipleTable.clearSelection();
			this.$refs.multipleTable.toggleRowSelection(row);
		},
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
		// 学年列表
		initDataList(SkipCount = 0, pageSize = this.pageSize) {
			let data = {
				SkipCount: SkipCount, 
				MaxResultCount: pageSize,
				UsageStatus: this.conditionForm.status
			};
			getAcademicYearList(data).then(result => {
				this.schoolYearData=result.items;
				this.total=result.totalCount;
			})
		},
		/*改变每页多少条*/
		handleSizeChange (val) {
			this.pageSize = val;
		},
		/*当前页数*/
		handleCurrentChange (val) {
			this.currentPage = val;
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
			this.isSelectAll = this.schoolYearData.length === this.multipleSelection.length;
		},
		addEdit(row) {
			this.addEditForm = row || {};
			this.addEditVisible = true;
			this.table = true;
		},
		addEditSave (data) {
			// let start=data.academicYearBeginTime;
			// let end=data.academicYearEndTime;
			// if (start instanceof Object) {
			// 	start=start.toLocaleDateString();
			// } else {
			// 	start=new Date(start).toLocaleDateString();
			// }
			// if (end instanceof Object) {
			// 	end=end.toLocaleDateString();
			// } else {
			// 	end=new Date(end).toLocaleDateString();
			// }
			// data=Object.assign(data,{
			// 	academicYearBeginTime:start,
			// 	academicYearEndTime:end,
			// })
			if (data.id) {
				updateAcademicYear(data).then(result => {
					this.queryList();
					this.$message.success('保存成功');
				}).catch(err => { 
					this.$message({
						showClose: true,
						message: err.message,
						type: 'error'
					})
				}) 
			} else {
				createAcademicYear(data).then(result => {
					this.queryList();
					this.$message.success('保存成功');
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
			let row= data || this.multipleSelection[0]
			this.$confirm(`此操作将删除选中的数据 【${row.academicYearName}】数据， 是否继续？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
			}).then(() => {                
					deleteAcademicYear(row).then(() => {
						this.$message.success('数据删除成功！')
						this.initDataList();
						this.$refs.pagination.currentPage=1
					}).catch(err => { 
						this.$message({
							showClose: true,
							message: err.message,
							type: 'error'
						})
					}) 
			}).catch(() => {})
		},
		// 启用停用
		isEneble(row) {
			this.$confirm(`此操作将 ${row.status=='Enable'?'停用': '启用'} 【${row.academicYearName}】数据， 是否继续？`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if (row.status=='Enable') {
					row.status=false
				} else {
					row.status=true
				}
				updateAcademicYearStatus(row).then((result) => {
					this.$message.success('状态修改成功！')
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
	}
}
</script>
<style lang="less" scoped>

</style>
