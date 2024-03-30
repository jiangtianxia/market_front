
var util = require('../../utils/utils.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    hotKeywordList: [],
    isShow: true,
    currPage: 1,
    PageSize: 4,
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
  onLoad: function (options) {
    // this.setData({
    //   hotKeywordList: [
    //     { id: 1, text: "热门搜索词1" },
    //     { id: 2, text: "热门搜索词2" },
    //     // 其他热门搜索词...
    //   ]
    // })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.isShow) {
      return
    }

    this.setData({
      loading: true,
    });

    // 执行搜索逻辑
    let that = this
    let where = "name:" + that.data.keyword

    // 发起请求获取数据
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+that.data.currPage+"&page_size="+that.data.PageSize+"&where="+where+"&order="+that.data.currOrder+"&sort="+that.data.currSort,
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

        // 设置数据
        that.setData({
          loading: false,
          currPage: that.data.currPage+1,
          goodsList: res.data.data.goods_list
        });
      }
    })
  },

  // 在"搜索栏"添加搜索值时, 设置对应关键字
  searchKeywords(e) {
    console.log(e.detail.value)
    this.setData({
      keyword: e.detail.value
    })
  },

  // 点击"搜索"时, 搜索商品
  searchBtn() {
    let keyword = this.data.keyword;

    if (keyword.length == 0) {
      wx.showToast({
        title: '请输入关键词',
        icon: 'none',
        duration: 2000
      })      
      return
    }

    this.setData({
      currPage: 1,
      isShow: false,
      loading: true,
    });

    // 执行搜索逻辑
    let that = this
    let where = "name:" + keyword

    // 发起请求获取数据
    wx.request({
      method: 'GET',
      url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+that.data.currPage+"&page_size="+that.data.PageSize+"&where="+where+"&order="+that.data.currOrder+"&sort="+that.data.currSort,
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

        // 设置数据
        that.setData({
          loading: false,
          currPage: that.data.currPage+1,
          goodsList: res.data.data.goods_list
        });
      }
    })
  },

  // 点击"热门搜索文字"时, 搜索商品
  hotKeywords(e) {
    // let keyword = e.currentTarget.dataset.text;
    // this.setData({
    //   keyword: keyword
    // })
    // this.search(keyword);
  },

  // 切换"排序"规则时, 执行相关操作
  toggleSortOrder(event) {
    let that = this
    that.setData({
      loading: true,
      emptyGoodsFlag: false
    });
    const newType = event.currentTarget.dataset.type;
    const currType = that.data.selectedSortOrder;
    const currArrowIcon = that.data.selectedSortOrderArrowIcon;
    const downArrowIcon = that.data.downArrowIcon;
    const upArrowIcon = that.data.upArrowIcon;
  
    let priceIcon = that.data.normalArrowIcon;
    let timeIcon = that.data.normalArrowIcon;
    let KeyWhere = "name:" + that.data.keyword

    // 如果选中的类型为"热门推荐", 则将图标修改回初始化状态
    if (newType === 'hot') {
      let newOrder = "buy_count"
      let newSort = -1
      let newPage = 1


      // 发起请求获取数据
      wx.request({
        method: 'GET',
        url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+newPage+"&page_size="+that.data.PageSize+"&where="+KeyWhere+"&order="+newOrder+"&sort="+newSort,
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
      url: 'http://127.0.0.1:8888/market/api/v1/goods/search?page='+newPage+"&page_size="+that.data.PageSize+"&where="+KeyWhere+"&order="+newOrder+"&sort="+newSort,
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

    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  }
})
