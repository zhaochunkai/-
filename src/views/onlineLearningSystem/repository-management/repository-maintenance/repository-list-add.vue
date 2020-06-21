<template>
  <el-dialog class="t-dialog" title="编辑资源信息" v-if="visible" :visible="visible" :close-on-click-modal="false" width="40%" @close="close">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="上传资源" name="upload" v-loading="loading"
        element-loading-text="资源保存中..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)">
        <el-form class="t-form-block" ref="form" :model="form" :rules="rules" label-width="100px" size="small">         
          <el-form-item label="资源标准" prop="standard">
            <el-select v-model="standard">
              <el-option v-for="(item,i) of dictionary.ZYBZ" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属资源库" prop="resourceWarehouseId">
            <el-input  v-model="form.resourceWarehouse" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-select v-model="form.type">
              <el-option v-for="(item,i) of dictionary.ZYLX" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属学科" prop="discipline">
            <el-cascader v-model="disciplineList" filterable clearable placeholder="可输入名称进行检索" separator=">" :options="options" :props="props" @active-item-change="handleItemChange"></el-cascader>
          </el-form-item>
          <el-form-item label="上传文件" prop="trustedFileNamesSplitByVerticalLine">
            <el-upload class="image-upload-pic" ref="upload" action="fakeaction"
              :http-request="handleUploadFileToCos"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :on-exceed="handleExceed"
              :file-list="fileList"
              accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.pdf,.svg,.png,.jpg,.jpeg,.gif,.bmp,.ogg,.mp3,.swf,.avi,.mp4"
              :before-upload="beforeFileUpload"  
              :on-success="handleSuccess"
              :on-change="handleChange"
              :limit="20" multiple   
              >
              <el-button size="small" type="primary" icon="el-icon-plus avatar-uploader-icon">选择文件</el-button>
              <el-tag type="danger">每个文件大小不得超过500MB</el-tag>
            </el-upload>
            <el-tag>建议上传以下文件格式：.doc,.docx,.ppt,.pptx,.txt,.pdf,.svg,.png,.jpg,.jpeg,.gif,.bmp,.mp3,.mp4</el-tag>

          </el-form-item>  
          <el-form-item :label="discrible.name" v-show="discrible.code!=4">
            <div class="txt">{{discrible.describe}}</div>
          </el-form-item>
          <el-form-item label="起始页面" prop="resourceWarehouseId" v-show="discrible.code==4">
            <el-input  v-model="form.resourceWarehouse"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin:20px 0;display:block;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small" @click="save ('save')" >保存</el-button>
          <el-button type="primary" size="small" @click="save ('saveGoon')">保存并继续</el-button>
          <el-button type="primary" size="small" @click="next('second')" v-show="id?true:false">下一页</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="资源标注属性" name="second" v-if="id?true:false">
        <el-form class="t-form-block" ref="metaForm" :model="metaForm" :rules="metarules" label-width="80px" size="small">         
          <el-form-item label="资源标题" prop="title">
            <el-input v-model="metaForm.title"></el-input>
          </el-form-item>
          <el-form-item label="关键词" prop="keyWord">
            <el-input v-model="metaForm.keyWord"></el-input>
            <el-tag>关键词之间请用英文状态的逗号 , 隔开</el-tag>
          </el-form-item>
          <el-form-item label="资源类型" prop="type">
            <el-select v-model="metaForm.type">
              <el-option v-for="(item,i) of dictionary.ZYLX" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="所属资源库" prop="resourceWarehouse">
            <el-input v-model="metaForm.resourceWarehouse" disabled></el-input>
          </el-form-item> -->
          <el-form-item label="教育类型" prop="educationType">
            <el-select v-model="metaForm.educationType">
              <el-option v-for="(item,i) of dictionary.JYLX" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="媒体格式" prop="mediaType">
            <el-select v-model="metaForm.mediaType">
              <el-option v-for="(item,i) of dictionary.MTGS" :key="i" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建议学习">  
            <div style="display:flex;">
              <div class="input-div">
                <el-input v-model="hh" type="number" min="0" max="59">
                  <el-button slot="append">时</el-button>
                </el-input>
              </div>
              <div class="input-div">
                <el-input v-model="mm" type="number" min="0" max="59" placeholder="数值范围：0~59">
                  <el-button slot="append">分</el-button>
                </el-input>
              </div>
              <div class="input-div">
                <el-input v-model="ss" type="number" min="0" max="59" placeholder="数值范围：0~59">
                  <el-button slot="append">秒</el-button>
                </el-input>
              </div>
            </div> 
          </el-form-item>
          <el-form-item label="发布者" prop="creatorName">   
            <el-input v-model="metaForm.creatorName" disabled></el-input>
          </el-form-item>
          <el-form-item label="资源描述" prop="description">
            <el-input v-model="form.description" type="textarea"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin:20px 0;display:block;">
          <el-button size="small" @click="close">返 回</el-button>
          <el-button type="primary" size="small" @click="savemeta">保存资源属性</el-button>
          <el-button type="primary" size="small" @click="next('upload')">上一页</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
// var COS = require('cos-js-sdk-v5')  // 引入COS
import {baseURL} from '@/config.js'
import { getDictionaryItems,getDictionaryItemsInfo,} from '@/server/basic-module';
import { 
  getTempFileUploadToken,
  getExternalDataFirst,getExternalDataChild,getResourceById,getResourceMetadata,
  updateResource,
} from '@/server/online-module';
import { createResource } from '@/server/files-module';
import { UploadExternalFiles } from '@/server/files-module';
export default {
  props: ['dataForm', 'visible','cos'],
  data () {
    return {
      httpUrl: '',
      id: '',
      form: {},
      metaForm: {},
      standard: '5',
      fileList: [],       
      rules: {
        standard: [{ required: true, message: '请选择所属资源标准', trigger: 'blur' }],
        resourceWarehouseId: [{ required: true, message: '请选择所属资源库 Id', trigger: 'blur' }],
        type: [{ required: true, message: '请选择所属资源类型', trigger: 'blur' }],
        files: [{ required: true, message: '请上传文件', trigger: 'blur' }],
        // discipline: [{ required: true, message: '请选择所属学科', trigger: 'blur' }],
      },
      metarules: {
        title: [{ required: true, message: '请输入资源标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择所属资源类型', trigger: 'blur' }],
        mediaType: [{ required: true, message: '请上传文件', trigger: 'blur' }],
      },
      disciplineList: [],
      activeName: 'upload',
      options: [],
      props: {
        value: 'id',
        label: 'name',
        children: 'child',
        checkStrictly: 'true'
      },
      resourceWarehouseId: '',
      resourceWarehouse: '',
      videoUploadPercent:0,
      videoFlag:false,
      btnShow:false,
      loading:false,
      /* ------------------[-----------数据字典- 字典码-------------- */ 
      discrible: {},
      dicJudgeName: {
        ZYBZ: 'ZYBZ', // 资源标准
        ZYLX: 'ZYLX', // 资源类型
        JYLX: 'JYLX', // 教育类型
        MTGS: 'MTGS', // 媒体格式
      },
      dictionary: {},
      trustedFileNameLists: [],
      hh:null, // 时
      mm:null, // 分
      ss:null, // 秒
      fileTypes: ['txt','rtf','doc','docx','xls','xlsx','pptx','ppt','odt','ods','fodt','odp'],
      /* --------------------------------- 腾讯云存储桶配置 -------------------------------- */
      config: {
        Bucket : sessionStorage.getItem('TenancyId')+'-1301412513',
        Region : 'ap-chengdu'
      },
    }
  },
  watch: {
    visible (newVal) {
      if (newVal) {
        this.resourceWarehouse=this.dataForm.resourceWarehouse;
        this.resourceWarehouseId=this.dataForm.resourceWarehouseId;
        this.id=this.dataForm.id;
        this.activeName='upload'
        if (this.dataForm.id) {
          this.activeName='second'
          this.disciplineList= []
          getResourceById(this.id).then(result => {  // 获取资源文件信息
            this.form = Object.assign({}, result);
            this.standard=result.standard;
            this.disciplineList.push(Number(result.discipline));
            result.files=[result.file]
            result.files.forEach(element => {
              element.name=result.title+result.files[0].trustedFileName.substr(result.files[0].trustedFileName.lastIndexOf('.'))
              // element.name=result.title
            })
            this.fileList=[result.file];
            this.$set(this.form,'resourceWarehouseId',this.resourceWarehouseId);
            this.$set(this.form,'trustedFileNamesSplitByVerticalLine',result.files[0].trustedFileName);
            this.btnShow=true;
            // this.disciplineList=Object.assign([],result.discipline.split(','));
          })
          getResourceMetadata(this.id).then(result => { // 获取资源元数据   
            let times=result.suggestedLearningTime.split(': ');
            this.hh=times[0]; // 时
            this.mm=times[1]; // 分
            this.ss=times[2]; // 秒
            this.metaForm=Object.assign({},result,{
              mediaType:result.mediaType+'',
              educationType:result.educationType+'',
              type:result.type+'',
              id: this.id,
            })
          })
        } else {          
          this.trustedFileNameLists= []
          this.fileList= []
          this.form={};
          this.standard='5';
          this.form.standard='5'
          // this.disciplineList= []
          this.$set(this.form,'trustedFileNamesSplitByVerticalLine','');
          this.$set(this.form,'files',[]);
          this.$set(this.form,'type','3');
        }
        this.$set(this.form,'resourceWarehouseId',this.resourceWarehouseId);
        this.$set(this.form,'resourceWarehouse',this.resourceWarehouse);
      }
    },
    standard(newVal) { // 根据字典code='ZYBZ'和字典项code查询字典名称和描述；
      this.form.standard=newVal;
      getDictionaryItemsInfo('ZYBZ',newVal).then(result => {
        this.discrible=Object.assign({},result);
      })
    }
  },
  activated() {
    this._getExternalDataFirst();
    /* ------------------[-----------数据字典- 获取数据字典下拉数据-------------- */ 
    for(let item in this.dicJudgeName) {
      getDictionaryItems(this.dicJudgeName[item]).then(result => {
        this.$set(this.dictionary, item, result);
      })
    }
  },
  methods: {  
    _getExternalDataFirst() {  // 获取一级学科
      getExternalDataFirst().then(result => {
        this.options=result;
        // this.options.forEach(element => {
        //   element.child= []
        // })
        // console.log(result)
      })
    },
    handleItemChange(val) {  // 点击节点时，加载下一级数据
      this.parentId=val[val.length-1]; // 取到最后一个节点的id
      // this.options.find(item => {
      //   if (item.id==this.parentId) {
      //     if (item.child.length==0) {
      //       getExternalDataChild(this.parentId).then(result => {
      //         if (result.length>0) {
      //           item.child=result;
      //         } else {
      //           delete(item.child)
      //         }
      //       })
      //     }
      //   }
      // })
    },
    handleClick(tab, event) {},
    /* ----------------------------------------------图片上传------------------------ */
    handleRemove(file, fileList) {

    },
    handlePreview(file) {

    },
    handleExceed(files, fileList) {
      this.$alert(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`).then(() => {
        this.trustedFileNameLists.pop();
        if (this.trustedFileNameLists.length==0) {
          this.btnShow=false;      
        }
      })
    },
    beforeFileUpload(file) { // 上传前格式与大小校验
      // const isJPG = file.type ==  'image/svg '||'image/bmp'||'image/gif'||'image/png' || 'image/jpeg' || 'application/pdf' || 'text/plain' || 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 'application/msword' || 'application/vnd.ms-excel' || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 'audio/ogg' ||'audio/mp3'|| 'audio/mpeg' || 'application/x-shockwave-flash';
      const isLt20G = file.size / 1024 / 1024 /1024 < 20;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      if (!isLt20G) {
        this.$message.error("上传文件大小不能超过 20GB!");
      }
      return isLt20G;      　　  
    },
    handleSuccess(filesponse, size,name) {   // --------------文件上传成功后数据处理----COS
      if (filesponse.statusCode==200) {  // 每个文件上传成功后，将文件名称和大小放入数组中
        let obj={
          name:name,
          size:size
        }
        this.trustedFileNameLists.push(obj);
      }
      if (this.trustedFileNameLists.length==this.fileList.length) {  // 所有文件上传成功后才能提交
        this.$message.success('所有文件均上传成功！');
        this.form.files=this.trustedFileNameLists;
        this.btnShow=true;
      }
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-20); // 最多20个文件
    },
    handProgress(file, fileList) { // 
      this.fileList.forEach((element, index) => {
        if (element.uid === file.uid) {
          // 更新这个uid下的进度
          const progress = Math.floor(element.percent);
          // 防止上传完接口还没有返回成功值，所以此处给定progress的最大值为99，成功的钩子中再置为100
          element.progress = progress === 100 ? 99 : progress;
          this.$set(this.fileList, index, element);
        }
      })
    },
    handleUploadFileToCos(params) {  // -----------文件上传-----COS上传|本地上传，size 单位 Kb 
      let vm=this;
      let file=params.file;
      let dataTime=new Date();
      let fileTypeName=file.name.lastIndexOf('.')!=-1?file.name.substr(file.name.lastIndexOf('.')+1).toLowerCase(): ''; // 文件后缀名
      // const isOfficeFile = (file.type ==  'text/plain') || (file.type=='application/msword') || (file.type=='application/vnd.openxmlformats-officedocument.wordprocessingml.document') || (file.type=='application/vnd.ms-excel') || (file.type=='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      if (fileTypeName && this.fileTypes.indexOf(fileTypeName)!=-1) { // office类型的文件上传到本地
        let formData = new FormData();
        formData.append('upload', file);
          params.onProgress({percent: 0})
        UploadExternalFiles(formData).then(res => {
          let obj={
            name:res,
            size:parseInt(file.size/1024)   
          }
          this.trustedFileNameLists.push(obj);
          if (this.trustedFileNameLists.length==this.fileList.length) {  // 所有文件上传成功后，将
            this.$message.success('所有文件均上传成功！');
            this.form.files=this.trustedFileNameLists;
            this.btnShow=true;
          }
          params.onProgress({percent: 100})
        })
      } else { // 分片上传文件--上传到临时文件夹中  
        this.cos.sliceUploadFile({
          Bucket: this.config.Bucket,
          Region: this.config.Region,
          Key: `TempFiles/${this.formatWholeDate(dataTime.getTime())}_${file.name}`,
          Body: file,
          onHashProgress: function (progressData) {
            // console.log('校验中', JSON.stringify(progressData));
          },
          onProgress: function (progressData) {
            // console.log('上传中', JSON.stringify(progressData));
            params.onProgress({percent: Math.floor(progressData.percent * 100)})
          },
        }, function (err, data) {
          if (data) {
            vm.handleSuccess(data,parseInt(file.size/1024),`${vm.formatWholeDate(dataTime.getTime())}_${file.name}`);
          } else {
            params.onError()
          }
                    
        })
      }
    },
    formatDate(time) {   // 日期时间转换为 yyyymmdd
      let date=new Date(time);
      let y = date.getFullYear();  
      let m = date.getMonth() + 1;  
      m = m < 10 ? ('0' + m) : m;  
      let d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      let h = date.getHours();  
      h=h < 10 ? ('0' + h) : h;  
      let minute = date.getMinutes();  
      minute = minute < 10 ? ('0' + minute) : minute;  
      let second=date.getSeconds();  
      second=second < 10 ? ('0' + second) : second;  
      return y + '' + m + '' + d;  
    }, 
    formatWholeDate(time) {   // 日期时间转换为 YYYYMMDDhhmmss
      let date=new Date(time);
      let y = date.getFullYear();  
      let m = date.getMonth() + 1;  
      m = m < 10 ? ('0' + m) : m;  
      let d = date.getDate();  
      d = d < 10 ? ('0' + d) : d;  
      let h = date.getHours();  
      h=h < 10 ? ('0' + h) : h;  
      let minute = date.getMinutes();  
      minute = minute < 10 ? ('0' + minute) : minute;  
      let second=date.getSeconds();  
      second=second < 10 ? ('0' + second) : second;  
      return y + '' + m + '' + d + '' + h + '' + minute + '' + second ;  
    }, 
    /* -----------------------------------------------------------操作按钮----------------------------------- */
    close() {
      this.$emit('update:visible', false);
      this.$emit('initDataList');
    },
    save (type) {
      if (!this.btnShow) {
        this.$alert('请在文件上传完成后保存');
        return ;
      }
      this.loading=true;
      let len=this.disciplineList.length-1;
      this.form.discipline=this.disciplineList[len];
      // // 将文件从临时文件夹复制到正确路径下： ExternalFiles/20200226/文件名
      // let dirName=`ExternalFiles/${this.formatDate(new Date().toLocaleDateString())}`;
      // let realTrustedFileNameLists= []  
      // this.trustedFileNameLists.forEach(item => {
      //   let obj=Object.assign({},item) // 
      //   let type=item.name.substr(item.name.lastIndexOf(".") + 1).toLowerCase()
      //   let fileTypeName=item.name.lastIndexOf('.')!=-1?item.name.substr(item.name.lastIndexOf(".") + 1).toLowerCase(): ''; // 文件后缀名
      //   if (fileTypeName && this.fileTypes.indexOf(fileTypeName)==-1) { 
      //     let newName=dirName+'/'+item.name; 
      //     obj.name=newName
      //     this.cos.sliceCopyFile({   // 将临时文件复制到正式文件夹中
      //       Bucket: this.config.Bucket,
      //       Region: this.config.Region,
      //       Key: newName, /* 必须 */
      //       CopySource: `${this.config.Bucket}.cos.${this.config.Region}.myqcloud.com/TempFiles/${encodeURIComponent(item.name)}`, /* 必须 */
      //       onProgress:function (progressData) {                     /* 非必须 */
      //         // console.log(JSON.stringify(progressData));
      //       }
      //     },function (err,data) {
      //       // console.log(err || data);
      //     })
      //   }
      //   realTrustedFileNameLists.push(obj)
      // })
      this.$refs.form.validate((valid) => {
        if (!valid) return;        
        let row=this.form
        if (row.id) {
          this.$set(row,'trustedFileName',row.trustedFileNamesSplitByVerticalLine)
          // 修改
          updateResource(row).then(() => {
            this.$message.success('资源修改成功！');
            this.loading=false;
            if (type=='save') {
              this.close();
            } else {
              this.form.trustedFileNamesSplitByVerticalLine='';
              this.fileList= []
              this.trustedFileNameLists= []
            }            
          }).catch(err => { 
            this.loading=false;
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          }) 
        } else { // 创建
          if (this.trustedFileNameLists.length>0) {
            row.files=this.trustedFileNameLists;
          }
          createResource(row).then(() => {
            this.loading=false;
            this.$message.success('资源创建成功！')
            if (type=='save') {
              this.close();
            } else {
              this.form.trustedFileNamesSplitByVerticalLine='';
              this.fileList= []
              this.trustedFileNameLists= []
            }  
          }).catch(err => { 
            this.loading=false;
            this.$message({
              showClose: true,
              message: err.message,
              type: 'error'
            })
          }) 
        }
      })
    },
    savemeta() {
      if (this.mm<0||this.mm>59) {
        this.$alert('提示：学习时长的分钟数 范围是0~59');
        return;
      }
      if (this.ss<0||this.ss>59) {
        this.$alert('提示：学习时长的秒数 范围是0~59');
        return;
      }
      let time=this.hh+': '+this.mm+': '+this.ss;
      this.$set(this.metaForm,'suggestedLearningTime',time)
      this.$refs.metaForm.validate((valid) => {
        if (!valid) return;
        this.$emit('saveMeta', this.metaForm);
        this.close();
      })
    },
    next(name) {
      this.activeName=name;
    }
  }
}
</script>
<style lang="less" scoped>
.txt{
  background: #eee;
  line-height:1.8;
}
/deep/.el-upload {
  text-align:left;
}
/deep/.el-form .el-form-item{
  max-width:100%;
}
.input-div{
  max-width:100%;
  min-width:100px;
  /deep/.el-input__inner{
    padding:0 7px;
  }
  /deep/.el-button{
    padding:12px 7px;
  }
}
/deep/.el-loading-text{
  font-size:1.1rem;
}
</style>
