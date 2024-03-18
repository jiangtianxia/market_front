// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: {
      show: false,
      line: false,
      avatar: '/images/default_avatar.jpg',
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 登录监听
  chooseAvatar(e) {
    console.log(e)
    this.setData({
      login: {
        show: true,
        line: true,
        avatar: e.detail.avatarUrl,
      }
    })
  },

  // 登录
  login() {
    
  },


  // 退出监听
  exitClick() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定退出登录吗？',
      success(res) {
        if (res.confirm) {
          that.setData({
            login: {
              show: false,
              avatar: '/images/default_avatar.jpg',
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