// pages/good_detail/good_detail.js
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
    console.log(options)
    // 根据商品id, 获取商品详细信息
    this.setData({
      good: {
        id: 1,
        cover: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
        price: 5,
        buyersCount: 100,
        title: "可口可乐",
        describe: "可口可乐公司为中国消费者带来全品类饮料选择,提供20多个品牌、约100多种产品。 探索我们的品牌 水资源战略 2014年起至今,可口可乐中国每年均实现了100%“水回馈”的目标。",
        describeImages: [
          "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
          "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500"
        ]
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