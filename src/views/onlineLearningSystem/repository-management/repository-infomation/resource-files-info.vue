<template>
  <el-dialog class="t-dialog" title="文件预览" v-if="visible" append-to-body :visible="visible" :close-on-click-modal="false" width="75%" @close="close">
    <el-row :gutter="30">
      <el-col :span="16">
        <h4>{{trustedFileName.substr(trustedFileName.indexOf('_')+1)}}</h4>
        <!-- <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player> -->
         <file-preview ref="previewFiles" :trustedFileName="trustedFileName"></file-preview>
      </el-col>
      <el-col :span="8">
        <el-form class="t-form-block" ref="form" :model="form" label-width="80px" size="small"> 
          <el-form-item label="文件名" prop="trustedFileName">
            <div class="t-info-div">{{trustedFileName.substr(trustedFileName.indexOf('_')+1)}}</div>
          </el-form-item>
          <el-form-item label="关键词" prop="resourceWarehouseId">
            <div class="t-info-div">{{form.keyWord}}</div>
          </el-form-item>
          <el-form-item label="发布人" prop="resourceWarehouseId">
            <div class="t-info-div">{{form.creatorName}}</div>
          </el-form-item>
          <el-form-item label="发布时间" prop="resourceWarehouseId">
            <div class="t-info-div">{{form.creationTime?new Date(form.creationTime).toLocaleDateString(): ''}}</div>
          </el-form-item>
          <el-form-item label="资源类型" prop="resourceWarehouseId">
            <el-select v-model="form.type" disabled>
              <el-option v-for="(item,i) of dictionary.ZYLX" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源大小" prop="resourceWarehouseId">
            <div class="t-info-div">{{form.file?form.file.fileSize: ''}}</div>
          </el-form-item>
          <el-form-item label="浏览次数" prop="resourceWarehouseId">
            <div class="t-info-div">{{form.browseCount}}</div>
          </el-form-item>
          <el-form-item label="下载次数" prop="resourceWarehouseId">
            <div class="t-info-div">{{form.downloadCount}}</div>
          </el-form-item>
        </el-form>
        <div style="margin:20px 0;display:block;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small" @click="upload()">下载</el-button>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
// import filter from '@/utils/filter.js'
import { baseURL } from '@/config.js'
import { getDictionaryItems } from '@/server/basic-module'
import { DownloadExternalFiles } from '@/server/blob-module'
import {
  getResourcePlanInfo,
  updateResourceBroswerCount,
  updateResourceDownloadCount
} from '@/server/online-module'
import filePreview from '@/components/filePreview.vue'
export default {
  props: ['dataForm', 'visible','cos'],
  data () {
    return {
      form: {},
      standard: '', 
      activeName: 'upload',
      trustedFileName: '',
      /*  ------------------[-----------数据字典- 字典码-------------- */
      dicJudgeName: {
        ZYBZ: 'ZYBZ', // 资源标准
        ZYLX: 'ZYLX', // 资源类型
        JYLX: 'JYLX', // 教育类型
        MTGS: 'MTGS' // 媒体格式
      },
      dictionary: {},
      /* --------------------------------- 腾讯云存储桶配置 -------------------------------- */
      fileTypes: ['txt','rtf','doc','docx','xls','xlsx','pptx','ppt','odt','ods','fodt','odp'],
    }
  },
  components: {filePreview},
  watch: {
    visible (newVal) {
      if (newVal) {
        this.trustedFileName=this.dataForm.trustedFileName;
        if (this.dataForm.id) {
          this._getResourcePlanInfo();
        }
      }
    },
  },
  activated () {
    /*  ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */
    for (let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result)
      })
    }
  },
  methods: {   
    _getResourcePlanInfo() {  // 获取文件播放信息
      getResourcePlanInfo(this.dataForm.id).then(result => {
        this.form=Object.assign({},result)
      })
    },
    iconByType(data) {  // 获取文件后缀名
      let type = data.substr(data.lastIndexOf(".") + 1).toLowerCase()
      if (this.fileTypes.indexOf(type) !== -1) {
        return 'office'
      } else {
        return 'cos'
      }
    },
    upload() {
      // 文件后缀名
      let title = this.trustedFileName.substr(this.trustedFileName.indexOf('_') + 1)
      let fileTypeName = this.trustedFileName.lastIndexOf('.') !== -1 ? this.trustedFileName.substr(this.trustedFileName.lastIndexOf(".") + 1).toLowerCase(): ''; 
      if (fileTypeName && this.fileTypes.indexOf(fileTypeName) === -1) {
        console.log(this.trustedFileName)
        this.globle_cos().downloadCosFile(this.trustedFileName, title)
      } else {
        let url = baseURL + '/Api/ExternalFiles/Download?fileName=' + this.trustedFileName
        let link = document.createElement('a')
        link.setAttribute('download', title)
        link.href = url
        link.click()
      }
      this._updateResourceDownloadCount();
    },
    close() {
      this._updateResourceBroswerCount();
      this.$emit('update:visible', false);
    },
    choose() {  // 在父组件中调用子组件的方法
      setTimeout(() => {  // 延迟，以避免方法获取不到
        if (this.dataForm.trustedFileName) {
          this.trustedFileName=this.dataForm.trustedFileName
          this.$refs.previewFiles._getPreviewFile(); // 获取文件预览地址          
        }
      },1)
    },
    _updateResourceBroswerCount() {  // 更新资源浏览量
      updateResourceBroswerCount(this.dataForm.id)
    },
    _updateResourceDownloadCount() {  // 更新资源下载量
      updateResourceDownloadCount(this.dataForm.id)
    },
  },
  beforeDestroy() {


  },
}
</script>
<style lang="less" scoped>
.txt{
  background: #eee;
  line-height:1.8;
}
/deep/.el-form .el-form-item{
  max-width:80%;
}
/deep/.el-select{
  width:100%;
}
</style>
