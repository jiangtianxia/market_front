// pages/address/address_list/address_list.js
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
    currSelectAddrId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  // 选择地址
  toggleSelect(event) {
    let addressId = event.currentTarget.dataset.addressId

    this.setData({
      currSelectAddrId: addressId
    })
  },
})