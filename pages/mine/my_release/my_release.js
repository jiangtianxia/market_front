// pages/mine/my_release/my_release.js

var util = require('../../../utils/utils.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    goodsList: [],
    showAddStockModal: false,
    stockToAdd: 0,
    currentIndex: null,
    currPage: 1,
    PageSize: 3,
    loading: false,
    emptyGoodsFlag: false,
    adding: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 发起请求获取信息
    let that = this
    that.setData({
      status: 0,
      currPage: 1,
      loading: true,
    })
    let openid = util.GetStorageSyncTime("openid")
    if (openid == "") {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      return 
    }

    // 发起请求
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/publish-list?openid='+openid+'&goods_status='+
      that.data.status+'&page='+that.data.currPage+'&page_size='+that.data.PageSize,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取我的发布失败',
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
            title: '获取我的发布失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        that.setData({
          loading: false,
          currPage: that.data.currPage+1,
          goodsList: res.data.data.goods_list,
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    // 发起请求获取信息
    let that = this
    that.setData({
      loading: true,
    })
    let openid = util.GetStorageSyncTime("openid")
    if (openid == "") {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
      return 
    }

    // 发起请求
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/publish-list?openid='+openid+'&goods_status='+
      that.data.status+'&page='+that.data.currPage+'&page_size='+that.data.PageSize,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取我的发布失败',
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
            title: '获取我的发布失败',
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
          })
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
          currPage: that.data.currPage+1,          
          goodsList: currGoodsList,
        })
      }
    })
  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
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
      url: '/pages/good_detail/good_detail?id=' + id + '&isShow=-1',
    })
  },

  // 选择订单类型
  chooseType(event) {
    let status = event.currentTarget.dataset.index
    this.setData({
      status,
      currPage: 1,
      loading: true,
    })
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
    // 发起请求
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/publish-list?openid='+openid+'&goods_status='+
      that.data.status+'&page='+that.data.currPage+'&page_size='+that.data.PageSize,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取我的发布失败',
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
            title: '获取我的发布失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        if (!res.data.data) {
          that.setData({
            loading: false,
            emptyGoodsFlag: true,
            goodsList: []
          })
          return
        }

        that.setData({
          loading: false,
          currPage: that.data.currPage+1,
          goodsList: res.data.data.goods_list,
        })
      }
    })
  },

  // 修改信息
  editGood(event) {
    let index = event.currentTarget.dataset.index

    wx.navigateTo({
      url: '/pages/mine/my_release/edit_good/edit_good?id=' + this.data.goodsList[index].id,
    })
  },

  // 下架商品
  takeOffGood(event) {
    let index = event.currentTarget.dataset.index   

    wx.showModal({
      title: '提示',
      content: '是否下架此商品',
      confirmText: '确认'
    })
    .then(res=>{
      if(res.confirm == true) {
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
          takeoffing: true,
        });
        // 发起请求
        wx.request({
          method: 'POST',
          url: 'http://127.0.0.1:8888/market/api/v1/goods/taskoff',
          header: {
            "Authorization": util.GetStorageSyncTime("token")
          },
          data: {
            openid: util.GetStorageSyncTime("openid"),
            goods_id: that.data.goodsList[index].id,
          },
          fail(res) {
            that.setData({
              takeoffing: false,
            });
            wx.showToast({
              title: '下架商品失败',
              icon: 'error',
              duration: 2000
            })
            console.error(res)        
          },
          success(res) {
            // 发布失败
            if (res.data.code != 0) {
              that.setData({
                takeoffing: false,
              });
              wx.showToast({
                title: '下架商品失败',
                icon: 'error',
                duration: 2000
              })
              console.error(res)
              return
            }
            if (res.data.code == 2) {
              that.setData({
                takeoffing: false,
              });
              wx.showToast({
                title: '该商品仍有订单, 无法下架',
                icon: 'error',
                duration: 2000
              })
              console.error(res)
              return              
            }
            wx.showToast({
              title: '下架商品成功',
              icon: 'success',
              duration: 2000
            })
            let currGoodsList = that.data.goodsList
            let newGoodsList = []
            for (let item of currGoodsList) {
              if (item.id != that.data.goodsList[index].id) {
                newGoodsList.push(item)
              }
            }
            that.setData({
              takeoffing: false,
              goodsList: newGoodsList,
            });
          }
        })   
      } else {
        wx.showToast({
          icon: 'error',
          title: '下架商品失败',
        })
      }
    })
  },

  // 添加库存
  addStock(event) {
    let index = event.currentTarget.dataset.index   
    this.setData({
      showAddStockModal: true,
      currentIndex: index,
      stockToAdd: 0
    });
  },

 // 输入框输入事件
  handleInput(event) {
    const stockToAdd = event.detail.value;
    this.setData({ stockToAdd });
  },

  // 确认添加库存
  confirmAddStock() {
    const { currentIndex, stockToAdd } = this.data;

    wx.showModal({
      title: '提示',
      content: '是否新增库存, 新增库存数量: ' + stockToAdd,
      confirmText: '确认'
    })
    .then(res=>{
      if(res.confirm == true) {
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
          adding: true,
        });
        // 发起请求
        wx.request({
          method: 'POST',
          url: 'http://127.0.0.1:8888/market/api/v1/goods/add-stock',
          header: {
            "Authorization": util.GetStorageSyncTime("token")
          },
          data: {
            openid: util.GetStorageSyncTime("openid"),
            goods_id: that.data.goodsList[currentIndex].id,
            add_stock_count: parseInt(stockToAdd-'0')
          },
          fail(res) {
            that.setData({
              adding: false,
            });
            wx.showToast({
              title: '添加库存失败',
              icon: 'error',
              duration: 2000
            })
            console.error(res)        
          },
          success(res) {
            // 发布失败
            if (res.data.code != 0) {
              that.setData({
                adding: false,
              });
              wx.showToast({
                title: '添加库存失败',
                icon: 'error',
                duration: 2000
              })
              console.error(res)
              return
            }

            let currGoodsList = that.data.goodsList
            let newGoodsList = []
            for (let item of currGoodsList) {
              if (item.id == that.data.goodsList[currentIndex].id) {
                if (that.data.status != 1) {
                  item.stock = item.stock+parseInt(stockToAdd-'0')
                  item.remain_stock = item.remain_stock+parseInt(stockToAdd-'0')
                  newGoodsList.push(item)
                }
              } else {
                newGoodsList.push(item)
              }
            }
            that.setData({
              adding: false,
              goodsList: newGoodsList,
              stockToAdd: 0,
            });
            wx.showToast({
              title: '库存添加成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: '库存添加失败',
        })
      }
    })

    // 添加完库存后关闭模态框
    this.closeAddStockModal();
  },

  // 关闭添加库存模态框
  closeAddStockModal() {
    this.setData({
      showAddStockModal: false,
      currentIndex: null,
      stockToAdd: 0
    });
  }
})