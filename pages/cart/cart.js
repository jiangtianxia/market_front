// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartItems: [
      {
        id: 1,
        title: "可口可乐",
        cover: "https://img2.baidu.com/it/u=4188744940,4267781379&fm=253&fmt=auto&app=138&f=JPEG?w=785&h=500",
        stock: 10,
        price: 5,
        quantity: 10,
        isSelected: true
      },
      {
        id: 2,
        title: "小面包",
        cover: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F06820af6-efe6-4eac-8045-1a90b89518e2%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712291909&t=454ad935b2f5ed12aad11173cb5dabb7",
        stock: 666,
        price: 10,
        quantity: 1,
        isSelected: true
      },
      {
        id: 3,
        title: "辣条",
        cover: "http://t15.baidu.com/it/u=2032395722,4214994189&fm=224&app=112&f=JPEG?w=500&h=500",
        stock: 150,
        price: 3,
        quantity: 6,
        isSelected: true  
      },
    ],
    totalPrice: 898899888,
    isAllSelected: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  // 用户点击商品时操作
  toggleSelect(event) {
    const itemId = event.currentTarget.dataset.id;
    const cartItems = this.data.cartItems.map(item => {
        if (item.id === itemId) {
            item.isSelected = !item.isSelected;
        }
        return item;
    });
    this.setData({
      cartItems: cartItems
    });
  },

  // 点击"商品", 跳转至商品详细信息页
  toGoodDetail(event) {
    console.log(event.currentTarget.dataset.id)
    let id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?id=' + id,
    })
  },

  // 减少选择商品数量
  reduceQuantity(event) {
    const itemId = event.currentTarget.dataset.id; 
    const updatedCartItems = this.data.cartItems.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        item.quantity -= 1; 
      }
      return item;
    });
  
    this.setData({
      cartItems: updatedCartItems
    });
  },
  
  // 增加选择商品数量
  increaseQuantity(event) {
    const itemId = event.currentTarget.dataset.id;
    const updatedCartItems = this.data.cartItems.map(item => {
      if (item.id === itemId && item.quantity < item.stock) { 
        item.quantity += 1; 
      }
      return item;
    });
  
    this.setData({
      cartItems: updatedCartItems
    });
  },

  // 长按商品删除
  longPressToDelete(event) {
    const id = event.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要将该商品从购物车移除吗？',
      success: (res) => {
        if (res.confirm) {
          const { cartItems } = this.data;
          const index = cartItems.findIndex(item => item.id === id);
          if (index !== -1) {
            // 找到对应商品并删除
            cartItems.splice(index, 1);
            this.setData({
              cartItems: cartItems
            });
            wx.showToast({
              title: '删除成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '未找到商品',
              icon: 'none'
            });
          }
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

    // 将列表中每个元素的 isSelected 属性设置为 isAllSelected
    const cartItems = this.data.cartItems.map(item => {
      return {
        ...item,
        isSelected: this.data.isAllSelected
      };
    });

    this.setData({
      cartItems: cartItems
    });
  },

  // 提交结算
  submit() {

  }
})