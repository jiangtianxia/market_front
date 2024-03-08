// pages/index/index.js
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
    ]
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取商品列表
    this.getGoodList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("上拉触底了")
  },

  // 获取商品列表
  getGoodList() {
    this.setData({
      goodList: [
        {
          id: 1,
          cover: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
          title: "可口可乐",
          buyersCount: 100,
          price: 5
        },
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
        }
      ],
    })
  },

  // 点击"新品推荐", 跳转事件
  toNewGoodList() {
    console.log('点击了新品推荐');

    // 设置全局变量
    getApp().globalData.category = 'newGood';

    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  // 点击"二手书籍", 跳转事件
  toOldBookGoodList() {
    console.log('点击了二手书籍');

    // 设置全局变量
    getApp().globalData.category = 'oldBookGood';

    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  // 点击"日常用品", 跳转事件
  toDailyGoodList() {
    console.log('点击了日常用品');

    // 设置全局变量
    getApp().globalData.category = 'dailyGood';

    wx.switchTab({
      url: '/pages/category/category',
    });
  },

  // 点击"其他物品", 跳转事件
  toOtherGoodList() {
    console.log('点击了其他物品');
    
    // 设置全局变量
    getApp().globalData.category = 'otherGood';

    wx.switchTab({
      url: '/pages/category/category',
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