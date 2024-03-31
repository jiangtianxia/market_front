// pages/good_detail/good_detail.js

var util = require('../../utils/utils.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    goodsId: 0,
    isShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    let goodsId = options.id
    let isShow = options.isShow

    that.setData({
      goodsId: parseInt(goodsId), 
      isShow: isShow != '-1'
    })

    that.getGoodsInfo(true)
  },

  // 获取商品信息
  getGoodsInfo(flag) {
    let that = this
    if (flag) {
      that.setData({
        loading: true,
      });
    }

    let openid = util.GetStorageSyncTime("openid")
    // 发起请求
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/detail?openid='+openid+"&goods_id="+that.data.goodsId,
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
  },

  // 点击"购物车", 跳转购物车页面
  toCart() {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },

  // 点击"加入购物车", 将商品加入购物车
  addToCart() {
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
    
    // 判断该商品是否存在于购物车
    if (this.data.goods.is_in_cart) {
      wx.showToast({
        title: '该商品已在购物车当中',
        icon: 'none',
        duration: 2000
      })
      return
    }

    let that = this
    that.setData({
      adding: true,
    });

    // 发起请求, 将商品添加至购物车
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/cart/add',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        goods_id: that.data.goodsId,
        openid: util.GetStorageSyncTime("openid"),
      },
      fail(res) {
        that.setData({
          adding: false,
        });
        wx.showToast({
          title: '加入购物车失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        if (res.data.code != 0) {
          that.setData({
            adding: false,
          });
          wx.showToast({
            title: '加入购物车失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        let currGoods = that.data.goods
        currGoods.cart_total_count += 1
        currGoods.is_in_cart = true
        that.setData({
          adding: false,   
          goods: currGoods,   
        })
        wx.showToast({
          title: '加入购物车成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  ToOrder() {
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
      createing: true,
    });

    // 发起请求,创建订单
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/order/create',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        openid: util.GetStorageSyncTime("openid"),
        goods_list: [{
          id: that.data.goodsId,
          num: 1,
        }],
      },
      fail(res) {
        that.setData({
          createing: false,
        });
        wx.showToast({
          title: '订单创建失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        if (res.data.code == 2) {
          that.setData({
            createing: false,
          });
          wx.showToast({
            title: '有商品库存不足',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }
        if (res.data.code == 3) {
          that.setData({
            createing: false,
          });
          wx.showToast({
            title: '有商品已下架',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return          
        }

        if (res.data.code != 0) {
          that.setData({
            createing: false,
          });
          wx.showToast({
            title: '订单创建失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        that.setData({
          createing: false,
        })

        wx.navigateTo({
          url: '/pages/order/order?orderIdList='+res.data.data.order_id_list,
        })
      }
    })
  }
})