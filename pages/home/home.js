// pages/index/index.js

var util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 轮播图配置数据
     */
    // indicatorDots: true, // 是否显示面板指示点
    // autoplay: true, // 是否自动切换
    // interval: 3000, // 自动切换时间间隔
    // duration: 500, // 滑动动画时长
    // 轮播图图片地址数组
    imageUrls: [ 
      '/images/home/swiper.jpg',
      // '/images/home/image.png',
      // '/images/home/image.png'
    ],
    loading: false,
    goodsList: [],
    currPage: 0,
    PageSize: 2,
    lastLoadTime: Date.parse(new Date())/1000,
    emptyGoodsFlag: false
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 判断是否需要重新加载
    let that = this
    if (Date.parse(new Date())/1000>that.data.lastLoadTime+30) {
      that.setData({
        loading: true,
        currPage: 0,
        lastLoadTime: Date.parse(new Date())/1000,
        emptyGoodsFlag: false
      })

      wx.request({
        method: 'GET',
        url: 'http://127.0.0.1:8888/market/api/v1/goods/hot-recommend?page='+that.data.currPage+"&page_size="+that.data.PageSize,
        timeout: 30000,
        fail(res) {
          that.setData({
            loading: false,
          });
          wx.showToast({
            title: '获取热门推荐商品失败',
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
              title: '获取热门推荐商品失败',
              icon: 'error',
              duration: 2000
            })
            console.error(res) 
            return
          }
  
          if (!res.data.data) {
            that.setData({
              loading: false,
              emptyGoodsFlag: true
            });
            return
          }
  
          that.setData({
            loading: false,
            goodsList: res.data.data.goods_list,
            currPage: res.data.data.page + 1   
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取商品列表
    let that = this 
    that.setData({
      loading: true,
    })

    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/hot-recommend?page='+that.data.currPage+"&page_size="+that.data.PageSize,
      timeout: 30000,
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取热门推荐商品失败',
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
            title: '获取热门推荐商品失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        if (!res.data.data) {
          that.setData({
            loading: false,
            emptyGoodsFlag: true
          });
          return
        }

        that.setData({
          loading: false,
          goodsList: res.data.data.goods_list,
          currPage: res.data.data.page + 1   
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 获取商品列表
    let that = this 
    that.setData({
      loading: true,
    })
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/hot-recommend?page='+that.data.currPage+"&page_size="+that.data.PageSize,
      timeout: 30000,
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取热门推荐商品失败',
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
            title: '获取热门推荐商品失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        if (res.data.data == null) {
          that.setData({
            loading: false,
            emptyGoodsFlag: true
          });
          return
        }

        let currGoodsList = that.data.goodsList
        let mp = new Map()
        for (let item of currGoodsList) {
          mp.set(item.id)
        }

        for (let item of res.data.data.goods_list) {
          if (!mp.has(item.id)) {
            currGoodsList.push(item)
          }
        }

        that.setData({
          loading: false,
          goodsList: currGoodsList,
          currPage: res.data.data.page + 1  
        })
      }
    })
  },

  // 点击"新品推荐", 跳转事件
  toNewGoodList() {
    // 设置全局变量
    getApp().globalData.category = 'newGood';

    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  // 点击"二手书籍", 跳转事件
  toOldBookGoodList() {
    // 设置全局变量
    getApp().globalData.category = 'oldBookGood';

    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  // 点击"日常用品", 跳转事件
  toDailyGoodList() {
    // 设置全局变量
    getApp().globalData.category = 'dailyGood';

    wx.switchTab({
      url: '/pages/category/category',
    });
  },

  // 点击"其他物品", 跳转事件
  toOtherGoodList() {    
    // 设置全局变量
    getApp().globalData.category = 'otherGood';

    wx.switchTab({
      url: '/pages/category/category',
    });
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
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  }
})