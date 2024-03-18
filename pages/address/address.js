// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressesList: [
      {
        consignee: "张三",
        mobile: "13812345678",
        lareaName: "北京市朝阳区",
        address: "朝阳路123号",
        address_id: "1",
        is_default: false,
      },
      {
        consignee: "李四",
        mobile: "13987654321",
        lareaName: "上海市浦东新区",
        address: "浦东大道456号",
        address_id: "2",
        is_default: true,
      }
    ],
    loading : false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 选择默认地址
  toggleSelect(event) {
    let addressId = event.currentTarget.dataset.addressId
    
    // 更新 addressesList 数组
    this.setData({
      addressesList: this.data.addressesList.map(item => ({
        ...item,
        is_default: item.address_id === addressId
      }))
    });
  },

  // 编辑地址
  editAddress(event) {
    wx.navigateTo({
      url: '/pages/address/address_edit/address_edit',
    })
  },

  // 删除地址
  deleteAddress(event) {
    let addressId = event.currentTarget.dataset.addressId
    
    wx.showModal({
      title: '提示',
      content: '确认删除地址吗',
      confirmText: '确认'
    })
    .then(res=>{
      if(res.confirm == true) {
        wx.showToast({
          title: '删除成功',
        })        
      } else {
        wx.showToast({
          icon: 'error',
          title: '删除失败',
        })
      }
    })
  },
})