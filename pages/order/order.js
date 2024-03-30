// pages/order/order.js

var util = require('../../utils/utils.js')

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
  onLoad() {},

  onShow() {
    // 先获取缓存
    let addr = util.GetStorageSyncTime("select-address")
    util.DelStorageSyncTime("select-address")
    if (addr) {
      this.setData({
        loading: false,      
        addressInfo: addr,
      })     
      return
    }

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
    // 获取默认收货地址
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/addr/get-default?openid='+openid,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取默认地址失败',
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
            title: '获取默认地址失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        if (!res.data.data) {
          that.setData({
            loading: false,
          })
          return
        }

        that.setData({
          loading: false,      
          addressInfo: res.data.data,
        })
      }
    })
  },

  // 用户点击"收货地址", 选择地址
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/address/address_list/address_list',
    })
  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
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