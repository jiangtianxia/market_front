// pages/mine/seller_order/seller_order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    orderList: [
      {
        id: 15237723784,
        totalMoney: 100,
        address: "广东省广州市番禺区",
        name: "张三",
        phone: "127823792300",
        time: "2024-03-17 10:30:04",
        status: 2,
        goods: [
          {
            id: 1,
            cover: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
            title: "可口可乐",
            number: 10,
            price: 5
          },
          {
            id: 2,
            cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
            title: "辣条",
            number: 20,
            price: 3
          },          
        ]
      },
      {
        id: 15237723786,
        totalMoney: 60,
        address: "广东省广州市番禺区",
        name: "张三",
        phone: "127823792300",
        time: "2024-03-17 10:30:04",
        status: 3,
        goods: [
          {
            id: 1,
            cover: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F06820af6-efe6-4eac-8045-1a90b89518e2%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712291909&t=454ad935b2f5ed12aad11173cb5dabb7",
            title: "小面包",
            number: 10,
            price: 6
          },
          {
            id: 2,
            cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
            title: "辣条",
            number: 20,
            price: 3
          },          
        ]
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 获取订单列表
  getOrderList() {

  },

  // 选择订单类型
  chooseType(event) {
    let status = event.currentTarget.dataset.type
    this.setData({
      status
    })
  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  },

  // 支付订单
  pay(event) {
    let index = event.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否支付商品价格' + this.data.orderList[index].totalMoney + '元',
      confirmText: '支付'
    })
    .then(res=>{
      if(res.confirm == true) {
        wx.showToast({
          title: '支付成功',
        })        
      } else {
        wx.showToast({
          icon: 'error',
          title: '支付失败',
        })
      }
    })

    this.getOrderList()
  },

  // 取消订单
  cancelOrder(event) {
    let index = event.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否取消此订单',
      confirmText: '确认'
    })
    .then(res=>{
      if(res.confirm == true) {
        wx.showToast({
          title: '取消成功',
        })        
      } else {
        wx.showToast({
          icon: 'error',
          title: '取消失败',
        })
      }
    })

    this.getOrderList()
  },

  // 已收货
  confirmReceipt(event) {
    let index = event.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认已收货吗',
      confirmText: '确认'
    })
    .then(res=>{
      if(res.confirm == true) {
        wx.showToast({
          title: '保存成功',
        })        
      } else {
        wx.showToast({
          icon: 'error',
          title: '保存失败',
        })
      }
    })

    this.getOrderList()
  },
})