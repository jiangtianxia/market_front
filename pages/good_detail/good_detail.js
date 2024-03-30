// pages/good_detail/good_detail.js

var util = require('../../utils/utils.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    // 获取openid与商品id
    let openid = util.GetStorageSyncTime("openid")
    let goodsId = options.id

    that.setData({
      loading: true,
    });

    // 发起请求
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/detail?openid='+openid+"&goods_id="+goodsId,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取商品详细信息失败',
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
            title: '获取商品详细信息失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        that.setData({
          loading: false,
          goods: res.data.data,
        })
      }
    })
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
   * 用户点击右上角分享-分享给好友
   */
  onShareAppMessage() {
    return{
      title: this.data.good.title,
      path: '/pages/good_detail/good_detail?id=' + this.data.good.id,
      imageUrl: this.data.good.cover
    }
  },

  /**
   * 用户点击右上角分享-分享到朋友圈
   */
  onShareTimeline() {
    return{
      title: this.data.good.title,
      query: {
        id: this.data.good.id
      },
      imageUrl: this.data.good.cover
    }
  }
})