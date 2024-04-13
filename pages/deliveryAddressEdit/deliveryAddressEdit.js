const app = getApp();
// pages/deliveryAddressEdit/deliveryAddressEdit.js
// var areaList = require('../../node_modules/@vant/area-data/dist/index.esm.mjs');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['广东省', '广州市', '海珠区'],
    defaultFlag: false,
    show: false,
    tag: "",
    areaPhone: [{
        "area": "中国大陆",
        "phone": 86,
        "value": "CHINA",
        "checked": true
      },
      {
        "area": "中国香港",
        "phone": 852,
        "value": "HONGKONG"
      }, {
        "area": "中国澳门",
        "phone": 853,
        "value": "MACAU"
      }, {
        "area": "中国台湾",
        "phone": 886,
        "value": "TAIWAN"
      },
      {
        "area": "韩国",
        "phone": 82,
        "value": "KOREA"
      },
      {
        "area": "日本",
        "phone": 81,
        "value": "JPN"
      },
      {
        "area": "美国",
        "phone": 1,
        "value": "USA"
      }, {
        "area": "加拿大",
        "phone": 1,
        "value": "CANADA"
      }, {
        "area": "英国",
        "phone": 44,
        "value": "ENG"
      },
      {
        "area": "澳大利亚",
        "phone": 61,
        "value": "AUS"
      },


    ],
    orderChecked: false,
    address: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      phonearea: this.data.areaPhone[0].phone,
      tempRegion: ["广东省","广州市","海珠区"]
    })

    let id, person, phone, phonearea, region = this.data.region,
      detailed, tag, defaultFlag;

    if (options.edit_id) {
      this.setData({
        edit: true
      })
      console.log("options.edit_id:" + options.edit_id);
      let address;
      wx.request({
        url: app.globalData.baseUrl + '/api/address/goEdit?id=' + options.edit_id,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          console.log(res);
          if (res.data.errno != -1) {
            address = res.data.data;
            id = address.id;
            person = address.name;
            phone = address.phone;
            phonearea = address.phoneprefix;
            region = address.area;
            tag = address.tag;
            defaultFlag = address.defaultad;
            detailed = address.deatailad;

            this.setData({
              id,
              person,
              phone,
              phonearea,
              region,
              tag,
              defaultFlag,
              detailed
            })
            region = this.data.region.split(" ");
            this.setData({
              region
            })
            let tempRegion = [];
            if (region.length) {
              region.forEach(function (item) {
                if (item.length > 3) {
                  tempRegion.push(item.slice(0, 3) + '...');
                } else {
                  tempRegion.push(item);
                }
              })
            }
            console.log("id:" + id + ",person:" + person + ",detailed:" + detailed);
            this.setData({
              tempRegion
            });
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
      // if (addressList) {
      //   addressList.forEach(function (item) {
      //     if (item.id == options.edit_id) {
      //       address = item;
      //       console.log("now address:" + JSON.stringify(address));
      //     }
      //   })
      //   id = address.id;
      //   person = address.person;
      //   phone = address.phone;
      //   phonearea = address.phonearea;
      //   region = address.area;
      //   tag = address.tag;
      //   defaultFlag = address.default;
      //   detailed = address.detailed;
      // }

    } else if (options.maxId) {
      console.log("maxId:" + options.maxId);
      let jsonMaxId = JSON.parse(options.maxId);
      this.setData({
        id: ++jsonMaxId,
      })
      console.log("data.id:" + this.data.id);
    }
    if (options.orderAdd) {
      this.setData({
        orderChecked: true
      })
    }


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
    const areaPhone = this.data.areaPhone;
    for (let i = 0, len = areaPhone.length; i < len; i++) {
      if (areaPhone[i].checked) {
        this.setData({
          checked: areaPhone[i].phone
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

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

  onshowPhone() {
    this.setData({
      show: true
    })
  },

  onCancel() {
    this.setData({
      show: false
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    });
    let region = this.data.region;
    let tempRegion = [];
    if (region.length) {
      region.forEach(function (item) {
        if (item.length > 3) {
          tempRegion.push(item.slice(0, 3) + '...');
        } else {
          tempRegion.push(item);
        }
      })
    }
    this.setData({
      tempRegion
    })
  },

  radioChange(e) {
    console.log("change!");
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    const areaPhone = this.data.areaPhone;
    for (let i = 0, len = areaPhone.length; i < len; i++) {
      areaPhone[i].checked = areaPhone[i].value === e.detail.value
      if (areaPhone[i].checked) {
        this.setData({
          phonearea: areaPhone[i].phone
        })
      }
    }

    this.setData({
      areaPhone,
      show: false
    })
  },

  changeTag(e) {
    console.log("tag-name:" + e.currentTarget.dataset.tag);
    this.setData({
      tag: e.currentTarget.dataset.tag
    })
  },

  check(value) {
    if (!value.person) {
      wx.showToast({
        title: '请输入收货人',
        icon: "none"
      })
      this.setData({
        pass: false
      });
      return;
    }
    if (!value.phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: "none"
      })
      this.setData({
        pass: false
      });
      return;
    }
    if (!value.area) {
      wx.showToast({
        title: '请选择所在地区',
        icon: "none"
      })
      this.setData({
        pass: false
      });
      return;
    }
    if (!value.detailed) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      })
      this.setData({
        pass: false
      });
      return;
    }
    if (typeof (this.data.pass) == "undefined" || !this.data.pass) {
      this.setData({
        pass: true
      });
    }
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    console.log("area:" + JSON.stringify(e.detail.value.area));
    let area = "";
    e.detail.value.area.forEach(function (item) {
      area += (item + " ");
    })
    area = area.slice(0, -1);
    let value = e.detail.value;
    this.check(value);

    if (this.data.pass) {
      let edit = this.data.edit;
      let user = wx.getStorageSync('user');
      let userid = user.id;
      let addressid = this.data.id;
      
      if (!edit) {
        wx.request({
          url: app.globalData.baseUrl + "/api/address/newAddress?userid=" + userid, // 请求的接口地址，必须基于 https 协议
          method: 'POST',
          // header: {  
          //   'Content-Type': 'application/x-www-form-urlencoded'  
          // },
          data: {
            area: area,
            name: value.person,
            deatailad:value.detailed,
            phoneprefix: value.phonearea,
            phone: value.phone,
            tag: value.tag,
            defaultad: value.default?1:0
          },
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (res.data.errno != -1) {
              wx.showToast({
                title: '新增成功！',
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
        
      } else {
        wx.request({
          url: app.globalData.baseUrl + "/api/address/addressUpdate?userid=" + userid + "&id=" + addressid, // 请求的接口地址，必须基于 https 协议
          method: 'POST',
          // header: {  
          //   'Content-Type': 'application/x-www-form-urlencoded'  
          // },
          data: {
            area: area,
            name: value.person,
            deatailad:value.detailed,
            phoneprefix: value.phonearea,
            phone: value.phone,
            tag: value.tag,
            defaultad: value.default?1:0
          },
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (res.data.errno != -1) {
              wx.showToast({
                title: '修改成功！',
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
      }

      let jsonValue = JSON.stringify(value);
      let orderChecked = this.data.orderChecked;
      if (!orderChecked && !edit) {
        console.log("if !orderChecked && !edit");
        setTimeout(function () {
          wx.reLaunch({
            url: `/pages/deliveryAddressList/deliveryAddressList`,
          })
        }, 2000)
      } else {
        console.log("else");
        setTimeout(function () {
          wx.reLaunch({
            url: `/pages/deliveryAddressList/deliveryAddressList`,
          })
        }, 2000)
      }

    } else {
      this.check(value);
    }
  }
})