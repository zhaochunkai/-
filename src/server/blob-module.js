import http from './blob-http'

/* ------------------------------ 二进制文件下载 ------------------------------------- */
// 文件下载
export const DownloadExternalFiles = (fileName) => http(`/Api/ExternalFiles/Download?fileName=${fileName}`, {})
