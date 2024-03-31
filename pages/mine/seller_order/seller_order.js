// pages/mine/seller_order/seller_order.js

var util = require('../../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 2,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getOrderList(true)
    this.setData({
      status: 2
    })
  },

  onShow() {
    this.getOrderList(false)
  },

  // 获取订单列表
  getOrderList(firstFlag) {
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

    if (firstFlag) {
      that.setData({
        loading: true,
      });
    }

    // 发起请求获取全部购物车信息
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/order/list?from_openid='+openid +'&status=' + that.data.status,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取订单信息失败',
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
            title: '获取订单信息失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        console.log(res.data)
        that.setData({
          loading: false,  
          orderList: res.data.data.order_list
        })
      }
    })
  },

  // 选择订单类型
  chooseType(event) {
    let status = event.currentTarget.dataset.type
    this.setData({
      status
    })
    this.getOrderList(true)
  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id + '&isShow=-1',
    })
  },

  // 更新订单状态
  updateOrder(orderId, status) {
    // 修改订单的收货地址
    let that = this
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
    that.setData({
      updateing: true,
    });
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/order/update',
      timeout: 30000,
      data: {
        order_id_list: orderId,
        status_update_flag: true,
        status: status,
        curr_status: that.data.status
      },
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          updateing: false,
        });
        wx.showToast({
          title: '更新订单失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        if (res.data.code != 0) {
          that.setData({
            updateing: false,
          });
          wx.showToast({
            title: '更新订单失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        // 移除对应订单
        let newOrderList = []
        for (let item of that.data.orderList) {
          if (item.order_id != orderId) {
            newOrderList.push(item)
          }
        } 
        wx.showToast({
          title: '更新订单成功',
        }) 
        that.setData({
          updateing: false,
          orderList: newOrderList
        })
      }
    })
  },

  // 已发货
  sendGoods(event) {
    let index = event.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '是否已发货该订单中的商品',
      confirmText: '已发货'
    })
    .then(res=>{
      if(res.confirm == true) {
        this.updateOrder(this.data.orderList[index].order_id, 3)
      } else {
        wx.showToast({
          icon: 'error',
          title: '更新订单失败',
        })
      }
    })
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
        this.updateOrder(this.data.orderList[index].order_id, 5) 
      } else {
        wx.showToast({
          icon: 'error',
          title: '更新订单失败',
        })
      }
    })
  },
})