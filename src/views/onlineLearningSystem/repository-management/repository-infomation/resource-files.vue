<template>
<div>
  <div slot="header" class="t-box-card-header">
    <span>基本信息</span>
  </div>
  <el-form class="t-operate-filter" :model="basicForm" size="small">
    <el-form-item label="资源标准" label-width="120px">
      <el-select v-model="basicForm.standard" :disabled="true" >
        <el-option v-for="(item,i) of dictionary.ZYBZ" :key="i" :label="item.name" :value="item.code"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="资源标题" label-width="120px">
      <el-input class="input-append"  v-model="basicForm.title" :readonly="true"></el-input>	
    </el-form-item>
    <el-form-item label="所属资源库" label-width="120px">
      <el-input class="input-append"  v-model="basicForm.resourceWarehouse" :readonly="true"></el-input>	
    </el-form-item>
    <el-form-item label="学科" label-width="120px">
      <!-- <el-input class="input-append"  v-model="basicForm.discipline" :readonly="true"></el-input>	 -->
      <el-cascader v-model="disciplineList" separator=">" :options="options" :props="props" disabled></el-cascader>
    </el-form-item>
    <el-form-item label="发布者" label-width="120px">
      <el-input class="input-append"  v-model="basicForm.creatorName" :readonly="true"></el-input>	
    </el-form-item>
  </el-form>
  <div slot="header" class="t-box-card-header">
    <span>文件列表</span>
  </div>
  <!-- 表格 -->
  <el-table class="t-table-list"  ref="multipleTable" stripe size="small" :data="fileData" tooltip-effect="dark" style="width: 100%;margin-top:10px;">
    <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
    <el-table-column prop="trustedFileName" label="文件名称">
      <template slot-scope="scope">
        <el-button type="text" style="color:#00f" @click="fileInfo(scope.row)">{{scope.row.trustedFileName.substr(scope.row.trustedFileName.indexOf('_')+1)}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="fileSize" label="大小" >
      <template slot-scope="scope">
        {{scope.row.fileSize}}
      </template>
    </el-table-column>    
    <el-table-column  fixed="right" label="操作" width="250" align="center">
      <template slot-scope="scope">
        <a v-if="iconByType(scope.row.trustedFileName)=='office'" style="color:#00f;" target="_blank" :href="url+'/Api/ExternalFiles/Download?fileName='+scope.row.trustedFileName" :download="scope.row.trustedFileName.substr(scope.row.trustedFileName.indexOf('_')+1)">下载</a>
        <el-button type="text" v-else @click="downloadCosFile(scope.row.trustedFileName,scope.row.trustedFileName.substr(scope.row.trustedFileName.indexOf('_')+1))">下载</el-button>
      </template>
    </el-table-column>
  </el-table>		
  <!-- 分页组件 -->
  <div class="t-operate-footer">
    <pagination :total="total" @sizeChange="handleSize" @currentChange="handleCurrent"></pagination>
  </div>
  <!-- 资源文件内容 -->
  <files-info :cos="cos" ref="fileInformation" :dataForm="addEditForm" :visible.sync="addEditVisible"></files-info>  
</div>
</template>
<script>
var COS = require('cos-js-sdk-v5') // 引入COS
import filter from '@/utils/filter.js'
import { baseURL } from '@/config.js' 
import { getExternalDataFirst,getTempFileUploadToken } from '@/server/online-module'
import { getDictionaryItems } from '@/server/basic-module'
import { getTrainingProgramsById } from '@/server/training-module'
import { DownloadExternalFiles } from '@/server/blob-module'
import { getPreviewFile } from '@/server/files-module'
import { pageSizes, pageSize } from '@/config.js'
import pagination from '@/components/pagination'
import filesInfo from './resource-files-info'
export default {
  props: ['basicForm', 'fileData', 'options','disciplineList'],
  data () {
    return {
      id: '',
      form: {},
      pageSizes,
      pageSize,
      total: 0,
      tableData: [],
      addEditForm: {},
      addEditVisible: false,
      url: baseURL,
      props: {
        value: 'id',
        label: 'name',
        children: 'child',
        checkStrictly: 'true'
      },
      /* ------------------[-----------数据字典- 字典码-------------- */ 
      discrible: {},
      dicJudgeName: {
        ZYBZ: 'ZYBZ', // 资源标准
        ZYLX: 'ZYLX', // 资源类型
        JYLX: 'JYLX', // 教育类型
        MTGS: 'MTGS' // 媒体格式
      },
      dictionary: {},
      /* --------------------------------- 腾讯云存储桶配置 -------------------------------- */
      config: {
        Bucket: sessionStorage.getItem('TenancyId')+'-1301412513',
        Region: 'ap-chengdu'
      },
      cos: null,
      expireTime: '' // COSToken过期时间
    }
  },
  components: {pagination, filesInfo},
  activated () {
    this._getTempFileUploadToken()
    /* ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  methods: {
    /* ------------------------------------------- COS 初始化实例 ---------------------------------------- */
    // COS 初始化实例
    _getTempFileUploadToken () {
      getTempFileUploadToken().then(res => { // 获取上传的token等参数
        this.expireTime = new Date(res.expireTime * 1000)
        this.cos = new COS({
          getAuthorization: function (options, callback) {
            callback({
              TmpSecretId: res.tempAppId,
              TmpSecretKey: res.tempAppSecret,
              XCosSecurityToken:  res.tempToken,
              StartTime: res.startTimestamp, // 时间戳，单位秒,建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              ExpiredTime: res.endTimestamp // 时间戳，单位秒
            })              
          }
        })
      })
    },
    /* ------------------------------------------- 查询 ---------------------------------------- */
    /* 接收改变后每页多少条 */
    handleSize (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize);
    },
    /* 接收当前页数 */
    handleCurrent (SkipCount, pageSize) {
      this.initDataList(SkipCount, pageSize);
    },
    // 获取资源列表，应该增加子库id绑定查询
    initDataList (SkipCount = 0, pageSize = this.pageSize) {
      let data = {
        SkipCount: SkipCount, 
        MaxResultCount: pageSize
      }
      // getResourceList(data).then(result => {
        // this.tableData=result.items;
        // this.total=result.totalCount;
      // })
    },
    /* -------------------------------------------------------------------------------------- */
    iconByType(data) { // 获取文件后缀名
      let type = data.substr(data.lastIndexOf(".") + 1).toLowerCase()
      if (type=='txt' || type=='rtf'|| type=='doc'|| type=='docx'|| type=='xls'|| type=='xlsx') {
        return 'office'
      } else {
        return 'cos'
      }
    },  
    fileInfo(data) {
      this.addEditForm=data;
      this.$set(this.addEditForm,'id',this.basicForm.id)
      this.addEditVisible=true;
      this.$refs.fileInformation.choose(); // 在父组件中调用子组件的方法
    }, 
    downloadCosFile(trustedFileName, title) {
      console.log('sssss')
      getPreviewFile(trustedFileName).then(res => {  // 获取本地资源并预览
        // let url=res.domainName?res.domainName+res.filePath:baseURL+'/'+res.filePath
        if (res.domainName) {
          if (!this.cos || this.expireTime < new Date()) {
            this._getTempFileUploadToken()
          } 
          this.cos.getObject({
            Bucket: this.config.Bucket, /* 必须 */
            Region: this.config.Region, /* 存储桶所在地域，必须字段 */
            Key: res.filePath /* 必须 */
          }, function (err, data) {
            if (!err) {
              console.log(data.Body)
              filter.downloadBlobFile(data.Body, title)
            }
          })
        } else {
          this.$message.warning('该资源暂不支持下载')
        }
      }).catch(err => {
        this.$message({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })  
    },
  },
}
</script>
<style lang="less" scoped>
.t-box-card-header{
  line-height:40px;
  border-bottom:1px solid #ddd;
  margin-bottom:20px;
  span{
    padding:11px 100px 12px;
    border:1px solid #ddd;
    background: #ddd;
    border-bottom:none;
    font-weight: 600;
  }
}
/deep/.el-form .el-form-item{
  max-width:60%;
}
/deep/.el-input__inner,
/deep/.el-textarea__inner,
/deep/.el-input.is-disabled .el-input__inner{
  border:none;
  background: #eee;
  color:#333;
}
/deep/.el-cascader--small,
/deep/.el-select{
  width:100%;
}
/deep/.el-cascader.is-disabled .el-cascader__label{
  color:#333;
}
</style>