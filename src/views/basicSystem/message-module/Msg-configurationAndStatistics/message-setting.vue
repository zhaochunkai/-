<template>
  <el-card :style="style">
    <!-- <div slot="header">
			<span>短信配置及统计</span>
    </div> -->
		<!-- 短信配置及统计 -->
		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="消息推送" name="msgPust">	
				<el-tag type="warning" style="color:#000;margin-bottom:20px;" effect="dark">消息推送功能，可以让你通过短信和微信公众号，给学员推送考试和学员相关的提醒消息，包括成绩导入、成绩查询等，以提升学员的学习体验。</el-tag>			
				<!-- <div v-if="messageCheckList.length>0">
					<div class="t-box-card-header">
						<span class="title">短信配置</span>		
					</div> 
					<div class="message-check" v-for="(item,j) in messageCheckList" :key="j">
						<el-form class="t-form-block" label-width="130px" size="small">
							<el-form-item :label="item.displayName">							
								<div style="display:flex;">
									<el-input v-model="item.currentValue" ></el-input>
									<el-tag style="margin-left:10px;" v-show="item.description">{{item.description}}</el-tag>
								</div>
							</el-form-item>
						</el-form>				
					</div>						
					<el-button style="margin-bottom:20px;margin-left:130px;" type="primary" size="small" @click="saveMsgSetting">保 存</el-button>
				</div> -->
	
				<div class="t-box-card-header">
					<span class="title">短信统计</span>
					<span class="date">数据更新时间：{{date.toLocaleString()}}</span>
					<el-button type="text" @click="refresh">刷新</el-button>						
				</div>
				<el-table class="t-table-list" ref="tableList" stripe size="small" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%;margin-top:10px;">
					<el-table-column prop="used" label="成功到达量"></el-table-column>
					<el-table-column prop="residue" label="剩余短信"></el-table-column>
					<el-table-column prop="lastModificationTime" label="最近一次修改时间">
						<template slot-scope="scope">
							{{scope.row.lastModificationTime?new Date(scope.row.lastModificationTime).toLocaleString(): ''}}
						</template>
					</el-table-column>
					<el-table-column  fixed="right" label="操作" width="150" align="center">
						<template slot-scope="scope">
							<el-button  size="small" type="success" @click="goToCharge(scope.row)">短信充值</el-button>
							<!-- <el-button type="text" size="small" @click="isEneble(scope.row)">{{scope.row.isAvailable?'启用': '停用'}}</el-button> -->
						</template>
					</el-table-column>
				</el-table>
				<div class="t-box-card-header">
					<span class="title">交易短信提醒</span>		
				</div>
				<el-row>
					<el-col :span="6" v-for="(item,i) of subPages.child" :key="i">
						<el-card class="cardItem" align="center">
							<h3>{{item.displayName}}</h3>
							<div class="buttons" style="margin:1rem 0;">
								<!-- <el-button type="text">未启用</el-button> -->
								<el-button type="primary" size="small" @click="goToSetting(item)">设 置</el-button>
							</div>
						</el-card>
					</el-col>
				</el-row>       
				
			</el-tab-pane>
			<el-tab-pane label="推送统计" name="PushStatistic">
				<push-statics></push-statics>  
			</el-tab-pane>
			<!-- <el-tab-pane label="充值记录" name="rechargeRecord">
				<recharge-record></recharge-record>
			</el-tab-pane>
			<el-tab-pane label="短信签名" name="msgSign">
				<message-sign></message-sign>
			</el-tab-pane> -->
		</el-tabs>
		<!-- 短信充值 -->
		<charge-dialog :dataForm="chargeForm" :visible.sync="chargeVisible" @save="chargeSave" @updateList="_getSurplusMessage"></charge-dialog>
	</el-card>
</template>
<script>
import { updateEtsGlobalSetting,getEtsGlobalSettingAll, } from '@/server/resource-module';
import { getMsgConfiguration,getSurplusMessage } from '@/server/message-module';
import pushStatics from './push-statics.vue'
import rechargeRecord from './recharge-record.vue'
import messageSign from './message-sign.vue'
import chargeDialog from './message-charge-dialog'
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
			messageCheckList: [],
    }
	},
	components: {pushStatics,rechargeRecord,messageSign,chargeDialog},
	activated() {
		this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
		this._getEtsGlobalSettingAll();
		this._getEtsGlobalSettingAllMessage();
		this._getMsgConfiguration(); // 获取短信中心配置参数 
	},
  methods: {
		_getMsgConfiguration() { // 获取短信中心配置参数
			getMsgConfiguration().then(res => {
				sessionStorage.setItem('MsgConfiguration',JSON.stringify(res));
				this._getSurplusMessage();
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			})
		},
		_getSurplusMessage() {
			this.tableData= []
			getSurplusMessage().then(result => {
				this.tableData.push(result);
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			})
		},
		_getEtsGlobalSettingAll() {
			getEtsGlobalSettingAll().then(result => {
				let newResult=[]
				let newPermissions= []
        newResult=result.filter((group,i) => {
					if (group.name.indexOf('Ets.NotificationPushing')>-1) { 
						if (group.name.split('.').length==2) { // 将name分割后长度为2的数据，存为一级元素
							let obj=Object.assign({},group,{
								child: [],
							})
							newPermissions.push(obj)
						}
						return group; // 将name中含有'Ets.NotificationPushing'的数据添加到新数组newResult中
					}
				})
				newPermissions.forEach(ele => {
					for(let i=0;i<newResult.length;i++ ) {
						if (newResult[i].name.substr(0,newResult[i].name.lastIndexOf('.'))==ele.name) {
							let obj=Object.assign({},newResult[i])
							ele.child.push(obj)
						}
					}
				})
				this.subPages=Object.assign([],newPermissions)[0];
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
		_getEtsGlobalSettingAllMessage() { // 短信验证配置
			getEtsGlobalSettingAll().then(result => {
				// let newResult=[]
				// this.messageCheckList= []
        // newResult=result.filter((group,i) => {
				// 	if (group.name.indexOf('Ets.Admin.SmsAppId')>-1 || group.name.indexOf('Ets.Admin.SmsAppSecret')>-1) {  // 
				// 		this.messageCheckList.push(group)
				// 	}
				// })
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 
		},
		refresh() {
			this._getSurplusMessage();
			this.date=new Date();
		},
		goToSetting(row) {
			let data={
				title:row.displayName,
				name:row.name
			}
			this.$router.push({name: 'message-parameter-setting',query:data})
		},
		goToCharge(row) {
			this.chargeVisible=true;
			this.chargeForm=row;
			this.$refs.tableList.setCurrentRow(row);
		},
		chargeSave (id) {
			let obj=this.tableData.find(item => {
				return item.id==id
			})
			this.$refs.tableList.setCurrentRow(obj);
		},
		handleClick(tab, event) {
			// console.log(tab, event);
		},		
    saveMsgSetting() {
			let arr=[]
			this.messageCheckList.forEach(item => {
				let obj={
					name:item.name,
					value:item.currentValue
				}
				arr.push(obj)
			})
			updateEtsGlobalSetting(arr).then(result => {
				this._getEtsGlobalSettingAllMessage();
				this.$message.success('设置成功！');
			}).catch(err => { 
				this.$message({
					showClose: true,
					message: err.message,
					type: 'error'
				})
			}) 	
    },
  }
}
</script>
<style lang="less" scoped>
.t-box-card-header {
	border-bottom:1px solid #666;
	line-height:40px;
	span.title{
		padding:10px 16px;
		border:1px solid #666;
		border-bottom:none;
	}
	span.date{
		margin:0 60px;
	}
	
}
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
</style>
