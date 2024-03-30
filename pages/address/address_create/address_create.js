// pages/address/address_create/address_create.js
var util = require('../../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 输入收货人
  inputConsignee: function (e) {
    this.setData({
      consignee: e.detail.value
    });
  },

  // 输入手机号
  inputPhone(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 输入地址
  inputAddress(e) {
    this.setData({
      address: e.detail.value
    });
  },

  // 点击发布"按钮"
  submitForm() {
    // 判断是否登录
    let openid = util.GetStorageSyncTime("openid")
    if (openid == "") {
        wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      return 
    }

    let that = this
    that.setData({
      loading: true,
    });

    // 发起请求创建地址
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/addr/create',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        openid: openid,
        consignee: that.data.consignee,
        phone: that.data.phone,
        address: that.data.address
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '新增地址失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        if (res.data.code != 0) {
          that.setData({
            loading: false,
          });
          wx.showToast({
            title: '新增地址失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        wx.showToast({
          title: '新增地址成功',
          icon: 'success',
          duration: 2000
        })

        that.setData({
          loading: false,      
          consignee: "",
          phone: "",
          address: ""
        })

        wx.navigateBack({
          delta: 1
        });
      }
    })
  }
})