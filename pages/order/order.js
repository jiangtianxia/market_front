// pages/order/order.js

var util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
      loading: true,
      orderIdList: options.orderIdList
    });

    // 发送请求获取订单信息
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/order/detail?openid='+openid+'&order_id_list='+options.orderIdList,
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

        // 计算合计与总件数
        let totalPrice = 0.00
        let totalCount = 0

        for (let item of res.data.data.order_list) {
          totalCount += item.goods_num
          totalPrice += (item.goods_info.price * item.goods_num)
        }

        that.setData({
          loading: false,      
          addressInfo: res.data.data.order_list[0].address_info,
          orderList: res.data.data.order_list,
          totalCount,
          totalPrice
        })
      }
    })    
  },

  onShow() {
    // 先获取缓存
    let addr = util.GetStorageSyncTime("select-address")
    util.DelStorageSyncTime("select-address")
    if (addr) {
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
          order_id_list: that.data.orderIdList,
          openid: openid,
          address_update_flag: true,
          address: addr.address,
          phone: addr.phone,
          consignee: addr.consignee
        },
        header: {
          "Authorization": util.GetStorageSyncTime("token")
        },
        fail(res) {
          that.setData({
            updateing: false,
          });
          wx.showToast({
            title: '更新订单地址失败',
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
              title: '更新订单地址失败',
              icon: 'error',
              duration: 2000
            })
            console.error(res) 
            return
          }
  
          that.setData({
            updateing: false,
            addressInfo: addr,
          })
        }
      })
    }
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

    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id + '&isShow=-1',
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
          // 更新数据库订单状态
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
            submiting: true,
          });
          wx.request({
            method: 'POST',
            url: 'http://127.0.0.1:8888/market/api/v1/order/update',
            timeout: 30000,
            data: {
              order_id_list: that.data.orderIdList,
              openid: openid,
              status_update_flag: true,
              status: 2,
            },
            header: {
              "Authorization": util.GetStorageSyncTime("token")
            },
            fail(res) {
              that.setData({
                submiting: false,
              });
              wx.showToast({
                title: '支付失败',
                icon: 'error',
                duration: 2000
              })
              console.error(res)        
            },
            success(res) {
              if (res.data.code != 0) {
                that.setData({
                  submiting: false,
                });
                wx.showToast({
                  title: '支付失败',
                  icon: 'error',
                  duration: 2000
                })
                console.error(res) 
                return
              }
      
              that.setData({
                submiting: false,
              })
            }
          })

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