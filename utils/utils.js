const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  SetStorageSyncSecond,
  GetStorageSyncTime,
  DelStorageSyncTime
}

  /**
 * 设置时效缓存
 * key    存储的key值
 * value  存储的value值 (不填则默认为1)
 * time   有效时间，（单位：毫秒，不填则默认一天）
 */
function SetStorageSyncSecond(key, value, time) {
  value = value ? value : 1
  wx.setStorageSync(key, value)
  let t = time ? time : 86400000
  if (t > 0) { 
    wx.setStorageSync(key + 'dtime', t + new Date().getTime())
  } else {
    wx.removeStorageSync(key)
  }
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

/**
 * 删除时效缓存
 *  key  删除的key值
 */
function DelStorageSyncTime(key){
  wx.removeStorageSync(key)
  wx.removeStorageSync(key + 'dtime')
}