// pages/address/address.js
var util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressesList: [],
    loading : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAddrList(true)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
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

  // 选择默认地址
  toggleSelect(event) {
    let addressId = event.currentTarget.dataset.addressId

    // 更新默认地址
    let that = this

    // 更新默认地址
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/addr/set-default',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        openid: util.GetStorageSyncTime("openid"),
        addr_id: addressId
      },
      fail(res) {
        wx.showToast({
          title: '设置默认地址失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        if (res.data.code != 0) {
          wx.showToast({
            title: '设置默认地址失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }
        that.getAddrList(false)
      }
    })
  },

  // 编辑地址
  editAddress(event) {
    // 设置缓存
    console.log(event)

    for (let item of this.data.addressesList) {
      if (item.id == event.currentTarget.dataset.addressId) {
        // 设置缓存
        util.SetStorageSyncSecond("edit-address", item, 1000*6)
        break
      }
    }
    wx.navigateTo({
      url: '/pages/address/address_edit/address_edit',
    })
  },

  // 删除地址
  deleteAddress(event) {
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
    
    let addressId = event.currentTarget.dataset.addressId
    
    wx.showModal({
      title: '提示',
      content: '确认删除地址吗',
      confirmText: '确认'
    })
    .then(res=>{
      if(res.confirm == true) {
        let that = this
        that.setData({
          deleteing: true,
        });
        

        // 删除地址
        wx.request({
          method: 'POST',
          url: 'http://127.0.0.1:8888/market/api/v1/addr/delete',
          timeout: 30000,
          header: {
            "Authorization": util.GetStorageSyncTime("token")
          },
          data: {
            openid: util.GetStorageSyncTime("openid"),
            addr_id: addressId
          },
          fail(res) {
            that.setData({
              deleteing: false,
            });
            wx.showToast({
              title: '删除地址失败',
              icon: 'error',
              duration: 2000
            })
            console.error(res)        
          },
          success(res) {
            if (res.data.code != 0) {
              wx.showToast({
                title: '删除地址失败',
                icon: 'error',
                duration: 2000
              })
              that.setData({
                deleteing: false,
              });
              console.error(res) 
              return
            }
            that.setData({
              deleteing: false,
            });
            that.getAddrList(false)
          }
        })     
      } else {
        wx.showToast({
          icon: 'error',
          title: '删除地址失败',
        })
      }
    })
  },
})