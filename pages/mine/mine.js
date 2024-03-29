// pages/mine/mine.js
var util = require('../../utils/utils.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: {
      show: false,
      line: false,
      avatar: '/images/default_avatar.jpg',
    },
    logining : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      logining : false
    })
    const avatarUrl = util.GetStorageSyncTime("avatar_url");
    if (avatarUrl != "") {
      this.setData({
        login: {
          show: true,
          line: true,
          avatar: avatarUrl,
        }
      })
    }
    console.log(util.GetStorageSyncTime("token"))
    console.log(util.GetStorageSyncTime("openid"))
  },

  // 登录监听
  chooseAvatar(e) {
    let that = this
    that.setData({
      logining: true
    })

    wx.login({
      success (res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            method: 'POST',
            url: 'http://127.0.0.1:8888/market/api/v1/user/login',
            data: {
              code: res.code
            },
            success(res) {
              // 判断登录是否成功
              if (res.data.code !== 0) {
                that.setData({
                  logining: false
                })

                // 显示错误提示
                wx.showToast({
                  title: res.data.message || '登录失败',
                  icon: 'error',
                  duration: 2000
                })
                return
              }

              // 登录成功，获取具体数据
              const { openid, token } = res.data.data;

              // 设置头像
              util.SetStorageSyncSecond("avatar_url", e.detail.avatarUrl, )

              // 设置openid
              util.SetStorageSyncSecond("openid", openid, )

              // 设置token缓存
              util.SetStorageSyncSecond("token", token, )              

              // 设置头像
              that.setData({
                login: {
                  show: true,
                  line: true,
                  avatar: e.detail.avatarUrl,
                },
                logining: false
              })
            }
          })   
          return
        }
        return
      }
    })
  },


  // 退出监听
  exitClick() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          const openid = util.GetStorageSyncTime("openid")

          if (openid == "") {
            that.setData({
              login: {
                show: false,
                avatar: '/images/default_avatar.jpg',
              }
            })
            return
          }

          // 发起请求
          wx.request({
            method: 'POST',
            url: 'http://127.0.0.1:8888/market/api/v1/user/logout',
            data: {
              openid: openid
            },
            success(res) {
              // 判断退出是否成功
              if (res.data.code !== 0) {
                // 显示错误提示
                wx.showToast({
                  title: res.data.message || '退出失败',
                  icon: 'error',
                  duration: 2000
                })
                return
              }

              // 删除缓存
              util.DelStorageSyncTime("avatar_url")
              util.DelStorageSyncTime("openid")
              util.DelStorageSyncTime("token")         

              // 设置默认头像
              that.setData({
                login: {
                  show: false,
                  avatar: '/images/default_avatar.jpg',
                }
              })
            }
          })   
        }
      }
    })
  },

  // 跳转"我的订单"页面
  toMyOrder() {
    wx.navigateTo({
      url: '/pages/mine/my_order/my_order',
    })
  },

  // 跳转"我的发布"页面
  toMyRelease() {
    wx.navigateTo({
      url: '/pages/mine/my_release/my_release',
    })
  },

  // 跳转"商家订单"页面
  toSellerOrder() {
    wx.navigateTo({
      url: '/pages/mine/seller_order/seller_order',
    })
  },

  // 跳转"地址管理"页面
  toAddress() {
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
})