// pages/mine/my_release/my_release.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,
    goods: [
      {
        id: 1,
        cover: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
        title: "可口可乐",
        number: 10,
        price: 5,
        address: "广东省广州市番禺区",
        name: "张三",
        phone: "127823792300",
        time: "2024-03-17 10:30:04",
        stock: 1,
      },
      {
        id: 2,
        cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
        title: "辣条",
        number: 20,
        price: 3,
        address: "广东省广州市番禺区",
        name: "张三",
        phone: "127823792300",
        time: "2024-03-17 10:30:04",
        stock: 10,
      },          
    ],
    showAddStockModal: false,
    stockToAdd: 0,
    currentIndex: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  },

  // 选择订单类型
  chooseType(event) {
    let status = event.currentTarget.dataset.type
    this.setData({
      status
    })
  },

  // 修改信息
  editGood(event) {
    let index = event.currentTarget.dataset.index

    wx.navigateTo({
      url: '/pages/mine/my_release/edit_good/edit_good',
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
        wx.showToast({
          title: '下架成功',
        })        
      } else {
        wx.showToast({
          icon: 'error',
          title: '下架失败',
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
    console.log('商品索引:', currentIndex);
    console.log('待添加的库存数量:', stockToAdd);

    wx.showModal({
      title: '提示',
      content: '是否新增库存, 新增库存数量: ' + stockToAdd,
      confirmText: '确认'
    })
    .then(res=>{
      if(res.confirm == true) {
        wx.showToast({
          title: '新增成功',
        })        
      } else {
        wx.showToast({
          icon: 'error',
          title: '新增失败',
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