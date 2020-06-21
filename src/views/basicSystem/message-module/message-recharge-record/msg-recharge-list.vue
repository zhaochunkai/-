<template>
<div>
  <!-- 短信充值记录 -->
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>短信充值记录</span>
    </div>
    <!-- 操作按钮 -->
    <div class="dateGroup">
      <span style="line-height:30px;">订单状态：</span>
      <el-menu :default-active="OrderStatus" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item :index="item.type" v-for="(item,i) of btns" :key="i">{{item.name}}</el-menu-item>
      </el-menu>
    </div>   
    <!-- 表格 -->
    <el-table class="t-table-list" ref="multipleTable"  stripe size="small" :data="tableData" tooltip-effect="dark" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="weChatOrderId" sortable label="订单ID"></el-table-column>
        <!-- <template slot-scope="scope" show-overflow-tooltip>
          <el-button type="text" style="color:#00f" @click="toInfomationPage(scope.row)">{{scope.row.title}}</el-button>
        </template> -->      
      <el-table-column prop="creationTime" sortable label="订单创建时间">
        <template slot-scope="scope" show-overflow-tooltip>
          {{new Date(scope.row.creationTime).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column prop="expiration" sortable label="订单过期时间">
        <template slot-scope="scope" show-overflow-tooltip>
          {{scope.row.expiration?new Date(scope.row.expiration).toLocaleString(): ''}}
        </template>
      </el-table-column>
      <el-table-column prop="smsOrderStatus" sortable label="订单状态"></el-table-column>
      <el-table-column prop="payStrategy" label="订单内容" >
        <template slot-scope="scope" show-overflow-tooltip>
          单价：{{scope.row.payStrategy.unitPrice}} 元/条<br>
          数量：{{scope.row.payStrategy.count}} 条<br>
          金额：{{scope.row.payStrategy.money}} 元<br>
        </template>
      </el-table-column>
      <!-- <el-table-column  fixed="right" label="操作" width="220" align="left">
        <template slot-scope="scope">
          <el-button v-show="scope.row.approvalStatus!='未通过'" type="text" size="small" @click="refuse(scope.row)">拒绝审核</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 全选 -->
    <div class="t-batch-operate">
      <el-checkbox v-model="isSelectAll" class="t-select-all" @change="selectAll()">全选</el-checkbox>
    </div>			
    <!-- 分页组件 -->
    <div class="t-operate-footer">
      <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
    </div>
  </el-card>
</div>
</template>
<script>
import { getMsgOrdersRecord } from '@/server/message-module';
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {
  data() {return {
    style: '',
    pageSizes,
		SkipCount:0,
    pageSize,
    total:0,
    OrderStatus: 'All', // 默认评价时间类型
    btns: [
      {type: 'All',name: '全部'},
      {type: 'UnFinish',name: '未完成'},
      {type: 'Paid',name: '已支付'},
      {type: 'Failed',name: '交易失败'}
    ],
    tableData: [],
    isSelectAll:false,
  }},
  components: {pagination},
  activated() {
    this.initDataList();
  },
  methods: {
    toInfomationPage(row) { // 跳转至资源信息模块
      this.$router.push({path: '/repository/infomation',query: {id:row.id}})
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
        OrderStatus: this.OrderStatus
      }
      getMsgOrdersRecord(data).then(result => {
        this.tableData=result.items;
        this.total=result.totalCount;
      })
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
    /* ------------------------------------------操作------------------------------- */    
    handleSelect(key, keyPath) {  // 查询列表
      this.OrderStatus=key;
      this.initDataList();
    },
  },
}
</script>
<style lang="less" scoped>
.dateGroup{
  padding-top:0;
}
</style>