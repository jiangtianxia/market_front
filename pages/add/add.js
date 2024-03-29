// pages/add/add.js

var cos = require('../../utils/cos.js')
var util = require('../../utils/utils.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    description: '',
    price: '',
    stock: '',
    coverUrl: "",
    coverKey: "",
    descriptionImagesUrl: [],
    descriptionImagesKey: [],
    maxDescImageCount: 9,
    selectedCategory: '',
    categoryOptions: ['二手书籍', '日常用品', '其他物品'],
    contact: '',
    phone: '',
    uploading: false,
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      uploading : false
    })
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
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        that.setData({
          uploading: true,
        });

        const tempFilePath = res.tempFiles[0].tempFilePath;

        // 构建cos保存路径
        let openid = util.GetStorageSyncTime("openid")
        let fileArr = tempFilePath.split('/')
        let key = openid + "/coverImg/" + Date.parse(new Date()) + fileArr[fileArr.length-1]

        // 上传文件至COS
        cos.GetCOSSDK().putObject({
          Bucket: cos.GetCOSBucket(),
          Region: cos.GetCOSRegion(),
          Key: key,
          FilePath: tempFilePath,
        }, 
        function (err, data) {
          that.setData({
            uploading: false,
          });

          // 上传失败
          if (err) {
            wx.showToast({
              title: '封面上传失败',
              icon: 'error',
              duration: 2000
            })
            console.error(err)
            return
          }

          // 更新封面
          that.setData({
            coverUrl: 'https://' + data.Location,
            coverKey: key,
            uploading: false,
          });
        });
      }
    });
  },


  // 移除封面图片
  removeCoverImage() {
    let key = this.data.coverKey
    this.setData({
      coverUrl: '',
      coverKey: ''
    });

    // 删除cos图片
    cos.GetCOSSDK().deleteObject({
      Bucket: cos.GetCOSBucket(),
      Region: cos.GetCOSRegion(),
      Key: key,
    }, 
    function (err, data) {
      if (err) {
        console.error("removeCoverImage failed", err)
      }
    })
  },

  // 选择描述图片
  chooseDescImages() {
    var that = this
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
        const currKey = this.data.descriptionImagesKey;

        this.setData({
          uploading: true,
        });

        for (let i = 0; i < tempFiles.length; i++) {
          const tempFilePath = res.tempFiles[i].tempFilePath;

          // 构建cos保存路径
          let openid = util.GetStorageSyncTime("openid")
          let fileArr = tempFilePath.split('/')
          let key = openid + "/descImg/" + Date.parse(new Date()) + fileArr[fileArr.length-1]
  
          // 上传文件至COS
          cos.GetCOSSDK().putObject({
            Bucket: cos.GetCOSBucket(),
            Region: cos.GetCOSRegion(),
            Key: key,
            FilePath: tempFilePath,
          }, 
          function (err, data) {
            // 上传失败
            if (err) {
              this.setData({
                uploading: false,
              });
              wx.showToast({
                title: '描述图片上传失败',
                icon: 'error',
                duration: 2000
              })
              console.error(err)
              return
            }
  
            // 保存图片
            currImg.push('https://' + data.Location)
            currKey.push(key)

            if (i == tempFiles.length-1) {
              that.setData({
                descriptionImagesUrl: currImg,
                descriptionImagesKey: currKey,
                uploading: false,
              });
            }
          });
        }
      }
    });
  },

  // 移除描述图片
  removeDescImage(e) {
    const index = e.currentTarget.dataset.index;
    const currImg = this.data.descriptionImagesUrl;
    const currKey = this.data.descriptionImagesKey;

    let delKey = currKey[index]
    currImg.splice(index, 1);
    currKey.splice(index, 1);
    this.setData({
      descriptionImagesUrl: currImg,
      descriptionImagesKey: currKey
    });

    // 删除cos图片
    cos.GetCOSSDK().deleteObject({
      Bucket: cos.GetCOSBucket(),
      Region: cos.GetCOSRegion(),
      Key: delKey,
    }, 
    function (err, data) {
        if (err) {
          console.error("removeDescImage failed", err)
        }
    })
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