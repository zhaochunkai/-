
import { MessageBox } from 'element-ui'
import { getTempFileUploadToken } from '@/server/online-module';
import { getPreviewFile } from '@/server/files-module';
import filter from '@/utils/filter.js'
var COS = require('cos-js-sdk-v5')  // 引入COS

const config={
  Bucket : sessionStorage.getItem('TenancyId')+'-1301412513',
  Region : 'ap-chengdu'
}
let that=this;


// // 创建全局COS对象
// function initial_cos () {
//   if(!cosExpireTime || cosExpireTime<new Date()) {
//     console.log('程序调用')
//     getTempFileUploadToken().then(res => {  // 获取上传的token等参数
//       cosExpireTime=new Date(res.expireTime*1000)
//       return cos = new COS({
//         getAuthorization: function (options, callback) {                          
//           callback({
//             TmpSecretId: res.tempAppId,
//             TmpSecretKey: res.tempAppSecret,
//             XCosSecurityToken:  res.tempToken,
//             StartTime:  res.startTimestamp, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
//             ExpiredTime: res.endTimestamp, // 时间戳，单位秒，如：1580000900
//           })              
//         }
//       })
//     })
//   }
// }
const globalCosObj={
  cos: '',
  cosExpireTime: '',
  // 初始化COS实例
  initial_cos () {
    if(!this.cosExpireTime || this.cosExpireTime<new Date()) {
      getTempFileUploadToken().then(res => {  // 获取上传的token等参数
        this.cosExpireTime=new Date(res.expireTime*1000)
        this.cos = new COS({
          getAuthorization: function (options, callback) {                          
            callback({
              TmpSecretId: res.tempAppId,
              TmpSecretKey: res.tempAppSecret,
              XCosSecurityToken:  res.tempToken,
              StartTime:  res.startTimestamp, // 时间戳，单位秒，如：1580000000，建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              ExpiredTime: res.endTimestamp, // 时间戳，单位秒，如：1580000900
            })              
          }
        })
        return this.cos;
      })
    }
  },
  // 下载文件  
  downloadCosFile(trustedFileName,title) {
    this.initial_cos()
    setTimeout(() => {
      getPreviewFile(trustedFileName).then(res => {  // 获取本地资源并预览
        console.log(res)
        if(res.domainName) {   
          this.cos.getObject({
            Bucket: config.Bucket, /* 必须 */
            Region: config.Region,     /* 存储桶所在地域，必须字段 */
            Key: res.filePath,              /* 必须 */
          }, function(err, data) {
            if(!err) {
              filter.downloadBlobFile(data.Body,title)
            }
          })
        }
      }).catch(err => { 
        MessageBox({
          showClose: true,
          message: err.message,
          type: 'error'
        })
      })       
    },300) 
  },

}
export default {
  // Vue.js的插件应当有一个公开方法 install。这个方法的第一个参数是 Vue 构造器，第二个参数是一个可选的选项对象。
  install: function (Vue) {
    // Vue.prototype.globle_cos = () => initial_cos()
    Vue.prototype.globle_cos = () => globalCosObj
  }
}