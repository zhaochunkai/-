<template>
<div>
  <el-card :style="style">
    <div slot="header" class="t-box-card-header">
      <span>直播详情</span>
    </div>
    <div style="margin-bottom:20px;display:block;">
      <el-button size="small" @click="close">返 回</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="16">
        <div class="vedioBox">
          <!-- Aliplayer.js -->
          <!-- <div class="prism-player" id="J_prismPlayer" style="margin:0 auto;"></div> -->
          <!-- flv.js -->
           <video id="videoElement" controls width="100%" height="100%" v-if="flvPlayAddress">
             ...您的浏览器版本太低，请升级
           </video>
        </div>
        <div class="t-text-normal-size" v-if="pushUrl">
          <strong style="color:#333;margin-right:5px;">推流地址：</strong>
          <span id="copyPushUrl">{{pushUrl}}</span>
          <el-button style="margin-left:10px;" @click="copyPushUrlFn" type="primary" size="small">复 制</el-button>
        </div>
        <div class="t-text-normal-size" v-if="pushName">
          <strong style="color:#333;margin-right:5px;">推流名称：</strong>
          <span id="copyPushName">{{pushName}}</span>
          <el-button style="margin-left:10px;" @click="copyPushNameFn" type="primary" size="small">复 制</el-button>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="直播信息" name="basicInfo">
              <div span="24" v-for="(item,i) of infomationData" :key="i">
                <div class="contain" v-for="(name,j) of infoNameList" :key="j">
                  <div class="t-text-normal-size">
                    <strong>{{name[1]}}：</strong>                    
                    <span>{{item[name[0]]}}</span>
                  </div>
                </div>
              </div>            
            </el-tab-pane>
            <el-tab-pane label="上课班级" name="students">
              <p v-for="(item,i) of classList" :key="i" class="t-text-normal-size">
                <strong>班级：</strong> 
                <span>{{item.name}}</span>
              </p>
            </el-tab-pane>
          </el-tabs>
        </div>

      </el-col>
    </el-row>

    <div style="margin:20px 0;display:block;">
      <el-button size="small" @click="close">返 回</el-button>
      <!-- <el-button type="primary" size="small" @click="save">保 存</el-button> -->
    </div>
  </el-card>
</div>
</template>
<script>
import { getIdentityUserList } from '@/server/identity-module'
import { getLiveRoomById,createLiveRoom,updateLiveRoomById } from '@/server/online-module';
import { getDefaultSemester,getGradeTree } from '@/server/basic-module';
import { getTrainingProgramsList,getTrainingProgramsBindCourse } from '@/server/training-module';
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
export default {  
  data () {
    return {
      style: '',
      player: '',
      // -----------------
      flvPlayAddress: '', // flv直播地址
      hlsPlayAddress: '',  // hls直播地址
      // flvPlayAddress: 'http://live.gedewisdom.com/ETS/RNGd00213_ud.flv?auth_key=1582367953-0-0-6dc524baaa9b61c1f6d9f509f6ea2c63', // 直播地址
      pushUrl: '', // 推流地址
      pushName: '', // 推流名称
      infoNameList: [
        ['title','直播标题'],
        ['description','直播简介'],
        ['roomNumber','房间号'],
        ['anchor','直播讲师'],
        ['planStartTime','计划开始时间'],
        ['actuallyStartTime','实际开始时间'],
        ['checkInValidPeriod','签到有效期'],
        ['liveRoomTypeString','直播类型'],
        ['classNames','听课班级'],
      ],
      infomationData: [],
      // ---------
      classRoomId:null, // 直播间id
      activeName: 'basicInfo', 
      form: {},
      classList: [], // 班级
      
      programs: [], // 项目列表
      courseList: [], // 课程列表
    }
  },
  watch: {
    // 'form.trainingProgramId'(newVal) {
    //   if (newVal) {
    //     this._getTrainingProgramsBindCourse();
    //   }
    // },
    
  },
  activated() {
    this.style=`height:${document.body.clientHeight - 200}px;overflow:scroll;`;
    this.classRoomId=this.$route.query.id;
    if (this.classRoomId) {
      this._getLiveRoomById();
    }
    
  },
  mounted() {        
    setTimeout(() => {  // 加载vedio
      /* --------------- Aliplayer.js ------------------ */
      // var player = new Aliplayer({
      //   id: 'J_prismPlayer',
      //   width: '100%',
      //   autoplay: true,
      //   preload:true,
      //   height: '400px',
      //   //支持播放地址播放,此播放优先级最高
      //   source : this.hlsPlayAddress,
      //   isLive:true,
      // })
      /* --------------- flv.js ------------------ */
      this.player = document.getElementById('videoElement')
      let url=this.flvPlayAddress;
      if (flvjs.isSupported() && this.flvPlayAddress) {
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url: url
        })
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load(); //加载
      }
    },1000)
  },
  methods: {   
    /* -------------------------------------------  查询 ---------------------------------------- */
    _getLiveRoomById() {
      this.infomationData= []
      this.ZBTeacherIds= []
      getLiveRoomById(this.classRoomId).then(result => {
        this.infomationData.push(result);
        this.infomationData.forEach(item => {
          item.checkInValidPeriod=item.checkInValidPeriod+' 分钟'; // 签到有效期
          item.planStartTime=item.planStartTime?new Date(item.planStartTime).toLocaleString(): '';  // 计划开始时间
          item.actuallyStartTime=item.actuallyStartTime?new Date(item.actuallyStartTime).toLocaleString(): ''; // 实际开始时间
          let classNames='';
          item.audiences.forEach(el => {
            classNames+=el.name+',';
          })
          item.classNames=classNames; // 听课班级名称
        })
        this.form=Object.assign({},result)
        this.classList=result.audiences; // 班级列表
        // this.pushUrl=this.form.pushAddress; // 推流地址
        let index=result.pushAddress.lastIndexOf('/');
        this.pushUrl=result.pushAddress.substring(0,index+1); // 推流地址
        this.pushName=result.pushAddress.substring(index+1); // 推流名称
        this.flvPlayAddress=this.form.flvPlayAddress; // 播放地址
        this.hlsPlayAddress=this.form.hlsPlayAddress; // 播放地址
      })
    },
    // _getTrainingProgramsList() { // 状态为“3-培训中”的项目
    //   let data = {
		// 		SkipCount: 0, 
		// 		MaxResultCount: 200,
		// 		// Status:3 
		// 	};
		// 	getTrainingProgramsList(data).then(result => {
    //     this.programs=result.items;
		// 	})
    // }, 
    // _getTrainingProgramsBindCourse() { // 根据项目id查询课程
    //   this.courseList= []
    //   getTrainingProgramsBindCourse(this.form.trainingProgramId).then(result => {
    //     this.courseList=result;
    //   })
    // },
    /* ------------------------------------------  操作 ---------------------------------------- */
    copyPushUrlFn() {
      let val = document.getElementById('copyPushUrl');
      window.getSelection().selectAllChildren(val);
      document.execCommand("Copy");
    },
    copyPushNameFn() {
      let val = document.getElementById('copyPushName');
      window.getSelection().selectAllChildren(val);
      document.execCommand("Copy");
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    close() {
      this.$router.push({path: '/liveTeaching/list'})
    },
    save () {
      
    },
  }
}
</script>
<style lang="less" scoped>
.vedioBox{
  width:100%;
}
.mainContainer {
    display: block;
    width: 1024px;
    margin-left: auto;
    margin-right: auto;
}

.urlInput {
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8px;
    margin-bottom: 8px;
}

.centeredVideo {
    display: block;
    width: 100%;
    height: 576px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: auto;
}

.controls {
    display: block;
    width: 100%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
}
.t-text-normal-size{
  font-size:0.9rem;
  margin-bottom:10px;
  line-height:24px;
  strong{
    color:#333;
    margin-right:5px;
    
  }
  span{
    color:#04a5ff;
  }
}
.t-batch-operate{
  margin-bottom:10px;
}
</style>
