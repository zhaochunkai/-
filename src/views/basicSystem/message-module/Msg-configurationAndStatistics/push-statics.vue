<template>
  <div>
    <!-- 操作按钮 -->
    <div class="dateGroup">
      <span style="line-height:30px;">统计时间：</span>
      <el-menu :default-active="EvaluationTimeTypeEnum" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable" stripe size="small" :data="tableData" tooltip-effect="dark" style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table class="expand-table" stripe size="small" :data="props.row.smsSendOverview" tooltip-effect="dark" style="width: 100%;">
            <el-table-column label="短信类型" prop="notificationType"></el-table-column>
            <el-table-column label="发送条数" prop="count"></el-table-column>
            <el-table-column label="失败条数" prop="time">
              <template slot-scope="scope">
                {{scope.row.failedCount}}                
                <el-button size="mini" v-if="scope.row.failedCount>0" @click="showFailedTable(props.row.time)">点击查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="发送日期" prop="time" width="200">
        <template slot-scope="scope">{{scope.row.time?new Date(scope.row.time).toLocaleDateString(): ''}}</template>
      </el-table-column>
      <el-table-column label="发送总条数" prop="totalSend"></el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
    <!-- 推送失败短息明细 -->
    <push-statics-details :visible.sync="tableVisible" :dataList="gridData" ></push-statics-details>
  </div>
</template>
<script>
import pushStaticsDetails from './push-statics-details'
import pagination from '@/components/pagination'
import { pageSizes, pageSize } from '@/config.js'
import { getMsgSendStatistics,getFailedSmsByStartTime } from '@/server/message-module.js'
export default {
  data() {return {
    EvaluationTimeTypeEnum: 'All', // 默认评价时间类型
    btns: [
      {type: 'All',name: '全部'},
      {type: 'Today',name: '今日'},
      {type: 'Yesterday',name: '昨日'},
      {type: 'Week',name: '本周'},
      {type: 'Month',name: '本月'},
      {type: 'CustomDate',name: '其他时间'},
    ],
    pageSize,
		SkipCount:0,
    total:0,
    tableData: [],
    tableVisible: false,
    gridData: [],
    startTime:null,
  }},
  components: {pagination,pushStaticsDetails},
  activated() {
    this.initDataList();
  },
  methods: {
    /* ------------------------------------------操作------------------------------- */    
    // 子组件传回父组件的值控制抽屉隐藏
    Visibility(value) {
      this.table=value
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
    // 获取列表
    initDataList(SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount, 
        MaxResultCount: pageSize,
      };
      getMsgSendStatistics(data).then(result => {
        this.tableData=result.items;
        this.total=result.totalCount;
      })
    },
    handleSelectionChange() {

    },
    _getFailedSmsByStartTime() {
      getFailedSmsByStartTime(this.startTime).then(res => {
        this.gridData=res;
      })
    },
    /* ------------------------------------------操作------------------------------- */    
    showFailedTable(time) {
      this.startTime=time;
      this.tableVisible=true;
      this._getFailedSmsByStartTime();
    },
    handleSelect(key, keyPath) {  // 查询列表
      this.EvaluationTimeTypeEnum=key;
      this.initDataList();
    },
  }
}
</script>
<style lang="less" scoped>
.dateGroup{
  padding-top:0;
}
/deep/.el-table__expanded-cell[class*=cell]{
  padding:5px 5px 5px 50px;
  background: #f5f5f5;
}
</style>

