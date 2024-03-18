// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: [
      {
        productId: 1,
        img: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
        name: "可口可乐",
        price: 10.00,
        goodsNumber: 2,
        service: 1,
      },
      {
        productId: 2,
        img: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
        name: "辣条",
        price: 20.00,
        goodsNumber: 1,
        service: 0,
      }
    ],
    totalPrice: 30.00,
    totalCount: 100,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
  },

  // 用户点击"收货地址", 选择地址
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/address/address_list/address_list',
    })
    console.log("选择地址")
    this.setData({
      addressInfo: {
        consignee: "张三",
        phoneHidden: "137*****273",
        addressSummary: "广东省深圳市南山区"
      }
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

  // 提交订单
  submitOrder() {
    wx.showModal({
      title: '提示',
      content: '是否支付商品价格' + this.data.totalPrice + '元',
      confirmText: '支付',
      complete: (res) => {
        if (res.confirm == true) {
          wx.navigateBack({
            delta: 0,
            success(){
              wx.showToast({
                title: '支付成功',
              })
            }
          })
        } else {
          wx.navigateBack({
            delta: 0,
            success(){
              wx.showToast({
                icon: 'error',
                title: '支付失败',
              })
            }
          })
        }
      }
    })
  }
})