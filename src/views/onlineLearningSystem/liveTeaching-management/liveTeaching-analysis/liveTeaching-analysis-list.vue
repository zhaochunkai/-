<template>
<el-drawer v-if = "visible" :visible="visible" :direction = "direction" size="90%" :before-close="handleClose">
  <span slot = "title">直播统计</span>
    <!-- 直播基本信息 -->
    <div class = "t-header-title">
      <span>直播基本信息</span>
    </div>
    <el-table class = "t-table-list" stripe size="small" :data = "basicData" tooltip-effect = "dark" style="width: 100%;margin-top:10px;">
      <el-table-column prop = "title" label = "直播标题">
        <template slot-scope="scope">{{liveRoomInfo.title}}</template>
      </el-table-column>
      <el-table-column prop = "anchor" label = "直播讲师">
        <template slot-scope="scope">{{liveRoomInfo.anchor}}</template>
      </el-table-column>
      <el-table-column prop = "liveRoomTypeString" label = "直播类型">
        <template slot-scope="scope">{{liveRoomInfo.liveRoomType}}</template>
      </el-table-column>
      <el-table-column prop = "liveRoomStatusString" label = "直播状态">
        <template slot-scope="scope">{{liveRoomInfo.liveRoomStatus}}</template>
      </el-table-column>
      <el-table-column prop = "checkInValidPeriod" label = "签到有效期">
        <template slot-scope="scope">{{scope.row.checkInValidPeriod}}分钟</template>
      </el-table-column>
      <el-table-column prop = "planStartTime" label = "计划开始时间">
        <template slot-scope="scope">
          {{scope.row.planStartTime?new Date(scope.row.planStartTime).toLocaleString(): ''}}
        </template>
      </el-table-column>
      <el-table-column prop = "actuallyStartTime" label = "实际开始时间">
        <template slot-scope="scope">
          {{scope.row.actuallyStartTime?new Date(scope.row.actuallyStartTime).toLocaleString(): ''}}
        </template>
      </el-table-column>
      <el-table-column prop = "actuallyStopTime" label = "实际结束时间">
        <template slot-scope="scope">
          {{scope.row.actuallyStopTime?new Date(scope.row.actuallyStopTime).toLocaleString(): ''}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 统计汇总 -->
    <!-- <div class = "t-header-title">
      <span>统计汇总</span>
    </div>
    <div class = "dateGroup">
      <span style="line-height:30px;">统计时间：</span>
      <el-menu :default-active="EvaluationTimeTypeEnum" class = "el-menu-demo" mode="horizontal" @select = "handleSelect">
        <el-menu-item :index = "item.type" v-for = "(item,i) of btns" :key = "i">{{item.name}}</el-menu-item>
      </el-menu>
    </div>
    <div class = "totalCard">
      <div class = "cardLists" v-for = "(item,i) of cardNames" :key = "i">
        <el-card style="margin:0 5px;">
          <div class = "card-title t-font-strong">{{item.name}}</div>
          <p><strong style="font-size:1.2rem;">230</strong> 次</p>
          <div style="display: flex;justify-content:space-between;font-size:0.9rem;">
            <span>PC端：35 次</span>
            <span> | </span>
            <span>移动端：195 次</span>
          </div>
        </el-card>
      </div>
      
    </div> -->
    <!-- 数据统计 -->
    <div class = "t-header-title">
      <span>数据统计</span>
    </div>
    <el-tabs v-model = "StatisticalType" type="card" @tab-click = "handleClick">
      <!-- 观看详情 -->
      <el-tab-pane label = "观看详情" name="first">
        <div class = "dateGroup">
          <span style="line-height:30px;">班级：</span>
          <el-menu :default-active="chooseClass" class = "el-menu-demo" mode="horizontal" @select = "handleSelectClass">
            <el-menu-item :index = "item.id" v-for = "(item,i) of classBtns" :key = "i">{{item.name}}</el-menu-item>
          </el-menu>
        </div>
        <el-table class = "t-table-list" stripe size="small" :data = "studentData" tooltip-effect = "dark" style="width: 100%;margin-top:10px;">
          <el-table-column type="index" label = "序号" width = "50" align = "center"></el-table-column>
          <el-table-column prop = "name" label = "学员姓名" width = "110"></el-table-column>
          <el-table-column prop = "firstEnterTime" sortable label = "首次进入直播房间时间">
            <template slot-scope="scope">
              {{scope.row.firstEnterTime?new Date(scope.row.firstEnterTime).toLocaleString(): ''}}
            </template>
          </el-table-column>
          <el-table-column prop = "lastLeaveTime" sortable label = "最后一次离开直播房间时间">
            <template slot-scope="scope">
              {{!generateLeaveTime(scope.row)?'':new Date(generateLeaveTime(scope.row)).toLocaleString()}}
            </template>
          </el-table-column>
          <el-table-column prop = "checkInTime" sortable label = "签到时间">
            <template slot-scope="scope">
              {{scope.row.checkInTime?new Date(scope.row.checkInTime).toLocaleString(): ''}}
            </template>
          </el-table-column>
          <el-table-column prop = "learningSeconds" label = "在直播中总学习时长 ( 以秒为单位 )" align = "center">
            <template slot-scope="scope">
              {{scope.row.firstEnterTime?generateLearningSeconds(scope.row,generateLeaveTime(scope.row)): ''}}
            </template>
          </el-table-column>
          <el-table-column label = "人脸识别考勤记录" align = "center">
            <template slot-scope="scope">
              <el-button @click = "ViewFaceCheckIn(scope.row)" size="mini" type="primary">查看</el-button>              
            </template>
          </el-table-column>
          <el-table-column prop = "checkInResult" label = "签到结果" width = "110" align = "center">
            <template slot-scope="scope">
              <span class = "text-color-danger" v-if = "scope.row.checkInResult == '未到'">未到</span>
              <span class = "text-color-primary" v-else-if = "scope.row.checkInResult == '迟到'">迟到</span>
              <span class = "text-color-success" v-else>正常</span>
            </template>
          </el-table-column>
        </el-table>		
        <div class = "t-operate-footer">
          <pagination :total = "total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
        </div>        
      </el-tab-pane>
      <!-- 在线人数 -->
      <el-tab-pane label = "在线人数" name="second">
        <el-tabs v-model = "TimeActiveName" type="border-card">
          <!-- 列表 -->
          <el-tab-pane label = "列表" name="list">
            <el-table class = "t-table-list" stripe size="small" :data = "tableData2" tooltip-effect = "dark" style="width: 100%;">
              <el-table-column type="index" label = "序号" width = "50" align = "center"></el-table-column>
              <el-table-column prop = "semesterName" sortable label = "日期">
                <template slot-scope="scope">
                  {{new Date(scope.row.birthday).toLocaleString()}}
                </template>
              </el-table-column>
              <el-table-column prop = "semesterName" label = "PC端观看时长"></el-table-column>
              <el-table-column prop = "className" label = "PC端访问次数"></el-table-column>
              <el-table-column prop = "className" label = "PC端受众数量"></el-table-column>
              <el-table-column prop = "className" label = "移动端观看时长"></el-table-column>
              <el-table-column prop = "className" label = "移动端访问次数"></el-table-column>
              <el-table-column prop = "className" label = "移动端受众数量"></el-table-column>
            </el-table>			
            <div class = "t-operate-footer">
              <pagination :total = "total2" @sizeChange="handleSize2" @currentChange="handleCurrent2"></pagination>
            </div>               
          </el-tab-pane>
          <!-- 折线图 -->
          <!-- <el-tab-pane label = "图表" name="lineGraph">            
            <line-graph height = "400px" ref = "TimeLineGraph" v-if = "flag" :sourceData = "sourceDataTimeAnalysis" :legend = "legendTimeAnalysis" :xData = "xDataTimeAnalysis"></line-graph> 
          </el-tab-pane> -->
        </el-tabs>
      </el-tab-pane>
      <!-- 地域分布 -->
      <el-tab-pane label = "地域分布" name="third">
        
      </el-tab-pane>
      <!-- 观看终端 -->
      <el-tab-pane label = "观看终端" name="fourth">
        <el-row :gutter = "20">
          <el-col :span = "14">
            <pie-graph v-if = "terminaFlag" height = "400px" :dataList = "terminalData" :legendData = "terminalLegendData" labelFormatter = "{b|{b}}：{d}%" tooltipFormatter = "{b}：<br/> 占比：{d}%" orient = "horizontal"></pie-graph> 
          </el-col>
          <el-col :span = "10">            
            <el-table class = "t-table-list" stripe size="small" :data = "terminalData" tooltip-effect = "dark" style="width: 100%;">
              <el-table-column prop = "name" label = "观看终端"></el-table-column>
              <el-table-column prop = "value" label = "观看人次"></el-table-column>
              <el-table-column prop = "value" label = "占比"></el-table-column>
            </el-table>	
          </el-col>
        </el-row>           
      </el-tab-pane>
    </el-tabs>
  <!-- 弹出层：查看考勤信息 -->
  <face-attendance-details type="liveTeaching" :dataForm = "addEditForm" :visible.sync = "faceCheckInVisible"></face-attendance-details>
</el-drawer>
</template>
<script>
import { getDefaultSemester } from '@/server/basic-module.js'
import { getAttendanceList, getLiveRoomCheckInHistory, getLiveRoomById, getLiveRoomStaticsById } from '@/server/online-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import barGraph from '@/components/bar-multiple-graph'
import lineGraph from '@/components/line-graph'
import pieGraph from '@/components/pie-graph-livingTeaching'
import faceAttendanceDetails from '@/components/faceAttendance-details.vue'
export default {
  props: ['dataForm', 'visible'],
  components: {pagination, barGraph, lineGraph, pieGraph, faceAttendanceDetails},
  data () {
    return {
      direction: 'rtl',
      liveRoomId: null,
      liveRoomInfo: {},
      // -----------基本信息
      basicData: [],
      // -----------统计汇总-----统计时间类型
      // -----------统计汇总----按班级查询
      chooseClass: '-1',
      classBtns: [],
      EvaluationTimeTypeEnum: 'All', // 时间类型
      btns: [
        // {type: 'All', name: '全部'},
        // {type: 'Today', name: '今日'},
        // {type: 'Yesterday', name: '昨日'},
        // {type: 'Week', name: '本周'},
        // {type: 'Month', name: '本月'},
        // {type: 'CustomDate', name: '其他时间'},
      ],
      cardNames: [
        {value: 'visits', name: '访问次数'},
        {value: 'ViewingDuration', name: '观看时长'},
        {value: 'visitors', name: '观看人数'},
        {value: 'AverageViewingDuration', name: '人均观看时长'},
        {value: 'Averagevisits', name: '人均访问次数'}
      ],
      // -------------数据统计--观看详情
      StatisticalType: 'first', // 统计类型
      pageSizes,
      pageSize,
      total: 0,
      studentData: [],
      // -------------数据统计--在线人数
      TimeActiveName: 'list',
      total2: 0,
      tableData2: [],
      sourceDataTimeAnalysis: [
        // {
        //   name: '访问次数',
        //   type: 'line',
        //   yAxisIndex: 0,
        //   data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        // },
        // {
        //   name: '观众数量',
        //   type: 'line',
        //   yAxisIndex: 1,
        //   data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        // },
        // {
        //   name: '观看分钟数',
        //   type: 'line',
        //   yAxisIndex: 2,
        //   data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
        // }
      ],
      legendTimeAnalysis: [
        // '观看分钟数',
        // '访问次数',
        // '观众数量'
      ],
      xDataTimeAnalysis: [
        // '10:00:10',
        // '10:30:20',
        // '11:00:00',
        // '11:10:350'
      ],
      sourceData: [],
      flag: false,
      // -------------数据统计-观看终端
      terminaFlag: false,
      terminalLegendData: [
        // '微信',
        // 'Chrome',
        // 'fireFox'
      ],
      terminalData: [
        // {value:335, name: '微信'},
        // {value:335, name: 'Chrome'}
      ],
      // -----------------
      addEditVisible: false,
      addEditForm: {},
      SemesterList: [],
      // -----------------
      faceCheckInVisible: false
    }
  },
  watch: {    
    visible (newVal) {
      if (newVal) {
        this.liveRoomId = this.dataForm.id
        this.liveRoomInfo = this.dataForm
        this.chooseClass = '-1'
        this.StatisticalType = 'first' // 统计类型
        // this.pageSize = 0;
        if (this.liveRoomId) {
          // this._getLiveRoomCheckInHistory();
          this._getLiveRoomStaticsById()
        }      
      }
    },
    TimeActiveName (newVal) {
      if (newVal === 'lineGraph') {
        if (this.sourceDataTimeAnalysis && this.sourceDataTimeAnalysis.length > 0) {
          // this.$refs.TimeLineGraph.initChart();
          this.flag = true
        }        
      }
    },
    StatisticalType (newVal) {
      if (newVal === 'fourth') {
        if (this.terminalLegendData && this.terminalLegendData.length > 0) {
          this.terminaFlag = true
        }  
      }
    },
  },
  methods: {
    formatMsToHms (value) { // 将秒数转为时分秒格式
      // let result = parseInt(value)
      // let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      // let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
      // let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))  　
      // return `${h} 时 ${m} 分 ${s} 秒`
      let result = parseInt(value)
      let h = Math.floor(result / 3600)
      let m = Math.floor((result / 60 % 60))
      let s = Math.floor((result % 60))
      return `${h} 时 ${m} 分 ${s} 秒`
    },
    /* ----------------------------------------查询----------------------------------- */
    _getDefaultSemester () {
      getDefaultSemester().then(result => {
        this.SemesterList.push(result)
      })
    },
    _getLiveRoomStaticsById () {
      this.basicData = []
      getLiveRoomStaticsById(this.liveRoomId).then(res => {
        this.basicData.push(res)
        this.classBtns = [{
          id: -1,
          name: '全部'
        }].concat(res.audiences)
        if (this.classBtns.length > 0) {
          this.classBtns.forEach(item => {
            item.id = item.id + ''
          })
        }
        this._getLiveRoomCheckInHistory();
      })
    },
    // ------------------------------------观看详情-----
    handleSelectClass (key, keyPath) { // 汇总统计-按班级查询
      this.chooseClass = key
      this._getLiveRoomCheckInHistory()
    },  
    /* *接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this._getLiveRoomCheckInHistory(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this._getLiveRoomCheckInHistory(SkipCount, pageSize);
    },
    _getLiveRoomCheckInHistory (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        liveRoomId: this.liveRoomId,
        ClassId: this.chooseClass,
        SkipCount: SkipCount, 
        MaxResultCount: pageSize
      }
      getLiveRoomCheckInHistory(data).then(result => {
        this.studentData = result.items
        this.total = result.totalCount
      })
    },
    // ------------------------------------观看详情-----
    /* *接收改变后每页多少条 */
    handleSize2 (SkipCount, pageSize) {
      // this._getLiveRoomCheckInHistory(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent2 (SkipCount, pageSize) {
      // this._getLiveRoomCheckInHistory(SkipCount, pageSize);
    },        
    handleSelect (key, keyPath) { // 汇总统计-查询条件
      // console.log(key, keyPath);
      this.EvaluationTimeTypeEnum = key
      // this.getAttendanceList();
    },
    generateLeaveTime (row) { // 得到正确的最后一次离开时间
      // let lastLeaveTime = '';
      console.log(this.basicData[0])
      if (this.basicData[0]) {
        // 先根据实际离开时间或最大有效时间，计算出截至时间的毫秒数
        let deadlineTime = new Date(this.basicData[0].actuallyStartTime).getTime() + 4 * 3600 * 1000 // 以真实开始时间+4小时有效期计算出截止时间
        if (this.basicData[0].actuallyStopTime && new Date(this.basicData[0].actuallyStopTime) < deadlineTime) {
          deadlineTime = new Date(this.basicData[0].actuallyStopTime).getTime()
        } else {
          deadlineTime = deadlineTime > new Date().getTime() ? new Date().getTime() : deadlineTime // 截至时间大于当前时间，则以截至时间为准
        }
        let lastLeaveTime = deadlineTime
        if (row.lastLeaveTime) { // 离开时间 = 超时的以有效的离开时间为准 || 实际离开时间
          lastLeaveTime = new Date(row.lastLeaveTime).getTime() > deadlineTime ? deadlineTime : new Date(row.lastLeaveTime).getTime()
        }
        if (row.checkInResult === '未到') {
          lastLeaveTime = ''
        }
        return lastLeaveTime
      }
    },
    generateLearningSeconds (row, endTime) { // 得到正确的学习时长/分钟
      // let seconds = row.learningSeconds;
      let actuallyTime = endTime ? parseInt((new Date(endTime) - new Date(row.firstEnterTime)) / 1000) : 0 // 实际直播时长 = 离开时间-第一次进入时间
      // if (row.learningSeconds! = 0 && row.learningSeconds>actuallyTime) { // 统计的学习时长 > 实际直播时长
      //   seconds = actuallyTime
      // }
      return actuallyTime >= 0 ? this.formatMsToHms(actuallyTime) : ''
    },
    /* ------------------------------------------操作------------------------------- */ 
    handleClick (tab, event) { },
    back () { // 返回到直播列表
      this.$router.push({path: '/liveTeaching/list', query: {}})
    },    
    ratio (index) {
      // console.log(this.programIds[index]);  // 根据x轴下标，获取项目id
      // this.programName = this.initialArr.find(item => {  // 根据项目id，获取项目名称
      //   return item.trainingProgramId == this.programIds[index]
      // }).trainingProgramName
      // this._getRegistrationAnalysisRatio(this.programIds[index]) 

      // this.dialogVisible = true;
    },
    ViewFaceCheckIn (row) {
      this.addEditForm = {
        id: row.id, // 考勤记录id
        name: row.name // 学生姓名
      }
      this.faceCheckInVisible = true;
    },
    // 抽屉关闭
    handleClose (done) {
      this.$emit('update:visible', false)
    }
  },
}
</script>
<style lang = "less" scoped>
.totalCard{
  &:after{
    display:block;
    content: '';
    clear:both;
  }
  .cardLists{
    float: left;
    width:20%;
    min-width:250px;
    
    margin-bottom:10px;
    .card-title{
      color:#0ac4ef;
      font-size:0.9rem;
    }
  }
}
.dateGroup{
  font-size:0.9rem;
}
.text-color-danger{
  color:#f00;
  font-weight:bold;
}
.text-color-primary{
  color:#60f;
  font-weight:bold;
}
.text-color-success{
  color:#0a0;
  font-weight:bold;
}
</style>