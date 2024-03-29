// 通过 npm 安装 sdk npm：install cos-wx-sdk-v5
// SECRETID 和 SECRETKEY 请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
// 建议使用临时密钥调用小程序 SDK，通过临时授权的方式进一步提高 SDK 使用的安全性。
// 申请临时密钥时，请遵循 最小权限指引原则，防止泄露目标存储桶或对象之外的资源。
// 如果您一定要使用永久密钥，建议遵循 最小权限指引原则 对永久密钥的权限范围进行限制。
// 使用临时秘钥请参考文档：https://cloud.tencent.com/document/product/436/11459
// 最小权限原则说明 https://cloud.tencent.com/document/product/436/38618
const COS = require('../cos-wx-sdk-v5/cos-wx-sdk-v5.min');

const COSSDK = new COS({
  SimpleUploadMethod: 'putObject', // 强烈建议，高级上传、批量上传内部对小文件做简单上传时使用putObject,sdk版本至少需要v1.3.0
  getAuthorization: function (options, callback) {
    // 先获取openid
    let openid = GetStorageSyncTime("openid")
    if (openid == "") {
      return
    }

    // 发起请求获取临时密钥信息
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/file/credential?openid='+openid,
      header: {
        "Authorization": GetStorageSyncTime("token")
      },
      success(res) {
        if (res.code == 0) {
          console.log("get credntial error", res.message)
          flag = true
          return
        }
        callback({
          TmpSecretId: res.data.data.tmp_secret_id,
          TmpSecretKey: res.data.data.tmp_secret_key,
          SecurityToken: res.data.data.session_token,
          StartTime: res.data.data.start_time,
          ExpiredTime: res.data.data.expired_time,  
        });
      }
    })
    sleep(10)
  }
});

function sleep (delay) {
  var start = (new Date()).getTime();

  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}

const COSBucket = 'market-1310814941' // 存储桶名称
const COSRegion= 'ap-guangzhou' // 存储桶所在地域

module.exports = {
  GetCOSSDK,
  GetCOSBucket,
  GetCOSRegion
}

function GetCOSSDK() {
  return COSSDK
}

function GetCOSBucket() {
  return COSBucket
}

function GetCOSRegion() {
  return COSRegion
}

/**
 * 读取时效缓存
 *  key  存储的key值
 * return 返回有值则有效期未过，返回空字符串证明有效期过了、或者该值已不存在
 */
function GetStorageSyncTime(key){
  var deadtime = wx.getStorageSync(key + 'dtime')
  if (deadtime) {
    if (deadtime < new Date().getTime() ) {
      wx.removeStorageSync(key)
      wx.removeStorageSync(key + 'dtime')
      return ""
    }else{
      if (wx.getStorageSync(key)) {
        return wx.getStorageSync(key)
      }
      return ""
     }
  }else{
    return ""
  }
}
