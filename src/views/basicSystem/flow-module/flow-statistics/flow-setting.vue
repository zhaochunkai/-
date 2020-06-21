<template>
  <el-card :style="style">
		<!-- 流量配置及统计 -->
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="流量统计" name="msgPust">	
				<div class="t-box-card-header">
					<span class="date" style="margin-right:20px;">数据更新时间：{{date.toLocaleString()}}</span>
					<el-button type="text" @click="refresh">刷新</el-button>						
				</div>
				<!-- 基础流量 -->
				<el-tabs type="border-card" style="max-width:500px;">
					<el-tab-pane label="基础流量">
						<el-table class="t-table-list" ref="tableList" stripe size="small" :data="tableData" tooltip-effect="dark" highlight-current-row>
							<el-table-column prop="ResidueFlux" label="剩余流量（含直播和资源）">
								<template slot-scope="scope" width="150">
									{{scope.row.ResidueFlux}} GB
								</template>
							</el-table-column>
							<el-table-column label="操作" width="150" align="center">
								<template slot-scope="scope">
									<el-button  size="small" type="success" @click="goToCharge(scope.row,'flux')">流量充值</el-button>
								</template>
							</el-table-column>
						</el-table>						
					</el-tab-pane>
				</el-tabs>
				<!-- CDN流量 -->
				<el-tabs type="border-card" style="margin-top:15px;max-width:500px;">
					<el-tab-pane label="CDN流量">
						<el-tag type="danger" style="color:#f00;">CDN：以CDN流量+CDN回源流量替代昂贵的外网下行流量极大降低访问成本</el-tag>
						<el-button type="danger" size="medium" @click="showCDNIntro">CDN用法说明</el-button>				
						<el-form class="t-operate-filter" :inline="true" size="small">
							<el-form-item label="是否开启CDN">
								<el-switch v-model="IsOpenCDN" active-color="#13ce66" @change="_SetCdnSettingForCurrentTenant"></el-switch>
							</el-form-item>
						</el-form>  
						<el-table class="t-table-list" ref="CDNTableList" stripe size="small" :data="rechargeData" tooltip-effect="dark" highlight-current-row>
							<el-table-column prop="ResidueFlux" label="CDN剩余流量">
								<template slot-scope="scope" width="150">{{scope.row.ResidueFlux}} GB</template>
							</el-table-column>
							<el-table-column label="操作" width="150" align="center">
								<template slot-scope="scope">
									<el-button  size="small" type="success" @click="goToCharge(scope.row,'CDN')">流量充值</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
				</el-tabs>	
			</el-tab-pane>
			<!-- （直播）流量账单 -->
			<el-tab-pane label="（直播）流量账单" name="PushStatistic">
				<push-teaching-statics ref="teachingStatics"></push-teaching-statics>  
			</el-tab-pane>
			<!-- （资源）流量账单 -->
			<el-tab-pane label="（资源）流量账单" name="ResourceStatistic">
				<push-resource-statics ref="resourceStatics"></push-resource-statics>  
			</el-tab-pane>
			<!-- （CDN）流量充值账单 -->
			<el-tab-pane label="（CDN）流量充值账单" name="CDNResourceStatistic">
				<cdn-resource-statics ref="CDNResourceStatics"></cdn-resource-statics>  
			</el-tab-pane>
		</el-tabs>
		<!-- 流量充值 -->
		<charge-dialog :dataForm="chargeForm" :title="dialogTitle" :StrategyType="StrategyType" :visible.sync="chargeVisible" @save="chargeSave" @updateList="updateList"></charge-dialog>
		<!-- CDN用法说明 -->
		<cdn-comparison-info :visible.sync="CDNIntro"></cdn-comparison-info>
	</el-card>
</template>
<script>
import { updateEtsGlobalSetting,getEtsGlobalSettingAll,getResidueFlux,getCDNOrderList,GetCdnFluxResidue,GetCdnSettingForCurrentTenant,SetCdnSettingForCurrentTenant } from '@/server/resource-module';
import chargeDialog from './flow-charge-dialog'
import pushTeachingStatics from './push-liveTeaching-statics.vue'
import pushResourceStatics from './push-resource-statics'
import cdnResourceStatics from './cdn-resource-statics'
import cdnComparisonInfo from './cdn-comparison-info'
export default {
  data () {
    return {
			style: '',
			subPages: [],
			activeName: 'msgPust',
			date:new Date(),
			tableData: [],
			chargeForm: {},
			chargeVisible:false,
			flowCheckList: [],
			ResidueFlux:null,
			// CDN
			StrategyType: '', // 策略类型 CDN flux
			rechargeData: [],
			dialogTitle: '', // 充值窗口标题
			CDNIntro:false, // CDN产品描述
			IsOpenCDN:false, // 是否启用CDN
    }
	},
	components: {chargeDialog,pushResourceStatics,pushTeachingStatics,cdnResourceStatics,cdnComparisonInfo},
	activated() {
		this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
		this._getResidueFlux();
		this._GetCdnFluxResidue();
		this._GetCdnSettingForCurrentTenant();
		this.CDNIntro=false;
		
	},
  methods: {
		/* ------------------------------------------查询------------------------------- */   
		_getResidueFlux() { //获取剩余流量
			this.tableData= []
			getResidueFlux().then(res => {
				let obj={
					ResidueFlux:res
				}
				this.tableData.push(obj)
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
		_GetCdnFluxResidue() { //获取剩余流量
			this.rechargeData= []
			GetCdnFluxResidue().then(res => {
				let obj={
					ResidueFlux:res
				}
				this.rechargeData.push(obj)
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
		_GetCdnSettingForCurrentTenant() {
			GetCdnSettingForCurrentTenant().then(res => {
				this.IsOpenCDN=res
			})
		},
		/* ------------------------------------------操作------------------------------- */  
		_SetCdnSettingForCurrentTenant() {
			SetCdnSettingForCurrentTenant(this.IsOpenCDN).then(res => {
				this.$message.success(`${this.IsOpenCDN?'开启': '关闭'}成功!`)
				this._GetCdnSettingForCurrentTenant();
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
		showCDNIntro() {
			this.CDNIntro=true;
		},
		refresh() {
			this._getResidueFlux();
			this._GetCdnFluxResidue();
			this.date=new Date();
		},
		goToSetting(row) {
			let data={
				title:row.displayName,
				name:row.name
			}
			this.$router.push({name: 'message-parameter-setting',query:data})
		},
		goToCharge(row,type) {
			this.chargeVisible=true;
			this.chargeForm=row ||{};
			this.StrategyType=type;
			if (type=='CDN') {
				this.dialogTitle='CDN流量充值'
			} else {
				this.dialogTitle='流量充值'
			}
			setTimeout(() => {
				this.$refs.tableList.setCurrentRow(row);
			},1)
		},
		chargeSave (id,type) {
			let obj=this.tableData.find(item => {
				return item.id==id
			})
			setTimeout(() => {
				this.$refs.tableList.setCurrentRow(obj);
			},1)
		},
		updateList(type) {
			if (type=='CDN') {
				// this._getResidueFlux()
			} else {
				this._getResidueFlux()
				this._GetCdnFluxResidue();
			}
		},
		handleClick(tab, event) {
			if (this.activeName=='ResourceStatistic') {  // 资源流量
				this.$refs.resourceStatics.initDataList();
			}else if (this.activeName=='PushStatistic') { // 直播流量
				this.$refs.teachingStatics.initDataList();
			}else if (this.activeName=='msgPust') { // 所有流量统计
				this._getResidueFlux();
				this.date=new Date();
				this._GetCdnSettingForCurrentTenant();
			} else { // CDN
				// this._GetCdnFluxResidue();
				this._GetCdnSettingForCurrentTenant();
			}
		},	
  }
}
</script>
<style lang="less" scoped>
.cardItem{
	margin:20px 20px 10px;
	color:#993;
	line-height:40px;
	.buttons{
		display:flex;
		justify-content: space-around;
	}
}
.message-check{
	margin-top:10px;
	/deep/.el-form-item{
		max-width:650px;
	}
}
.t-operate-filter{
	margin-top:10px;
}
</style>
