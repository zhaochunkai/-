import http from "./http"
import { MessageURl } from "../config"

// 获取短信中心配置参数
export const getMsgConfiguration = () => http('/Api/Sms/Configuration', {})
/* ------------------------------------- 短信 ------------------------------------- */
// 短信条数支付策略
export const getMsgPayStrategy = (data) => http(MessageURl+'/SmsPayStrategy', data)
// 根据短信策略Id获得微信支付二维码
export const getMsgPayStrategyCode = (id) => http(MessageURl+'/SmsOrder/PayQrCode?payStrategyId='+id, {})
// 短信余量
export const getSurplusMessage = () => http(MessageURl+'/SmsUserWallet/ForThirdParty', {})
// 短信充值记录
export const getMsgOrdersRecord = (data) => http(MessageURl+'/SmsOrder', data)
// 短信推送记录
export const getMsgSendStatistics = () => http('/Api/Sms/SendStatistics', {})
// 根据日期获取短信失败详情
export const getFailedSmsByStartTime = (startTime) => http('/Api/Sms/FailedSms?startTime='+startTime, {})