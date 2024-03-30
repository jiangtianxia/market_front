// pages/address/address_list/address_list.js
var util = require('../../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressesList: [],
    currSelectAddrId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAddrList(true)
  },

  onShow(){
    this.getAddrList(false)
  },

  // 获取地址列表
  getAddrList(firstFlag) {
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

    // 发起请求获取全部地址
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/addr/list?openid='+openid,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取地址列表失败',
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
            title: '获取地址列表失败',
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
          addressesList: res.data.data.addr_list,
        })
      }
    })
  },

  // 选择地址
  toggleSelect(event) {
    for (let item of this.data.addressesList) {
      if (item.id == event.currentTarget.dataset.addressId) {
        // 设置缓存
        util.SetStorageSyncSecond("select-address", item, 1000*6)
        break
      }
    }

    // 回退上一步
    wx.navigateBack({
      delta: 1
    });
  },
})