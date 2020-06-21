"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageSize = exports.pageSizes = exports.baseURL = exports.MessageURl = exports.fileURl = void 0;
// 请求接口的前缀路径
// export const baseURL = '__BASE_URL__'
var fileURl = '__FILE_URL__'; // 文件预览地址

exports.fileURl = fileURl;
var MessageURl = '__MESSAGE_URL__'; // 短信策略地址

exports.MessageURl = MessageURl;
var baseURL = 'http://ets.gd'; // export const baseURL = 'http://3e14583x13.zicp.vip'
// export const fileURl = 'https://ets.gedewisdom.com' // 文件预览地址
// // export const MessageURl = 'https://msg.gedewisdom.com' // 短信策略地址
// export const MessageURl = 'http://dev.api.msg.gedewisdom.com' // 短信策略地址
// 页码数

exports.baseURL = baseURL;
var pageSizes = [10, 20, 50]; // 页码数数组

exports.pageSizes = pageSizes;
var pageSize = 10; // 默认页码数

exports.pageSize = pageSize;