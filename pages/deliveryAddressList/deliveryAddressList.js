// pages/deliveryAddressList/deliveryAddressList.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // addressList:[{
    //   "name": "张三",
    //   "phone": "13029871620",
    //   "address": "北京市 朝阳区 XXXXXXXXXXXXXXXXXXXXXX"
    // },
    // {
    //   "name": "李四",
    //   "phone": "17380906399",
    //   "address": "广东省 深圳市 宝安区 XXXXXXXXXXXXXXXXXXXXXX"
    // },{
    //   "name": "王五",
    //   "phone": "18716202987",
    //   "address": "湖南省 长沙市 岳麓区 XXXXXXXXXXXXXXXXXXXXXX"
    // },
    // {
    //   "name": "张三",
    //   "phone": "13029871620",
    //   "address": "北京市 朝阳区 XXXXXXXXXXXXXXXXXXXXXX"
    // },
    // {
    //   "name": "李四",
    //   "phone": "17380906399",
    //   "address": "广东省 深圳市 宝安区 XXXXXXXXXXXXXXXXXXXXXX"
    // },{
    //   "name": "王五",
    //   "phone": "18716202987",
    //   "address": "湖南省 长沙市 岳麓区 XXXXXXXXXXXXXXXXXXXXXX"
    // }
    // ],
    defaultAddress: "",
    edit: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let user = wx.getStorageSync('user');
    let userid = user.id;
    console.log("userid:" + userid);
    // console.log("options:" + JSON.stringify(options));
    wx.request({
      url: app.globalData.baseUrl + '/api/address/list?userid=' + userid,
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {
          if (res.data.data.length) {
            this.initData(res.data.data, options);
          } else {
            this.setData({
              addressList: []
            })
          }
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
    // let originAddressList = wx.getStorageSync('addressList');
    // let originDefaultAddress = wx.getStorageSync('defaultAddress');
    // let originDefaultIndex = wx.getStorageSync('originDefaultIndex');
    let defaultIndex, updateIndex;
    // if (originAddressList) {
    //   this.setData({
    //     addressList: originAddressList
    //   })
    //   console.log("originAddressList:" + JSON.stringify(originAddressList));
    // } else {
    //   this.setData({
    //     addressList: []
    //   })
    // }
    // if (originDefaultAddress) {
    //   this.setData({
    //     defaultAddress: originDefaultAddress,
    //     originDefaultIndex: originDefaultIndex
    //   })
    //   console.log("originDefaultAddress:" + JSON.stringify(originDefaultAddress))
    // }
    
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.complate();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  edit() {
    this.setData({
      edit: true
    })
  },

  initData(resdata, options) {
    this.setData({
      addressList: resdata
    })
    for (var i = 0; i < this.data.addressList.length; i++) {
      if (this.data.addressList[i].defaultad) {
        this.setData({
          defaultAddress: this.data.addressList[i]
        })
      }
    }
    if (options.newAddress) {
      let address = JSON.parse(options.newAddress);
      console.log("addressList:" + options.newAddress);
      let addressDetail = "";
      address.area.forEach(function (item) {
        addressDetail += (item + ' ');
      })
      addressDetail += address.detailed;
      console.log("addressDetail:" + addressDetail);
      address.addressDetail = addressDetail;
      console.log("address:" + JSON.stringify(address));
      let addressList = this.data.addressList;
      if (!addressList) {
        addressList = [];
      }
      if (options.orderCheck) {
        address.checked = true;
        addressList.forEach(function (item) {
          item.checked = false
        });
        this.setData({
          address,
          addressList,
          checkedAddress: address
        });
      }
      if (!options.update) {
        addressList.unshift(address);
      } else {
        console.log("options.update_id:" + options.update_id);
        // addressList = wx.getStorageSync('addressList');
        // let checkedAddress = wx.getStorageSync('checkedAddress');
        for (var i = 0; i < addressList.length; i++) {
          if (addressList[i].id == options.update_id) {
            updateIndex = i;
            addressList[i] = address;
            break;
          }
        }
        if (options.update_id == checkedAddress.id) {
          wx.setStorageSync('checkedAddress', addressList[updateIndex]);
        }
      }
      this.setData({
        addressList
      });
      if (address.default) {
        if (!options.update) {
          this.setData({
            defaultAddress: this.data.addressList[0]
          });
          defaultIndex = 0;
        } else {
          console.log("not default");
          this.setData({
            defaultAddress: this.data.addressList[updateIndex]
          });
          defaultIndex = updateIndex;
        }
        for (var i = 0; i < addressList.length; i++) {
          if (i != defaultIndex) {
            addressList[i].default = false;
          }
        }
        this.setData({
          addressList
        })
      } else {
        if (options.update) {
          // let defaultAddress = wx.getStorageSync('defaultAddress');
          if (defaultAddress && (defaultAddress.id == address.id)) {
            this.setData({
              defaultAddress: ''
            })
            wx.removeStorageSync('defaultAddress');
          }
        }

        this.setData({
          addressList
        })
      }
      let defaultFlag = this.data.defaultAddress;
      addressList.forEach(function (item) {
        console.log("default:" + (item == defaultFlag));
      })
    }
    if (options.orderCheck) {
      console.log("yes!options.orderCheck");
      let addressList = this.data.addressList;
      let defaultAddress = this.data.defaultAddress;
      let checkedAddress = wx.getStorageSync('checkedAddress');
      this.setData({
        orderCheck: true
      });
      if (checkedAddress && !options.orderNew) {
        addressList.forEach(function (item) {
          item.checked = checkedAddress.id == item.id;
          if (defaultAddress.id == item.id) {
            defaultAddress.checked = true
          }
          console.log("id:" + item.id + ",checked:" + item.checked + ",default:" + item.default);
        });
        this.setData({
          addressList,
          defaultAddress,
          checkedAddress
        })
      } else if (!checkedAddress) {
        if (defaultAddress != "") {
          var string = 'defaultAddress.checked';
          this.setData({
            [string]: true,
            checkedAddress: defaultAddress
          });
          addressList.forEach(function (item) {
            item.checked = item.id == defaultAddress.id;
            console.log("id2:" + item.id + ",checked2:" + item.checked + ",default2:" + item.default);
          })
        } else {
          addressList.forEach(function (item) {
            item.checked = false;
          })
        }
      }
      this.setData({
        addressList
      })
    }
    if (this.data.addressList.length) {
      wx.setStorageSync('addressList', this.data.addressList);
    }
    if (this.data.defaultAddress != '') {
      wx.setStorageSync('defaultAddress', this.data.defaultAddress);
    }

    if (this.data.checkedAddress) {
      wx.setStorageSync('checkedAddress', this.data.checkedAddress);
    }
  },

  complate() {
    let tempDefault = this.data.tempDefault;
    let tempAddressList = this.data.tempAddressList;
    let checkedAddress = wx.getStorageSync('checkedAddress');
    let user = wx.getStorageSync('user');
    let userid = user.id;
    if (tempAddressList) {
      this.setData({
        addressList: tempAddressList
      })
      wx.setStorageSync('addressList', this.data.addressList);
    }
    if (tempDefault) {
      this.setData({
        defaultAddress: tempDefault
      });
      let addressid = tempDefault.id;
      wx.request({
        url: app.globalData.baseUrl + "/api/address/addressUpdate?userid=" + userid + "&id=" + addressid, // 请求的接口地址，必须基于 https 协议
        method: 'POST',
        // header: {  
        //   'Content-Type': 'application/x-www-form-urlencoded'  
        // },
        data: {
          area: tempDefault.area,
          name: tempDefault.name,
          deatailad: tempDefault.deatailad,
          phoneprefix: tempDefault.phoneprefix,
          phone: tempDefault.phone,
          tag: tempDefault.tag,
          defaultad: 1
        },
        success: (res) => { // 请求成功之后的回调函数
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        }
      })
      if ((checkedAddress != "") && (checkedAddress.id == tempDefault.id)) {
        this.setData({
          checkedAddress: tempDefault
        })
        this.data.addressList.forEach(function (item) {
          item.checked = item.id == checkedAddress.id;
        });
        wx.setStorageSync('checkedAddress', this.data.checkedAddress);
      }
      wx.setStorageSync('defaultAddress', this.data.defaultAddress);
    }
    this.setData({
      edit: false
    })
  },

  checkedChange(e) {
    console.log('radio发生change事件，携带value值为：', JSON.stringify(e.detail.value));

    const addressList = this.data.addressList;
    const defaultAddress = this.data.defaultAddress;
    for (let i = 0, len = addressList.length; i < len; ++i) {
      addressList[i].checked = (addressList[i].id == e.detail.value);
      if (addressList[i].checked) {
        console.log("yes");
        this.setData({
          checkedAddress: addressList[i]
        })
      }
      if (defaultAddress) {
        defaultAddress.checked = defaultAddress.id == e.detail.value;
      }
    }
    console.log("checkedAddress:" + JSON.stringify(this.data.checkedAddress));

    this.setData({
      addressList,
      defaultAddress
    });

    console.log("addressList:" + JSON.stringify(addressList) + ",defaultAddress:" + JSON.stringify(defaultAddress));

  },

  defaultChange(e) {
    let addressList = this.data.addressList;
    let defaultAddress = this.data.defaultAddress;
    console.log('radio发生change事件，携带value值为：', JSON.stringify(e.detail.value));
    addressList.forEach(function (item) {
      item.defaultad = item.id == e.detail.value;
      console.log("changeDefault:" + JSON.stringify(item));
    });
    for (var i = 0; i < addressList.length; i++) {
      if (addressList[i].id == e.detail.value) {
        this.setData({
          tempDefault: addressList[i]
        })
        break;
      }
    }
    // console.log("tempDefault:" + JSON.stringify(this.data.tempDefault));
    this.setData({
      tempAddressList: addressList
    })
    // console.log("tempAddressList:" + JSON.stringify(this.data.tempAddressList));
  },

  addDelivery() {
    wx.navigateTo({
      url: `/pages/deliveryAddressEdit/deliveryAddressEdit`,
    })
  },

  confirm() {
    let checkedAddress = this.data.checkedAddress;
    let jsonCheckedAddress = JSON.stringify(this.data.checkedAddress);
    console.log("jsonCheckedAddress: " + jsonCheckedAddress);
    wx.setStorageSync('checkedAddress', checkedAddress);
    wx.navigateTo({
      url: '/pages/orderConfirm/orderConfirm',
    })
  },

  orderAdd() {
    let addressList = this.data.addressList;
    let maxId = 0;
    if (addressList) {
      maxId = addressList[0].id;
    }
    let jsonMaxId = JSON.stringify(maxId);
    wx.navigateTo({
      url: `/pages/deliveryAddressEdit/deliveryAddressEdit?orderAdd=true&maxId=` + jsonMaxId,
    })
  },

  toDelete(e) {
    let addressList = this.data.addressList;
    let defaultAddress = this.data.defaultAddress;
    let checkedAddress = wx.getStorageSync('checkedAddress');
    console.log("deleteId:" + e.currentTarget.dataset.delete_id);
    for (var i = 0; i < addressList.length; i++) {
      if (addressList[i].id == e.currentTarget.dataset.delete_id) {
        addressList.splice(i, 1);
      }
    }
    wx.request({
      url: app.globalData.baseUrl + '/api/address/deleteAddress?id=' + e.currentTarget.dataset.delete_id,
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {
          wx.showToast({
            title: '删除成功',
          })
          } else {
            wx.showToast({
              title: '请稍后再试',
              icon: "error"
            })
          }
        },
      error: (err) => {
        console.log(err);
      }
    })
    if (defaultAddress.id == e.currentTarget.dataset.delete_id) {
      defaultAddress = '';
      wx.removeStorageSync('defaultAddress');
    }
    if (checkedAddress.id == e.currentTarget.dataset.delete_id) {
      checkedAddress = '';
      wx.removeStorageSync('checkedAddress');
    }
    this.setData({
      addressList,
      defaultAddress,
      checkedAddress
    })
    wx.setStorageSync('addressList', addressList);
    addressList.forEach(function (item) {
      console.log("id:" + item.id + ",default:" + item.default+",checked:" + item.checked);
    })
    console.log("defaultAddress:" + defaultAddress + ",checkedAddress:" + checkedAddress);
  },
                                                                                                                                                       
  toEdit(e) {
    console.log("edit_id:" + e.currentTarget.dataset.edit_id);
    wx.navigateTo({
      url: `/pages/deliveryAddressEdit/deliveryAddressEdit?edit_id=` + e.currentTarget.dataset.edit_id,
    })
  }
})
