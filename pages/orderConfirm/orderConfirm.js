const app = getApp();
// pages/orderConfirm/orderConfirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // product: {
    //   "id": 1,
    //   "name": "hellokitty童装 2019夏季新款儿童透气网眼女童棉袜中大童袜子",
    //   "oPrice": 180,
    //   "cPrice": 170,
    //   "index_img": "/images/index/floor/products/kanjia-1.jpg",
    //   "desc": "尼多熊袜子，适合秋冬",
    //   "imageDomain": [
    //     "/images/product-detail/product-detail-1.jpeg",
    //     "/images/product-detail/product-detail-2.jpeg",
    //     "/images/product-detail/product-detail-3.jpeg",
    //     "/images/product-detail/product-detail-4.jpeg"
    //   ],
    //   "store": {
    //     "id": 1,
    //     "name": "杭州城西银泰城MALL",
    //     "head": "",
    //     "address": "杭州拱墅区丰潭路380号5F06-5F7室（近申花路）"
    //   },
    //   "options": [
    //     {
    //       "name": "网络类型",
    //       "lists": ["WIFI", "4G"]
    //     },
    //     {
    //       "name": "新订单提示",
    //       "lists": ["滴滴声", "真人语音"]
    //     },
    //     {
    //       "name": "切纸方式",
    //       "lists": ["手动撕纸", "自动切纸"]
    //     },
    //     {
    //       "name": "对接方式",
    //       "lists": ["自己对接", "系统对接"]
    //     }
    //   ],
    //   "detail": [
    //     "/images/index/floor/products/kanjia-1.jpg",
    //     "/images/index/floor/products/kanjia-2.jpg",
    //     "/images/index/floor/products/miaosha-1.jpg",
    //     "/images/index/floor/products/miaosha-2.jpg",
    //     "/images/index/floor/products/pintuan-1.jpg",
    //     "/images/index/floor/products/pintuan-2.jpg"
    //   ],
    //   "judge": [{
    //     "head": "/images/my/default.png",
    //     "username": "张三",
    //     "time": "2022-04-18 22:20:03",
    //     "star": 5,
    //     "content": "系统默认好评"
    //   },
    //   {
    //     "head": "/images/my/default.png",
    //     "username": "李四",
    //     "time": "2022-04-18 22:20:03",
    //     "star": 5,
    //     "content": "系统默认好评"
    //   }
    //   ],
    // },
    columns: [{
        "text": "快递配送",
        "value": 1
      },
      {
        "text": "到店自取1",
        "value": 2
      },
      {
        "text": "到店自取2",
        "value": 2
      },
      {
        "text": "到店自取3",
        "value": 2
      },
      {
        "text": "到店自取4",
        "value": 2
      }
    ],
    show: false,
    columnsIndex: 0,
    orderList: []
    // deliveryAddress: true,
    // address: "湖南省 长沙市 岳麓区 湖南省长沙市岳麓区",
    // contect: "张三 18816335622"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let noPayList = wx.getStorageSync('noPayList');
    if (!noPayList) {
      let user = wx.getStorageSync('user');
      let userid = user.id;
      console.log("userid:" + userid);
      // console.log("options:" + JSON.stringify(options));
      wx.request({
        url: app.globalData.baseUrl + '/api/address/list?userid=' + userid,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          if (res.data.errno != -1 && res.data.data.length > 0) {
            this.initOrderList(res.data.data);
          } else {}
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else if (options.orderList) {
      // let orderId = JSON.parse(options.orderList);
      // console.log("orderId:" + orderId);
      // wx.request({
      //   url: app.globalData.baseUrl + '/api/order/details?id=' + orderId[0],
      //   method: 'GET',
      //   success: (res) => { // 请求成功之后的回调函数
      //     console.log(res);
      //     let resdata = res.data.data;
      //     this.checkRear(resdata, 1);
      //     let deliveryAddress = {
      //       id: -1,
      //       area: "",
      //       deatailad: "",
      //       name: "",
      //       phone: ""
      //     };
      //     if (resdata.addressid != 0) {
      //       deliveryAddress.id = resdata.addressid;
      //       deliveryAddress.area = resdata.area;
      //       deliveryAddress.deatailad = resdata.deatailad;
      //       deliveryAddress.name = resdata.name;
      //       deliveryAddress.phone = resdata.phone;
      //     }
      //     this.setData({
      //       deliveryAddress
      //     })
      //   },
      //   error: (err) => {
      //     console.log(err);
      //   }
      // })
    } else {
      let checkedAddress = wx.getStorageSync('checkedAddress');
      if (checkedAddress) {
        this.setData({
          deliveryAddress: checkedAddress
        })
      }
    }

    let tempOrder = wx.getStorageSync('tempOrder');
    let tempBuyCount = wx.getStorageSync('tempBuyCount');
    let tempTotalPrice = wx.getStorageSync('tempTotalPrice');
    if (tempOrder && tempBuyCount && tempTotalPrice) {
      this.setData({
        orderList: tempOrder,
        buyCount: tempBuyCount,
        totalPrice: tempTotalPrice
      })
    }

    if (options.orderList || tempOrder) {
      if (options.orderList) {
        console.log("orderConfirm-order:" + JSON.stringify(options.orderList));
        let orderIds = JSON.parse(options.orderList);
        console.log("orderIds:" + orderIds[0]);
        for (var i = 0; i < orderIds.length; i++) {
          wx.request({
            url: app.globalData.baseUrl + '/api/order/details?id=' + orderIds[i],
            method: 'GET',
            success: (res) => { // 请求成功之后的回调函数
              console.log(res);
              let resdata = res.data.data[0];
              this.checkRear(resdata, orderIds.length);
            },
            error: (err) => {
              console.log(err);
            }
          })
        }
      }

      // let orderList = this.data.orderList;
      // for (var i = 0; i < orderList.length; i++) {
      //   let order = orderList[i].order;
      //   let jsonCheckedOpList = order.checkedOpList;
      //   console.log("jsonCheckedOpList:" + jsonCheckedOpList);
      //   let checkedOpList = "";
      //   jsonCheckedOpList.forEach(function (item) {
      //     checkedOpList += (item + ";");
      //     console.log("sCheckedOpList:" + checkedOpList);
      //   });
      //   if (this.data.deliveryAddress) {
      //     orderList[i].order.deliveryAddress = this.data.deliveryAddress;
      //   }
      //   let string1 = 'orderList[' + i + '].order.checkedOpList1';
      //   this.setData({
      //     [string1]: checkedOpList
      //   });

      //   let delivery = orderList[i].order.delivery;
      //   if (!delivery) {
      //     let string2 = 'orderList[' + i + '].order.delivery';
      //     this.setData({
      //       [string2]: this.data.columns[this.data.columnsIndex].text
      //     })
      //   }
      //   let string3 = 'orderList[' + i + '].order.status';
      //   console.log("this.data.columns[this.data.columnsIndex].text:" + this.data.columns[this.data.columnsIndex].text);
      //   this.setData({
      //     [string3]: "未支付"
      //   })
      // }

      let totalOrderList = wx.getStorageSync('totalOrderList');
      console.log("tempOrder && options.cart:" + (tempOrder && options.cart) + ",options.orderList:" + (options.orderList) + ",noPayList:" + noPayList);
      if (((tempOrder && options.cart) || (options.orderList)) && (!noPayList)) {
        console.log("no-tempOrder");
        if (!totalOrderList) {
          totalOrderList = [];
        }

        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        //获取年份  
        var Y = date.getFullYear();
        //获取月份
        var M = date.getMonth() + 1;
        //获取当前天
        var D = date.getDate();
        //获取当前小时
        var H = date.getHours();
        // 获取当前分钟
        var S = date.getMinutes();
        let createTime = Y + '-' + M + '-' + D + ' ' + H + ':' + (S >= 10 ? S : '0' + S);

        console.log("订单创建时间：" + createTime);
        // orderList.forEach(function (item) {
        //   console.log("totalOrderList:" + JSON.stringify(totalOrderList));
        //   item.order.createTime = createTime;
        //   totalOrderList.unshift(item);
        // });
      } else if (tempOrder && !options.orderList) {
        console.log("checkedAddress");
      }

      let noPayCount = wx.getStorageSync('noPayCount');
      if (!noPayList && ((tempOrder && options.cart) || (options.orderList))) {
        console.log("no-noPayList");
        if (noPayCount) {
          noPayCount += this.data.orderList.length;
        } else {
          noPayCount = this.data.orderList.length;
        }

      }

      wx.setStorageSync('noPayCount', noPayCount);

      wx.setStorageSync('totalOrderList', totalOrderList);

      wx.setStorageSync('orderList', this.data.orderList);
      wx.setStorageSync('tempOrder', this.data.orderList);
      wx.setStorageSync('tempBuyCount', this.data.buyCount);
      wx.setStorageSync('tempTotalPrice', this.data.totalPrice);
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    wx.setStorageSync('tempOrder', this.data.orderList);
    wx.setStorageSync('tempBuyCount', this.data.buyCount);
    wx.setStorageSync('tempTotalPrice', this.data.totalPrice);
    wx.removeStorageSync('noPayList');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    wx.removeStorageSync('tempOrder');
    wx.removeStorageSync('tempBuyCount');
    wx.removeStorageSync('tempTotalPrice');
    wx.removeStorageSync('noPayList');
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

  checkRear(res, length) {
    let orderList = this.data.orderList;
    orderList.push(res);

    if (orderList.length == length) {
      let totalPrice = 0;
      let buyCount = 0;
      for (var i = 0; i < orderList.length; i++) {
        let order = orderList[i];
        let singleCount = order.count;
        let singlePrice = order.price;
        let price = singleCount * singlePrice;
        totalPrice += price;
        buyCount += singleCount;
        console.log("checkRear-addressid:" + JSON.stringify(this.data.deliveryAddress));
        orderList[i].image1 = app.globalData.baseUrl1 + '/public/' + orderList[i].image;
        if (orderList[i].remark != "") {
          orderList[i].tempRemarks = orderList[i].remark.substr(0, 9);
        }
        // wx.request({
        //   url: app.globalData.baseUrl + "/api/order/update?id=" + orderList[i].id, // 请求的接口地址，必须基于 https 协议
        //   method: 'POST',
        //   // header: {  
        //   //   'Content-Type': 'application/x-www-form-urlencoded'  
        //   // },
        //   data: {
        //     addressid: this.data.deliveryAddress.id,
        //     delivery: orderList[i].delivery,
        //     remark: orderList[i].remark
        //   },
        //   success: (res) => { // 请求成功之后的回调函数
        //     console.log(res);
        //     if (res.data.errno != -1) {

        //     } else {
        //       wx.showToast({
        //         title: '请稍后再试',
        //         icon: "error"
        //       })
        //     }
        //   },
        //   error: (err) => {
        //     console.log(err);
        //   }
        // })
      }
      totalPrice = totalPrice.toFixed(2);
      this.setData({
        totalPrice: totalPrice,
        buyCount: buyCount
      });
      let deliveryAddress = {
        id: -1,
        area: "",
        deatailad: "",
        name: "",
        phone: ""
      };
      let resdata = orderList[0];
      if (resdata.addressid != 0) {
        deliveryAddress.id = resdata.addressid;
        deliveryAddress.area = resdata.area;
        deliveryAddress.deatailad = resdata.deatailad;
        deliveryAddress.name = resdata.name;
        deliveryAddress.phone = resdata.phone;
        this.setData({
          deliveryAddress
        })
      }
    }
    this.setData({
      orderList
    });
    console.log("orderList:" + JSON.stringify(this.data.orderList));
  },

  selectDelivery() {
    this.setData({
      show: true
    })
  },

  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log("currentData:" + e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index;
    this.setData({
      columnsIndex: e.detail.value
    })
    let string2 = 'orderList[' + index + '].delivery';
    this.setData({
      [string2]: this.data.columns[this.data.columnsIndex].text
    });
    let orderList = this.data.orderList;
    wx.request({
      url: app.globalData.baseUrl + "/api/order/update?id=" + orderList[index].id, // 请求的接口地址，必须基于 https 协议
      method: 'POST',
      // header: {  
      //   'Content-Type': 'application/x-www-form-urlencoded'  
      // },
      data: {
        addressid: orderList[index].addressid,
        delivery: orderList[index].delivery,
        remark: orderList[index].remark
      },
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {

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
    // let orderItem, totalItem, orderList = this.data.orderList;
    // let totalOrderList = wx.getStorageSync('totalOrderList');
    // for (var i = 0; i < orderList.length; i++) {
    //   orderItem = orderList[i].order;
    //   for (var j = 0; j < totalOrderList.length; j++) {
    //     totalItem = totalOrderList[j].order;
    //     if ((orderItem.id == totalItem.id) && orderItem.delivery) {
    //       totalItem.delivery = orderItem.delivery;
    //       break;
    //     }
    //   }
    // }
    // wx.setStorageSync('totalOrderList', totalOrderList);
  },

  markersEdit(e) {
    console.log("index:" + e.currentTarget.dataset.index);
    this.setData({
      show: true,
      currentMarkersIdx: e.currentTarget.dataset.index
    })
  },

  initOrderList(resdata) {
    for (var i = 0; i < resdata.length; i++) {
      if (resdata[i].defaultad) {
        this.setData({
          defaultAddress: resdata[i]
        })
      }
    }
    let defaultAddress = this.data.defaultAddress;
    console.log("defaultAddress:" + JSON.stringify(defaultAddress));
    let checkedAddress = wx.getStorageSync('checkedAddress');
    if (checkedAddress) {
      this.setData({
        deliveryAddress: checkedAddress
      })
      let orderList = this.data.orderList;
      for (var i = 0; i < orderList.length; i++) {
        wx.request({
          url: app.globalData.baseUrl + "/api/order/update?id=" + orderList[i].id, // 请求的接口地址，必须基于 https 协议
          method: 'POST',
          // header: {  
          //   'Content-Type': 'application/x-www-form-urlencoded'  
          // },
          data: {
            addressid: checkedAddress.id,
            delivery: orderList[i].delivery,
            remark: orderList[i].remark
          },
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (res.data.errno != -1) {
              wx.showToast({
                title: '操作成功！',
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
    } else if (defaultAddress) {
      this.setData({
        deliveryAddress: defaultAddress
      })
      console.log("deliveryAddress:" + JSON.stringify(this.data.deliveryAddress));
      console.log("initOrderList-orderList:" + this.data.orderList);
    }
  },

  onClose() {
    this.setData({
      show: false
    })
  },

  bindFormSubmit(e) {
    console.log("submit!");
    console.log(e.detail.value.textarea);
    let string1 = 'orderList[' + this.data.currentMarkersIdx + '].remark';
    let string2 = 'orderList[' + this.data.currentMarkersIdx + '].tempRemarks';
    console.log("string1:" + this.data.orderList[0].remark);
    console.log("string2:" + this.data.orderList[0].tempRemarks);
    this.setData({
      show: false,
      [string1]: e.detail.value.textarea,
      [string2]: (e.detail.value.textarea).substr(0, 9)
    });
    console.log("after-string1:" + this.data.orderList[0].remark);
    console.log("after-string2:" + this.data.orderList[0].tempRemarks);
    let orderList = this.data.orderList;
    wx.request({
      url: app.globalData.baseUrl + "/api/order/update?id=" + orderList[this.data.currentMarkersIdx].id, // 请求的接口地址，必须基于 https 协议
      method: 'POST',
      // header: {  
      //   'Content-Type': 'application/x-www-form-urlencoded'  
      // },
      data: {
        addressid: orderList[this.data.currentMarkersIdx].addressid,
        delivery: orderList[this.data.currentMarkersIdx].delivery,
        remark: orderList[this.data.currentMarkersIdx].remark
      },
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {

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
    // let orderItem, totalItem, orderList = this.data.orderList;
    // let totalOrderList = wx.getStorageSync('totalOrderList');
    // for (var i = 0; i < orderList.length; i++) {
    //   orderItem = orderList[i].order;
    //   for (var j = 0; j < totalOrderList.length; j++) {
    //     totalItem = totalOrderList[j].order;
    //     if ((orderItem.id == totalItem.id) && orderItem.remarks) {
    //       totalItem.remarks = orderItem.remarks;
    //       totalItem.tempRemarks = orderItem.tempRemarks;
    //       break;
    //     }
    //   }
    // }
    // wx.setStorageSync('totalOrderList', totalOrderList);
  },

  orderSubmit() {
    let deliveryAddress = this.data.deliveryAddress;
    let orderList = this.data.orderList;
    let orderLen = this.data.orderList.length;
    if (!(deliveryAddress)) {
      wx.showToast({
        title: '请选择收货地址',
        icon: "none",
        duration: 2000
      })
    } else {
      wx.showActionSheet({
        alertText: "确认支付吗",
        itemList: ["确定"],
        success(res) {
          console.log("tapIndex:" + res.tapIndex);
          if (res.tapIndex == 0) {
            console.log("addressid:" + deliveryAddress.id);
            for (var i = 0; i < orderList.length; i++) {
              console.log("delivery:" + orderList[i].delivery);
              console.log("remark:" + orderList[i].remark);

              wx.request({
                url: app.globalData.baseUrl + "/api/order/update?id=" + orderList[i].id + '&status=1', // 请求的接口地址，必须基于 https 协议
                method: 'POST',
                // header: {  
                //   'Content-Type': 'application/x-www-form-urlencoded'  
                // },
                data: {

                },
                success: (res) => { // 请求成功之后的回调函数
                  console.log(res);
                  if (res.data.errno != -1) {
                    wx.showToast({
                      title: '操作成功！',
                    })
                    setTimeout(function () {
                      wx.switchTab({
                        url: '/pages/index/index',
                      })
                    }, 2000)
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

            // var timestamp = Date.parse(new Date());
            // var date = new Date(timestamp);
            // //获取年份  
            // var Y = date.getFullYear();
            // //获取月份
            // var M = date.getMonth() + 1;
            // //获取当前天
            // var D = date.getDate();
            // //获取当前小时
            // var H = date.getHours();
            // // 获取当前分钟
            // var S = date.getMinutes();
            // let paymentTime = Y + '-' + M + '-' + D + ' ' + H + ':' + (S >= 10 ? S : '0' + S);
            // console.log("付款时间：" + paymentTime);
            // let orderItem, totalItem;
            // let totalOrderList = wx.getStorageSync('totalOrderList');
            // for (var i = 0; i < orderList.length; i++) {
            //   orderItem = orderList[i].order;
            //   orderItem.paymentTime = paymentTime;
            //   for (var j = 0; j < totalOrderList.length; j++) {
            //     totalItem = totalOrderList[j].order;
            //     if ((orderItem.id == totalItem.id) && orderItem.status) {
            //       totalItem.status = "待发货";
            //       totalItem.paymentTime = orderItem.paymentTime;
            //       break;
            //     }
            //   }
            // }

            // let noPayCount = wx.getStorageSync('noPayCount');
            // noPayCount -= orderLen;
            // wx.setStorageSync('noPayCount', noPayCount);
            // let noDeliverCount = wx.getStorageSync('noDeliverCount');
            // if (noDeliverCount) {
            //   noDeliverCount += orderLen;
            // } else {
            //   noDeliverCount = orderLen;
            // }
            // wx.setStorageSync('noDeliverCount', noDeliverCount);
            // wx.showToast({
            //   title: '订单提交成功！',
            //   duration: 2000
            // });


            wx.removeStorageSync('tempOrder');
            wx.removeStorageSync('tempBuyCount');
            wx.removeStorageSync('tempTotalPrice');

            wx.removeStorageSync('noPayList');

            // wx.setStorageSync('orderList', orderList);


            // wx.setStorageSync('totalOrderList', totalOrderList);

          } else {}
        }
      })
    }
  },

  goToAddress() {
    wx.navigateTo({
      url: `/pages/deliveryAddressList/deliveryAddressList?orderCheck=true`,
    })
  }
})