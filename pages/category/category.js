// pages/category/category.js

var util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      /**
       * 商品类型数据
       */
      categories: ["新品推荐", "二手书籍", "日常用品", "其他物品"],
      selectedCategoryIndex: 0,
      currPage: 1,
      PageSize: 4,
      CurrCategoryWhere: "",
      currOrder: "buy_count",
      currSort: -1,
      loading: false,

      /**
       * 排序规则数据
       */
      selectedSortOrder: 'hot',
      normalArrowIcon: '/images/up-and-down.png',
      downArrowIcon: '/images/down.png',
      upArrowIcon: '/images/up.png',
      selectedSortOrderArrowIcon: 'normal',
      currUseArrowIcons: {
        price: '/images/up-and-down.png',
        time: '/images/up-and-down.png',
      },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      loading: true,
      emptyGoodsFlag: false
    });

    // 在目标页面中获取全局变量
    const category = getApp().globalData.category;
    getApp().globalData.category = '';
  
    // 定义不同分类对应的索引
    const categoryIndexMap = {
      newGood: 0,
      oldBookGood: 1,
      dailyGood: 2,
      otherGood: 3,
    };
  
    // 获取索引值，如果不存在则默认为0
    let cIndex = categoryIndexMap[category] || 0;
    let that = this
    let currPage = 1
    let order = "buy_count"
    let sort = -1
    let where = ""
    if (cIndex == 1) {
      where = "category:二手书籍"
    }
    if (cIndex == 2) {
      where = "category:日常用品"
    }    
    if (cIndex == 3) {
      where = "category:其他物品"
    }

    // 发起请求获取数据
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+currPage+"&page_size="+that.data.PageSize+"&where="+where+"&order="+order+"&sort="+sort,
      timeout: 30000,
      fail(res) {
        that.setData({
          loading: false,
          currPage: currPage,
          CurrCategoryWhere: where,
          currOrder: order,
          currSort: sort,
          selectedCategoryIndex: cIndex,
          selectedSortOrder: 'hot',
          selectedSortOrderArrowIcon: 'normal',
          currUseArrowIcons: {
            price: that.data.normalArrowIcon,
            time: that.data.normalArrowIcon
          },
        });
        wx.showToast({
          title: '查询商品失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        console.log(res)
        if (res.data.code != 0) {
          that.setData({
            loading: false,
            currPage: currPage,
            CurrCategoryWhere: where,
            currOrder: order,
            currSort: sort,
            selectedCategoryIndex: cIndex,
            selectedSortOrder: 'hot',
            selectedSortOrderArrowIcon: 'normal',
            currUseArrowIcons: {
              price: that.data.normalArrowIcon,
              time: that.data.normalArrowIcon
            },
          });
          wx.showToast({
            title: '查询商品失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        if (!res.data.data) {
          that.setData({
            loading: false,
            currPage: currPage+1,
            CurrCategoryWhere: where,
            currOrder: order,
            currSort: sort,
            selectedCategoryIndex: cIndex,
            selectedSortOrder: 'hot',
            selectedSortOrderArrowIcon: 'normal',
            currUseArrowIcons: {
              price: that.data.normalArrowIcon,
              time: that.data.normalArrowIcon
            },
            goodsList: [],
            emptyGoodsFlag: true
          });
          return
        }

        // 设置数据
        that.setData({
          loading: false,
          currPage: currPage+1,
          CurrCategoryWhere: where,
          currOrder: order,
          currSort: sort,
          selectedCategoryIndex: cIndex,
          selectedSortOrder: 'hot',
          selectedSortOrderArrowIcon: 'normal',
          currUseArrowIcons: {
            price: that.data.normalArrowIcon,
            time: that.data.normalArrowIcon
          },
          goodsList: res.data.data.goods_list
        });
      }
    })
  },  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    let that = this
    that.setData({
      loading: true,
    });

    // 发起请求获取数据
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+that.data.currPage+"&page_size="+that.data.PageSize+"&where="+that.data.CurrCategoryWhere+"&order="+that.data.currOrder+"&sort="+that.data.currSort,
      timeout: 30000,
      fail(res) {
        that.setData({
          loading: false,
        });
        wx.showToast({
          title: '查询商品失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        console.log(res)
        if (res.data.code != 0) {
          that.setData({
            loading: false,
          });
          wx.showToast({
            title: '查询商品失败',
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

        // 设置数据
        that.setData({
          loading: false,
          currPage: that.data.currPage+1,
          goodsList: currGoodsList
        });
      }
    })    
  },

  // 选择"类型"时, 相关操作
  selectCategory(event) {
    const index = event.currentTarget.dataset.index;
    let that = this

    that.setData({
      loading: true,
      emptyGoodsFlag: false
    })

    let currPage = 1
    let order = "buy_count"
    let sort = -1
    let where = ""
    if (index == 1) {
      where = "category:二手书籍"
    }
    if (index == 2) {
      where = "category:日常用品"
    }    
    if (index == 3) {
      where = "category:其他物品"
    }

    // 发起请求获取数据
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+currPage+"&page_size="+that.data.PageSize+"&where="+where+"&order="+order+"&sort="+sort,
      timeout: 30000,
      fail(res) {
        that.setData({
          loading: false,
          currPage: currPage,
          CurrCategoryWhere: where,
          currOrder: order,
          currSort: sort,
          selectedCategoryIndex: index,
          selectedSortOrder: 'hot',
          selectedSortOrderArrowIcon: 'normal',
          currUseArrowIcons: {
            price: that.data.normalArrowIcon,
            time: that.data.normalArrowIcon
          },
        });
        wx.showToast({
          title: '查询商品失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        console.log(res)
        if (res.data.code != 0) {
          that.setData({
            loading: false,
            currPage: currPage,
            CurrCategoryWhere: where,
            currOrder: order,
            currSort: sort,
            selectedCategoryIndex: index,
            selectedSortOrder: 'hot',
            selectedSortOrderArrowIcon: 'normal',
            currUseArrowIcons: {
              price: that.data.normalArrowIcon,
              time: that.data.normalArrowIcon
            },
          });
          wx.showToast({
            title: '查询商品失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        if (!res.data.data) {
          that.setData({
            loading: false,
            currPage: currPage+1,
            CurrCategoryWhere: where,
            currOrder: order,
            currSort: sort,
            selectedCategoryIndex: index,
            selectedSortOrder: 'hot',
            selectedSortOrderArrowIcon: 'normal',
            currUseArrowIcons: {
              price: that.data.normalArrowIcon,
              time: that.data.normalArrowIcon
            },
            goodsList: [],
            emptyGoodsFlag: true
          });
          return
        }

        // 设置数据
        that.setData({
          loading: false,
          currPage: currPage+1,
          CurrCategoryWhere: where,
          currOrder: order,
          currSort: sort,
          selectedCategoryIndex: index,
          selectedSortOrder: 'hot',
          selectedSortOrderArrowIcon: 'normal',
          currUseArrowIcons: {
            price: that.data.normalArrowIcon,
            time: that.data.normalArrowIcon
          },
          goodsList: res.data.data.goods_list
        });
      }
    })
  },

  // 切换"排序"规则时, 执行相关操作
  toggleSortOrder(event) {
    let that = this
    that.setData({
      loading: true,
    });
    const newType = event.currentTarget.dataset.type;
    const currType = that.data.selectedSortOrder;
    const currArrowIcon = that.data.selectedSortOrderArrowIcon;
    const downArrowIcon = that.data.downArrowIcon;
    const upArrowIcon = that.data.upArrowIcon;
  
    let priceIcon = that.data.normalArrowIcon;
    let timeIcon = that.data.normalArrowIcon;
  
    // 如果选中的类型为"热门推荐", 则将图标修改回初始化状态
    if (newType === 'hot') {
      let newOrder = "buy_count"
      let newSort = -1
      let newPage = 1

      // 发起请求获取数据
      wx.request({
        method: 'GET',
        url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+newPage+"&page_size="+that.data.PageSize+"&where="+that.data.CurrCategoryWhere+"&order="+newOrder+"&sort="+newSort,
        timeout: 30000,
        fail(res) {
          that.setData({
            loading: false,
            currPage: newPage,
            currOrder: newOrder,
            currSort: newSort,
            selectedSortOrder: newType,
            selectedSortOrderArrowIcon: 'normal',
            currUseArrowIcons: {
              price: priceIcon,
              time: timeIcon
            }
          });
          wx.showToast({
            title: '查询商品失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res)        
        },
        success(res) {
          console.log(res)
          if (res.data.code != 0) {
            that.setData({
              loading: false,
              currPage: newPage,
              currOrder: newOrder,
              currSort: newSort,
              selectedSortOrder: newType,
              selectedSortOrderArrowIcon: 'normal',
              currUseArrowIcons: {
                price: priceIcon,
                time: timeIcon
              }
            });
            wx.showToast({
              title: '查询商品失败',
              icon: 'error',
              duration: 2000
            })
            console.error(res) 
            return
          }

          if (!res.data.data) {
            that.setData({
              loading: false,
              currPage: newPage+1,
              currOrder: newOrder,
              currSort: newSort,
              selectedSortOrder: newType,
              selectedSortOrderArrowIcon: 'normal',
              currUseArrowIcons: {
                price: priceIcon,
                time: timeIcon
              },
              goodsList: [],
              emptyGoodsFlag: true
            });
            return
          }

          // 设置数据
          that.setData({
            loading: false,
            currPage: newPage+1,
            currOrder: newOrder,
            currSort: newSort,
            selectedSortOrder: newType,
            selectedSortOrderArrowIcon: 'normal',
            currUseArrowIcons: {
              price: priceIcon,
              time: timeIcon
            },
            goodsList: res.data.data.goods_list
          });
        }
      })      
      return;
    }
  
    // 判断新选中类型是否和当前选中类型相同
    const isSelectedTypeSame = currType === newType;
  
    // 设置箭头图标和排序类型
    const newArrowIcon = isSelectedTypeSame ? (currArrowIcon === 'down' ? 'up' : 'down') : 'down';
    const selectedTypeArrowIcon = isSelectedTypeSame ? newArrowIcon : 'down';
  
    // 根据新选中的类型设置箭头图标
    if (newType === 'price') {
      priceIcon = newArrowIcon === 'down' ? downArrowIcon : upArrowIcon;
    } else {
      timeIcon = newArrowIcon === 'down' ? downArrowIcon : upArrowIcon;
    }
  
    this.setData({
      selectedSortOrder: newType,
      selectedSortOrderArrowIcon: selectedTypeArrowIcon,
      currUseArrowIcons: {
        price: priceIcon,
        time: timeIcon
      }
    });

    let newOrder = newType == 'price' ? newType : 'created_at'
    let newSort = newArrowIcon === 'down' ? -1 : 1
    let newPage = 1

    // 发起请求获取数据
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+newPage+"&page_size="+that.data.PageSize+"&where="+that.data.CurrCategoryWhere+"&order="+newOrder+"&sort="+newSort,
      timeout: 30000,
      fail(res) {
        that.setData({
          loading: false,
          currPage: newPage,
          currOrder: newOrder,
          currSort: newSort,
        });
        wx.showToast({
          title: '查询商品失败',
          icon: 'error',
          duration: 2000
        })
        console.error(res)        
      },
      success(res) {
        console.log(res)
        if (res.data.code != 0) {
          that.setData({
            loading: false,
            currPage: newPage,
            currOrder: newOrder,
            currSort: newSort,
          });
          wx.showToast({
            title: '查询商品失败',
            icon: 'error',
            duration: 2000
          })
          console.error(res) 
          return
        }

        if (!res.data.data) {
          that.setData({
            loading: false,
            currPage: newPage,
            currOrder: newOrder,
            currSort: newSort,
            emptyGoodsFlag: true
          });
          return
        }

        // 设置数据
        that.setData({
          loading: false,
          currPage: newPage+1,
          currOrder: newOrder,
          currSort: newSort,
          goodsList: res.data.data.goods_list
        });
      }
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
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  }
})