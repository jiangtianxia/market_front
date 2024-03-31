// pages/cart/cart.js

var util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getAllCartInfo(true)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAllCartInfo(false)
  },

  getAllCartInfo(firstFlag) {
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
      url: 'http://127.0.0.1:8888/market/api/v1/cart/list?openid='+openid,
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '获取购物车信息失败',
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
            title: '获取购物车信息失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        console.log(res.data.data.cart_list)
        that.setData({
          loading: false,  
          totalPrice: res.data.data.total_price,
          isAllSelected: res.data.data.is_all_selected,
          cartList: res.data.data.cart_list
        })
      }
    })
  },

  // 用户点击商品时操作
  toggleSelect(event) {
    const itemId = event.currentTarget.dataset.id;
    let totalPrice = this.data.totalPrice
    let allSelected = true
    let isSelected = 1

    const cartList = this.data.cartList.map(item => {
        if (item.id === itemId) {
          item.is_selected = !item.is_selected;
          if (!item.is_selected) {
            totalPrice -= (item.goods_info.price * item.num)
          } else {
            totalPrice += (item.goods_info.price * item.num)
            isSelected = 2
          }
        }

        if (!item.is_selected) {
          allSelected = false
        }
        return item;
    });
    this.setData({
      cartList: cartList,
      totalPrice: totalPrice,
      isAllSelected: allSelected
    });

    // 发送请求更改后端
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/cart/update',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        openid: util.GetStorageSyncTime("openid"),
        cart_id: itemId,
        is_selected: isSelected
      },
      fail(res) {
        console.error(res)        
      },
      success(res) {}
    })
  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  },

  // 减少选择商品数量
  reduceQuantity(event) {
    const itemId = event.currentTarget.dataset.id; 
    let totalPrice = this.data.totalPrice
    let flag = false
    let updateNum = 0
    const updatedCartList = this.data.cartList.map(item => {
      if (item.id === itemId && item.num > 1) {
        item.num -= 1; 
        flag = true
        updateNum = item.num
        if (item.is_selected) {
          totalPrice -= (item.goods_info.price)
        }
      }
      return item;
    });
  
    this.setData({
      cartList: updatedCartList,
      totalPrice
    });

    if (!flag) {
      return
    }

    // 发送请求更改后端
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/cart/update',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        openid: util.GetStorageSyncTime("openid"),
        cart_id: itemId,
        num: updateNum,
      },
      fail(res) {
        console.error(res)        
      },
      success(res) {}
    })
  },
  
  // 增加选择商品数量
  increaseQuantity(event) {
    const itemId = event.currentTarget.dataset.id;
    let totalPrice = this.data.totalPrice
    let flag = false
    let updateNum = 0
    const updatedCartList = this.data.cartList.map(item => {
      if (item.id === itemId && item.num < item.goods_info.remain_stock) { 
        item.num += 1; 
        flag = true
        updateNum = item.num
        if (item.is_selected) {
          totalPrice += (item.goods_info.price)
        }
      }
      return item;
    });
  
    this.setData({
      cartList: updatedCartList,
      totalPrice
    });

    if (!flag) {
      return
    }

    // 发送请求更改后端
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/cart/update',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        openid: util.GetStorageSyncTime("openid"),
        cart_id: itemId,
        num: updateNum,
      },
      fail(res) {
        console.error(res)        
      },
      success(res) {}
    })
  },

  // 长按商品删除
  longPressToDelete(event) {
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

    const id = event.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要将该商品从购物车移除吗？',
      success: (res) => {
        if (res.confirm) {
          let that = this
          let cartList  = this.data.cartList;

          that.setData({
            deleteing: true,
          });

          // 发送请求将商品从购物车移除
          wx.request({
            method: 'POST',
            url: 'http://127.0.0.1:8888/market/api/v1/cart/delete',
            timeout: 30000,
            header: {
              "Authorization": util.GetStorageSyncTime("token")
            },
            data: {
              openid: util.GetStorageSyncTime("openid"),
              cart_id: id,
            },
            fail(res) {
              that.setData({
                deleteing: false,
              });
              wx.showToast({
                title: '将商品从购物车移除失败',
                icon: 'error',
                duration: 2000
              })
              console.error(res)        
            },
            success(res) {
              if (res.data.code != 0) {
                that.setData({
                  deleteing: false,
                });
                wx.showToast({
                  title: '将商品从购物车移除失败',
                  icon: 'error',
                  duration: 2000
                })
                console.error(res) 
                return
              }
      
              let newCartList = []
              let newTotalPrice = that.data.totalPrice
              for (let item of cartList) {
                if (item.id == id) {
                  if (item.is_selected) {
                    newTotalPrice -= (item.goods_info.price * item.num)
                  }
                  continue
                }
                newCartList.push(item)
              }  
              that.setData({
                deleteing: false,
                cartList: newCartList,
                totalPrice: newTotalPrice
              });
              wx.showToast({
                title: '将商品从购物车移除失败',
                icon: 'success'
              });
            }
          })
        }
      }
    });
  },

  // 全选按钮
  toggleAllSelect() {
    // 反转 isAllSelected 的值
    this.setData({
      isAllSelected: !this.data.isAllSelected
    });

    // 金额变更
    let currTotalPrice = 0

    console.log(this.data.cartList)

    // 将列表中每个元素的 isSelected 属性设置为 isAllSelected
    const cartList = this.data.cartList.map(item => {
      if (this.data.isAllSelected) {
        currTotalPrice += (item.goods_info.price * item.num)
      }
      return {
        ...item,
        is_selected: this.data.isAllSelected
      };
    });

    this.setData({
      cartList: cartList,
      totalPrice: currTotalPrice
    });

    let that = this
    // 发送请求更改后端
    wx.request({
      method: 'POST',
      url: 'http://127.0.0.1:8888/market/api/v1/cart/update',
      timeout: 30000,
      header: {
        "Authorization": util.GetStorageSyncTime("token")
      },
      data: {
        openid: util.GetStorageSyncTime("openid"),
        All_selected_flag: true,
        is_all_selected: that.data.isAllSelected
      },
      fail(res) {
        console.error(res)        
      },
      success(res) {}
    })
  },

  // 提交结算, 跳转订单页面
  toOrder() {
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
    let goodsList = []
    let deleOrderList = []
    for (let item of that.data.cartList) {
      if (item.is_selected) {
        goodsList.push({
          id: item.goods_info.id,
          num: item.num
        })
        deleOrderList.push(item)
      }
    }  

    if (goodsList.length == 0) {
      return
    }

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
        goods_list: goodsList,
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
        
        for (let item of deleOrderList) {
          // 移除购物车记录
          wx.request({
            method: 'POST',
            url: 'http://127.0.0.1:8888/market/api/v1/cart/delete',
            timeout: 30000,
            header: {
              "Authorization": util.GetStorageSyncTime("token")
            },
            data: {
              openid: util.GetStorageSyncTime("openid"),
              cart_id: item.id,
            },
            fail(res) {
              console.error(res)        
            },
            success(res) {
            }
          })     
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