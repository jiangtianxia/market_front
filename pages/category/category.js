// pages/category/category.js
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

      // 商品列表部分
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
    const index = categoryIndexMap[category] || 0;
  
    // 设置数据
    this.setData({
      selectedCategoryIndex: index,
      selectedSortOrder: 'hot',
      selectedSortOrderArrowIcon: 'normal',
      currUseArrowIcons: {
        price: this.data.normalArrowIcon,
        time: this.data.normalArrowIcon
      }
    });
  },  

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("上拉触底了")
  },

  // 选择"类型"时, 相关操作
  selectCategory(event) {
    const index = event.currentTarget.dataset.index;

    // 先修改数据
    this.setData({
      selectedCategoryIndex: index,
      selectedSortOrder: 'hot',
      selectedSortOrderArrowIcon: 'normal',
      currUseArrowIcons: {
        price: this.data.normalArrowIcon,
        time: this.data.normalArrowIcon
      }
    });

    // 获取商品数据
    console.log(this.data.categories[this.data.selectedCategoryIndex])
    // 根据选择的类别索引获取对应的商品数据
    // 这里需要根据具体情况编写获取商品数据的逻辑
    // 假设这里是根据类别索引请求后台接口获取商品数据
    // 暂时先留空，待后续完善
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