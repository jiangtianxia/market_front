// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo: {
      consignee: "张三",
      phoneHidden: "138****5678",
      addressSummary: "广东省深圳市南山区"
    },
    goods: [
      {
        productId: 1,
        img: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
        name: "可口可乐",
        specs: "规格：500ml",
        price: 10.00,
        goodsNumber: 2,
        service: 1,
      },
      {
        productId: 2,
        img: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
        name: "辣条",
        specs: "规格：50g",
        price: 20.00,
        goodsNumber: 1,
        service: 0,
      }
    ],
    amountTotal: 30.00,
    isLoading: true,
    xToast: {
      show: false,
      icon: "success",
      title: "订单提交成功"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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

  }
})