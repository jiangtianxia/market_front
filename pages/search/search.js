Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: "",
    hotKeywordList: [],
    isShow: true,

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
    // 如果需要展示后台数据，可以在此处修改
    // wx.request({
    //   url: util.url+'/dataInfo/Goods/hotKeywords',
    //   success:res=>{
    //     console.log(res.data)
    //     if(res.data.status===200){
    //       this.setData({
    //         contentList:res.data.data
    //       })
    //     }
    //   }
    // })
    this.setData({
      hotKeywordList: [
        { id: 1, text: "热门搜索词1" },
        { id: 2, text: "热门搜索词2" },
        // 其他热门搜索词...
      ]
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("上拉触底了")
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

    // 如果搜索关键字为空，且热门关键字列表不为空，则使用第一个热门关键字作为搜索关键字
    if (keyword == "" && this.data.hotKeywordList.length > 0) {
      keyword = this.data.hotKeywordList[0].text;
      this.setData({
        keyword: keyword
      });
    }

    // 执行搜索逻辑
    this.search(keyword);
  },

  // 执行搜索逻辑
  search(keyword) {
    this.setData({isShow: false})

    if (keyword == "a") {
      this.setData({
        goodList: [
          {
            id: 1,
            cover: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
            title: "可口可乐",
            buyersCount: 100,
            price: 5
          },
        ]
      })
    }

    if (keyword == "b") {
      this.setData({
        goodList: [
          {
            id: 2,
            cover: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F06820af6-efe6-4eac-8045-1a90b89518e2%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712291909&t=454ad935b2f5ed12aad11173cb5dabb7",
            title: "小面包",
            buyersCount: 150, 
            price: 10
          },
          {
            id: 3,
            cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
            title: "辣条",
            buyersCount: 200,
            price: 3
          },
          {
            id: 4,
            cover: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F06820af6-efe6-4eac-8045-1a90b89518e2%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712291909&t=454ad935b2f5ed12aad11173cb5dabb7",
            title: "小面包",
            buyersCount: 150, 
            price: 10
          },
          {
            id: 5,
            cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
            title: "辣条",
            buyersCount: 200,
            price: 3
          },
          {
            id: 6,
            cover: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F06820af6-efe6-4eac-8045-1a90b89518e2%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712291909&t=454ad935b2f5ed12aad11173cb5dabb7",
            title: "小面包",
            buyersCount: 150, 
            price: 10
          },
          {
            id: 7,
            cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
            title: "辣条",
            buyersCount: 200,
            price: 3
          },
          {
            id: 8,
            cover: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F06820af6-efe6-4eac-8045-1a90b89518e2%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712291909&t=454ad935b2f5ed12aad11173cb5dabb7",
            title: "小面包",
            buyersCount: 150, 
            price: 10
          },
          {
            id: 9,
            cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
            title: "辣条",
            buyersCount: 200,
            price: 3
          },
          {
            id: 10,
            cover: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F06820af6-efe6-4eac-8045-1a90b89518e2%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712291909&t=454ad935b2f5ed12aad11173cb5dabb7",
            title: "小面包",
            buyersCount: 150, 
            price: 10
          },
          {
            id: 11,
            cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
            title: "辣条",
            buyersCount: 200,
            price: 3
          }
        ]
      })
    }
  },

  // 点击"热门搜索文字"时, 搜索商品
  hotKeywords(e) {
    let keyword = e.currentTarget.dataset.text;
    this.setData({
      keyword: keyword
    })
    this.search(keyword);
  },

  // 切换"排序"规则时, 执行相关操作
  toggleSortOrder(event) {
    const newType = event.currentTarget.dataset.type;
    const currType = this.data.selectedSortOrder;
    const currArrowIcon = this.data.selectedSortOrderArrowIcon;
    const downArrowIcon = this.data.downArrowIcon;
    const upArrowIcon = this.data.upArrowIcon;
  
    let priceIcon = this.data.normalArrowIcon;
    let timeIcon = this.data.normalArrowIcon;
  
    // 如果选中的类型为"热门推荐", 则将图标修改回初始化状态
    if (newType === 'hot') {
      this.setData({
        selectedSortOrder: newType,
        selectedSortOrderArrowIcon: 'normal',
        currUseArrowIcons: {
          price: priceIcon,
          time: timeIcon
        }
      });
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
  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  }
})
