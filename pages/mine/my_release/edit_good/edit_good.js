// pages/mine/my_release/edit_good/edit_good.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    description: '',
    price: '',
    stock: '',
    coverUrl: '',
    descriptionImagesUrl: [],
    maxDescImageCount: 9,
    selectedCategory: '',
    categoryOptions: ['二手书籍', '日常用品', '其他物品'],
    contact: '',
    phone: ''
  },

  // 输入商品名称
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 选择分类
  selectCategory(event) {
    const index = event.detail.value;
    const selectedCategory = this.data.categoryOptions[index];
    this.setData({
      selectedCategory: selectedCategory,
    });
  },

  // 输入价格
  inputPrice: function (e) {
    let value = e.detail.value;
    let reg = /^\d+(\.\d{0,2})?$/;
    if (!reg.test(value)) {
      value = value.substring(0, value.indexOf('.') + 3);
    }
    this.setData({
      price: value
    });
  },

  // 输入库存
  inputStock: function (e) {
    this.setData({
      stock: e.detail.value
    });
  },

  // 输入描述
  inputDescription: function (e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 输入联系人姓名
  inputContact(event) {
    this.setData({
      contact: event.detail.value
    });
  },

  // 输入联系电话
  inputPhone(event) {
    const inputPhoneNumber = event.detail.value;
  
    // 判断电话号码长度是否超过11
    if (inputPhoneNumber.length > 11) {
      // 如果超过11，则截取前11位
      const truncatedPhoneNumber = inputPhoneNumber.slice(0, 11);
  
      this.setData({
        phone: truncatedPhoneNumber
      });
      return
    } 

    // 如果未超过11，则直接更新数据
    this.setData({
      phone: inputPhoneNumber
    });
  },

  // 选择封面图片
  chooseCoverImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          coverUrl: tempFilePath
        });
      }
    });
  },

  // 移除封面图片
  removeCoverImage() {
    this.setData({
      coverUrl: ''
    });
  },

  // 选择描述图片
  chooseDescImages() {
    const currLen = this.data.descriptionImagesUrl.length
    if (currLen == this.data.maxDescImageCount) {
      return
    }

    wx.chooseMedia({
      count: this.data.maxDescImageCount-currLen,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFiles = res.tempFiles;
        const currImg = this.data.descriptionImagesUrl;

        for (let i = 0; i < tempFiles.length; i++) {
          currImg.push(tempFiles[i].tempFilePath)
        }
        this.setData({
          descriptionImagesUrl: currImg
        });
      }
    });
  },

  // 移除描述图片
  removeDescImage(e) {
    const index = e.currentTarget.dataset.index;
    const currImg = this.data.descriptionImagesUrl;
    currImg.splice(index, 1);
    this.setData({
      descriptionImagesUrl: currImg
    });
  },

  // 发布商品
  submitForm() {
    // 在此处执行提交表单的逻辑，上传商品信息到服务器等
    console.log('提交表单:', this.data);
    const data = this.data

    // 校验数据是否为空
    if (!data.name) {
      wx.showToast({
        icon: 'error',
        title: '商品名称为空',
      })
      return
    } 
    if (!data.selectedCategory) {
      wx.showToast({
        icon: 'error',
        title: '未选择商品分类',
      })
      return
    } 
    if (!data.price) {
      wx.showToast({
        icon: 'error',
        title: '商品价格为空',
      })
      return
    } 
    if (data.price <= 0) {
      wx.showToast({
        icon: 'error',
        title: '商品价格非法',
      })
      return
    } 
    if (!data.stock) {
      wx.showToast({
        icon: 'error',
        title: '商品库存为空',
      })
      return
    } 
    if (data.stock <= 0) {
      wx.showToast({
        icon: 'error',
        title: '商品库存非法',
      })
      return     
    }
    if (!data.coverUrl) {
      wx.showToast({
        icon: 'error',
        title: '商品封面为空',
      })
      return
    }
    if (!data.description) {
      wx.showToast({
        icon: 'error',
        title: '商品描述为空',
      })
      return
    }
    if (!data.contact) {
      wx.showToast({
        icon: 'error',
        title: '联系人为空',
      })
      return
    }
    if (!data.phone) {
      wx.showToast({
        icon: 'error',
        title: '联系电话为空',
      })
      return
    }

    this.setData({
      name: '',
      selectedCategory: '',
      price: '',
      stock: '',
      coverUrl: '',
      description: '',
      descriptionImagesUrl: [],
      contactPerson: '',
      phone: '',
      contact: ''
    });
  },
})