const app = getApp();

// pages/goodsDetails/goodDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    createTabs: true,
    tabs: [{
        "view_id": "product-introduce",
        "tab_name": "商品简介"
      },
      {
        "view_id": "product-details",
        "tab_name": "商品详情"
      },
      {
        "view_id": "product-judge",
        "tab_name": "商品评价"
      },
    ],
    product: {},
    show: false,
    checkedOptions: false,
    optionsList: [],
    checkedOpList: [],
    buyCount: 1,
    subtractDisabled: false,
    addCountDisabled: false,
    passConfirm: false,
    passOption: false,
    loginShow: false,
    registerShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    const app = getApp();
    console.log("details-global-baseUrl:" + app.globalData.baseUrl);
    this.setData({
      active: this.data.tabs[0].tab_name
    });
    // console.log("options:" + JSON.stringify(e.id));
    if (e.item) {
      let options = JSON.parse(e.item);
      console.log("options-item:" + JSON.stringify(options));
      console.log("id:" + options.id);
      this.setData({
        product: options,
        buyCount: 1,
        subtractDisabled: true
      })
    } else if (e.order) {

    } else if (e.itemId) {
      console.log("e.itemId:" + e.itemId);
      wx.request({
        url: app.globalData.baseUrl + '/api/products/details?id=' + e.itemId,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          this.initDetails(res.data.data, e.itemId);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }

    let that = this;
    var query = wx.createSelectorQuery();
    let tabViewHeight = [];
    let tempTabViewHeight = 0;
    query.selectAll('.tab-view').boundingClientRect((rect) => {
      var tabViewInfo = rect;
      for (var i = 0; i < tabViewInfo.length; i++) {
        tempTabViewHeight += tabViewInfo[i].height;
        tabViewHeight[i] = tempTabViewHeight;
      }
      that.setData({
        tabViewHeight
      })
    }).exec();

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        console.log("windowHeight:" + res.windowHeight + ",screenHeight:" + res.screenHeight);
      }
    });
    console.log("windowHeight1:" + this.data.windowHeight);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  initDetails(data, itemId) {
    let product = data;
    product.image1 = app.globalData.baseUrl1 + '/public/' + product.image;
    product.id = itemId;
    let args = product.arguments.split(",");
    let detailsarg = product.detailsarg;
    console.log("args:" + args + ",detailsarg:" + detailsarg);
    detailsarg = detailsarg.substr(1);
    detailsarg = detailsarg.substring(0, detailsarg.length - 1);
    detailsarg = detailsarg.split(";");
    console.log("after-detailsarg:" + detailsarg);
    let argsNameList = [];
    for (var i = 0; i < args.length; i++) {
      let obj = {
        key: args[i],
        value: detailsarg[i]
      }
      console.log("obj:" + JSON.stringify(obj));
      argsNameList.push(obj);
    }
    let user = wx.getStorageSync('user');
    if (user != "") {
      let userid = user.id;
      console.log("usreid:" + userid);
      let favUser = product.favuser;
      if (favUser != "") {
        favUser = favUser.split(";");
        for (var j = 0; j < favUser.length; j++) {
          if (favUser[j] == userid) {
            product.faved = true;
          }
        }
      }
    }
    console.log("argsNameList:" + JSON.stringify(argsNameList));
    this.setData({
      product,
      buyCount: 1,
      subtractDisabled: true,
      argsNameList
    })
    wx.request({
      url: app.globalData.baseUrl1 + '/api/judge/listJudge?productid=' + itemId,
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.statusCode == 200) {
          let resdata = res.data;
          if (resdata.length > 0) {
            this.setData({
              judgeLen: resdata.length
            })
            const string = 'product.judge';
            for (var i = 0; i < resdata.length; i++) {
              resdata[i].images = resdata[i].images.split(';');
              for (var j = 0; j < resdata[i].images.length - 1; j++) {
                resdata[i].images[j] = app.globalData.baseUrl1 + '/uploads/' + resdata[i].images[j];
                console.log("judge-image:" + resdata[i].images[j]);
              }
            }
            this.setData({
              [string]: resdata
            })
          }
          var query = wx.createSelectorQuery();
          let row;
          query.selectAll('.judge-item-bottom').boundingClientRect((rect) => {
            var judgeInfo = rect;
            that.setData({
              judgeInfo
            })
            for (var i = 0; i < judgeInfo.length; i++) {
              row = (judgeInfo[i].height / 20);
              if (row > 2) {
                product.judge[i].overLength = true;
                product.judge[i].expansionShow = true;
              } else {
                product.judge[i].overLength = false;
              }
            }
            // this.setData({
            //   product
            // })
          }).exec();
          let that = this;
          query.select('.roll').boundingClientRect((rect) => {
            let windowHeight = that.data.windowHeight;
            console.log("query_windowHeight:" + windowHeight);
            var rollTop = rect.top;
            let rollHeight = windowHeight - rollTop;
            that.setData({
              rollHeight
            })
          }).exec();
        } else {
          wx.showToast({
            title: '商品评价加载失败',
          })
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
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

  optionsOpen: function () {
    this.setData({
      show: true
    })

    let that = this;
    let product = that.data.product;
    let optionsList = [];
    let argsname = that.data.product.argsname.split(";");
    let argsvalue = that.data.product.argsvalue.split(";");
    for (var i = 0; i < argsname.length; i++) {
      let lists = argsvalue[i].split(",");
      let obj = {
        name: argsname[i],
        lists: lists
      }
      optionsList.push(obj);
    }
    that.setData({
      optionsList
    })
    optionsList = that.data.optionsList;
    for (var i = 0; i < optionsList.length; i++) {
      let string = 'optionsList[' + i + '].checked';
      let checked = this.data.optionsList[i].lists[0];
      that.setData({
        [string]: '',
        checkedPrice: this.data.product.price,
        checkedImage: this.data.product.image1
      })
    }
    // console.log("optionsList1:" + JSON.stringify(this.data.optionsList));
  },

  changeOption(e) {
    this.setData({
      checkedList: []
    })
    let that = this;
    let optionsPrice = this.data.product.argsassemblyvalue.split(";");
    let optionsList = this.data.optionsList;
    let key = e.currentTarget.dataset.key;
    let value = e.currentTarget.dataset.value;
    let index = e.currentTarget.dataset.index;
    let checkedOpList = this.data.checkedOpList;
    console.log("key:" + key + ",value:" + value);
    console.log("optionsPrice.length:" + optionsPrice.length);
    console.log("index:" + index);

    var change = 'checkedOpList[' + index + ']';
    let string = 'optionsList[' + index + '].checked';
    let checkedIdx;
    console.log("lists.length:" + optionsList[index].lists.length);
    for (var k = 0; k < optionsList[index].lists.length; k++) {
      if (optionsList[index].lists[k] == value) {
        console.log("yes! value:" + value);
        checkedIdx = k;
        break;
      }
    }
    let checked = this.data.optionsList[index].lists[checkedIdx];
    this.setData({
      [change]: value,
      [string]: checked
    })
    console.log("change:" + this.data.checkedOpList);

    let jsonCheckedOpList = JSON.stringify(checkedOpList);
    let checkedIndex;
    let checkedImage, checkedPrice;

    for (var j = 0; j < optionsPrice.length; j++) {
      let referenceOption = optionsPrice[j].split(",");
      let argsLen = this.data.product.argsname.split(";").length;
      let referenceOptionLen = referenceOption.length;
      referenceOption.splice(argsLen, referenceOptionLen - argsLen);
      let jsonReferenceOption = JSON.stringify(referenceOption);
      checkedImage = this.data.checkedImage;
      checkedPrice = this.data.checkedPrice;

      console.log("referenceOption:" + referenceOption + ",jsonCheckedOpList:" + jsonCheckedOpList);
      console.log("compare:" + (JSON.stringify(referenceOption) == JSON.stringify(checkedOpList)));

      if (jsonCheckedOpList == jsonReferenceOption) {
        console.log("no default:true");
        checkedIndex = j;
        let tempCheckedPrice = optionsPrice[j].split(",");
        checkedImage = app.globalData.baseUrl1 + '/public/' + tempCheckedPrice[argsLen + 1];
        checkedPrice = tempCheckedPrice[argsLen];
        break;
      } else {
        console.log("no default:false");
        checkedImage = this.data.product.image1;
        checkedPrice = this.data.product.price;
      }
    }
    this.setData({
      checkedImage,
      checkedPrice
    })

    // for (var i = 0; i < optionsList.length; i++) {
    //   var string_key = 'optionsList[' + i + '].checked';
    //   var string_value = value
    //   if (optionsList[i].field == key) {
    //     this.setData({
    //       [string_key]: string_value
    //     })
    //   }
    //   console.log("checked:" + JSON.stringify(this.data.optionsList[i].checked));
    // }

    let opLen = this.data.optionsList.length;
    let checkedLen = this.data.checkedOpList.length;
    let tempPass = true;
    console.log("opLen:" + opLen + ",checkedLen:" + checkedLen);
    if (opLen == checkedLen) {
      for (var i = 0; i < checkedLen; i++) {
        console.log("array[" + i + "]:" + checkedOpList[i]);
        console.log("undefined:" + (typeof (checkedOpList[i]) == "undefined"));
        if (typeof (checkedOpList[i]) == "undefined") {
          tempPass = false;
          break;
        }
      }
    } else {
      tempPass = false;
    }
    console.log("tempPass:" + tempPass);
    if (tempPass) {
      this.setData({
        passOption: true
      });
    }
  },

  optionsClose: function () {
    this.setData({
      show: false
    })
  },

  subtract() {
    let buyCount = this.data.buyCount;
    let subtractDisabled = this.data.subtractDisabled;
    if (!(subtractDisabled)) {
      buyCount--;
    } else {}
    if (buyCount <= 1) {
      subtractDisabled = true;
    } else {
      subtractDisabled = false;
    }
    this.setData({
      buyCount: buyCount,
      subtractDisabled: subtractDisabled
    })
  },

  addCount() {
    let buyCount = this.data.buyCount;
    let addCountDisabled = this.data.addCountDisabled;
    let subtractDisabled = this.data.subtractDisabled
    if (!(addCountDisabled)) {
      buyCount++;
    } else {}
    if (buyCount > 1) {
      subtractDisabled = false;
    } // else {
    //   subtractDisabled = false;
    // }
    this.setData({
      buyCount: buyCount,
      addCountDisabled: addCountDisabled,
      subtractDisabled: subtractDisabled
    })
  },

  check() {

    let buyCount = this.data.buyCount;
    let passOption = this.data.passOption;
    if (buyCount && passOption) {
      this.setData({
        passConfirm: true
      })
    } else if (!(passOption)) {
      this.optionsOpen();
      wx.showToast({
        title: '请选择 商品参数',
        icon: 'none'
      })
    } else if (!(buyCount)) {
      this.optionsOpen();
      wx.showToast({
        title: '请至少购买一件该商品',
        icon: 'none'
      })
    }
  },


  orderConfirm() {
    console.log("orderConfirm");
    let user = wx.getStorageSync('user');
    if (user != "") {
      this.check();
      let buyCount = this.data.buyCount;
      let passOption = this.data.passOption;
      let passConfirm = this.data.passConfirm;
      console.log("buyCount:" + buyCount + ",passOption:" + passOption + ",passConfirm:" + passConfirm);
      if (passConfirm) {
        this.setData({
          orderList: []
        });
        let order = {},
          product = {},
          orderItem = {},
          orderList = this.data.orderList;
        let checkedOpList = this.data.checkedOpList;
        product["id"] = this.data.product.id;
        product["store"] = this.data.product.store;
        console.log("product.store:" + product.store);
        product["cPrice"] = this.data.checkedPrice;
        product["name"] = this.data.product.name;
        product["index_img"] = this.data.checkedImage;
        product["checkedImage"] = this.data.checkedImage;
        product["checkedPrice"] = this.data.checkedPrice;
        console.log("price:" + product.cPrice);
        order["product"] = product;
        order["buyCount"] = this.data.buyCount;
        order["checkedOpList"] = checkedOpList;
        let totalOrderList = wx.getStorageSync('totalOrderList');
        let username = "";
        let userid = -1;
        console.log("goodDetails-userid:" + user.id);
        username = user.username;
        userid = user.id;
        let productIDNumber = this.data.product.idnumber;

        let date = new Date();
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        let createtime = year + month + day + hours + minutes;
        console.log("createtime:" + createtime.toString());

        let orderid;
        orderid = createtime + username + productIDNumber;

        order["id"] = orderid;
        console.log("order:" + JSON.stringify(order));
        orderItem["order"] = order;
        orderList.unshift(orderItem);
        console.log("toString:" + orderList[0].order.checkedOpList.toString());
        console.log("orderList:" + JSON.stringify(orderList));
        let jsonOrderList = JSON.stringify(orderList);


        wx.request({
          url: app.globalData.baseUrl + "/api/order/new", // 请求的接口地址，必须基于 https 协议
          method: 'POST',
          // header: {  
          //   'Content-Type': 'application/x-www-form-urlencoded'  
          // },
          data: {
            orderid: orderid,
            userid: userid,
            productid: this.data.product.id,
            addressid: 0,
            args: orderList[0].order.checkedOpList.toString(),
            price: orderList[0].order.product.checkedPrice,
            count: orderList[0].order.buyCount,
            ttprice: (orderList[0].order.product.checkedPrice * orderList[0].order.buyCount).toFixed(2),
            delivery: "快递配送",
            remark: "",
          },
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (res.data.errno != -1) {
              let orderList1 = [];
              let orderid1 = res.data.data.id;
              orderList1.push(orderid1);
              this.afterConfirm(orderList1);
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
    } else {
      let that = this;
      wx.showModal({
        title: '警告',
        content: '此操作需要登录后才能继续',
        success: (res) => {
          if (res.cancel) {}
          if (res.confirm) {
            console.log("confirm!");
            wx.showActionSheet({
              alertText: "请选择登录方式",
              itemList: ["微信授权登录", "账号密码登录"],
              success(res) {
                console.log("tapIndex:" + res.tapIndex);
                if (res.tapIndex == 0) {
                  wx.login({
                    success: (res) => {
                      console.log(res);
                      wx.request({
                        url: app.globalData.baseUrl1 + '/api/judge/miniProLogin',
                        method: 'POST',
                        data: {
                          code: res.code
                        },
                        success: (res1) => {
                          console.log(res1);
                          if (res1.statusCode == 200 && res1.data.errno != -1) {
                            console.log("yes");
                            if (res1.data.data.username) {
                              wx.showToast({
                                title: '登录成功!',
                              })
                            } else {
                              wx.showToast({
                                title: '注册登录成功!',
                              })
                            }
                            let obj = {
                              id: res1.data.data.id,
                              username: '用户' + res1.data.data.id
                            }
                            wx.setStorageSync('user', obj);
                            // that.onLoad();
                          } else {
                            wx.showToast({
                              title: '请稍后再试',
                              icon: 'error'
                            })
                          }
                        }
                      })
                    },
                  })
                } else if (res.tapIndex == 1) {
                  that.setData({
                    loginShow: true,
                    registerShow: false
                  })
                }
              }
            })
          }
        }
      })
    }

  },

  afterConfirm(orderList1) {
    let user = wx.getStorageSync('user');
    let userid = user.id;
    console.log("userid:" + userid);
    // console.log("options:" + JSON.stringify(options));
    wx.request({
      url: app.globalData.baseUrl + '/api/address/list?userid=' + userid,
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        if (res.data.errno != -1 && res.data.data.length > 0) {
          let resdata = res.data.data;
          for (var i = 0; i < resdata.length; i++) {
            if (resdata[i].defaultad) {
              let defaultAddressid = resdata[i].id;
              this.afterAfterConfirm(orderList1, defaultAddressid);
              break;
            }
          }
        } else {
          let jsonOrderList1 = JSON.stringify(orderList1);
          wx.navigateTo({
            url: `/pages/orderConfirm/orderConfirm?orderList=` + jsonOrderList1,
          });
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  },

  afterAfterConfirm(orderList1, defaultAddressid) {
    let orderId = orderList1[0];
    wx.request({
      url: app.globalData.baseUrl + "/api/order/update?id=" + orderId, // 请求的接口地址，必须基于 https 协议
      method: 'POST',
      // header: {  
      //   'Content-Type': 'application/x-www-form-urlencoded'  
      // },
      data: {
        addressid: defaultAddressid,
        delivery: "快递配送",
        remark: "",
      },
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {
          let jsonOrderList1 = JSON.stringify(orderList1);
          wx.navigateTo({
            url: `/pages/orderConfirm/orderConfirm?orderList=` + jsonOrderList1,
          });
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
  },

  addCart() {
    let user = wx.getStorageSync('user');
    let userid;
    if (user != "") {
      this.check();
      userid = user.id;
      let productid = this.data.product.id;
      let buyCount = this.data.buyCount;
      let passOption = this.data.passOption;
      let passConfirm = this.data.passConfirm;
      let cartList = wx.getStorageSync('cartList');
      let cartItem = {},
        cart = {},
        product = {};
      if (passConfirm) {
        let checkedOpList = this.data.checkedOpList;

        wx.request({
          url: app.globalData.baseUrl + "/api/cart/new", // 请求的接口地址，必须基于 https 协议
          method: 'POST',
          // header: {  
          //   'Content-Type': 'application/x-www-form-urlencoded'  
          // },
          data: {
            userid: userid,
            productid: productid,
            args: checkedOpList,
            price: this.data.checkedPrice,
            count: buyCount,
            ttprice: (this.data.checkedPrice * buyCount).toFixed(2)
          },
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (res.data.errno != -1) {
              wx.showToast({
                title: '添加成功'
              })
              this.setData({
                show: false
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

        // product["id"] = this.data.product.id;
        // product["store"] = this.data.product.store;
        // console.log("product.store:" + product.store);
        // product["cPrice"] = this.data.product.cPrice;
        // product["name"] = this.data.product.title;
        // product["idnumber"] = this.data.product.idnumber;
        // product["index_img"] = this.data.product.index_img;
        // product["checkedImage"] = this.data.checkedImage;
        // product["checkedPrice"] = this.data.checkedPrice;
        // console.log("price:" + product.cPrice);
        // cartItem["product"] = product;
        // cartItem["buyCount"] = this.data.buyCount;
        // cartItem["checkedOpList"] = checkedOpList;
        // if (!cartList) {
        //   cartList = [];
        // }
        // cartList.unshift(cartItem);
        // this.setData({
        //   cartItem
        // });
        // if (cartList.length) {
        //   this.setData({
        //     cartList
        //   })
        //   wx.setStorageSync('cartList', cartList);
        // }
        // wx.showToast({
        //   title: '添加成功！',
        // });
      }
    } else {
      let that = this;
      wx.showModal({
        title: '警告',
        content: '此操作需要登录后才能继续',
        success: (res) => {
          if (res.cancel) {}
          if (res.confirm) {
            console.log("confirm!");
            wx.showActionSheet({
              alertText: "请选择登录方式",
              itemList: ["微信授权登录", "账号密码登录"],
              success(res) {
                console.log("tapIndex:" + res.tapIndex);
                if (res.tapIndex == 0) {
                  wx.login({
                    success: (res) => {
                      console.log(res);
                      wx.request({
                        url: app.globalData.baseUrl1 + '/api/judge/miniProLogin',
                        method: 'POST',
                        data: {
                          code: res.code
                        },
                        success: (res1) => {
                          console.log(res1);
                          if (res1.statusCode == 200 && res1.data.errno != -1) {
                            console.log("yes");
                            if (res1.data.data.username) {
                              wx.showToast({
                                title: '登录成功!',
                              })
                            } else {
                              wx.showToast({
                                title: '注册登录成功!',
                              })
                            }
                            let obj = {
                              id: res1.data.data.id,
                              username: '用户' + res1.data.data.id
                            }
                            wx.setStorageSync('user', obj);
                            that.onLoad();
                          } else {
                            wx.showToast({
                              title: '请稍后再试',
                              icon: 'error'
                            })
                          }
                        }
                      })
                    },
                  })
                } else if (res.tapIndex == 1) {
                  that.setData({
                    loginShow: true,
                    registerShow: false
                  })
                }
              }
            })
          }
        }
      })
    }
  },

  toChat() {
    wx.showToast({
      title: '客服功能作者还在学习中，敬请期待~',
      icon: 'none',
      duration: 3000
    })
  },

  toFaved() {
    let user = wx.getStorageSync('user');
    if (user != "") {
      let userid = user.id;
      let product = this.data.product;
      let productid = product.id;
      let faved = product.faved;
      if (faved) {
        wx.request({
          url: app.globalData.baseUrl + '/api/fav/delete?userid=' + userid + '&productid=' + productid,
          method: 'GET',
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (!res.data.errno) {
              this.changeFavUser(userid, productid, false);
            } else {
              wx.showToast({
                title: '操作失败，请稍后再试',
                icon: 'error'
              })
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      } else {
        wx.request({
          url: app.globalData.baseUrl + '/api/fav/new?userid=' + userid + '&productid=' + productid,
          method: 'GET',
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (!res.data.errno) {
              this.changeFavUser(userid, productid, true);
            } else {
              wx.showToast({
                title: '操作失败，请稍后再试',
                icon: 'error'
              })
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    } else {
      wx.showToast({
        title: '未登录，请先登录',
        icon: 'error'
      })
    }

    // let product = this.data.product;
    // let productList = wx.getStorageSync('productList');
    // let favedList = wx.getStorageSync('favedList');
    // let delete_idx;
    // if (product.faved) {
    //   product.faved = false;
    //   for (var i = 0; i < favedList.length; i++) {
    //     if (favedList[i].id == product.id) {
    //       delete_idx = i;
    //       break;
    //     }
    //   }
    //   favedList.splice(delete_idx, 1);
    //   wx.removeStorageSync('favedDot');
    // } else {
    //   product.faved = true;
    //   if (favedList) {
    //     favedList.unshift(product);
    //   } else {
    //     favedList = [];
    //     favedList.unshift(product);
    //   }
    //   wx.setStorageSync('favedDot', true);
    // }
    // console.log("favedList:" + JSON.stringify(favedList));
    // this.setData({
    //   product
    // })
    // productList.forEach(function (item) {
    //   if (item.id == product.id) {
    //     console.log("yes!productId:" + product.id);
    //     item.faved = product.faved;
    //   }
    //   console.log("product.faved:" + item.faved);
    // })
    // wx.setStorageSync('productList', productList);
    // wx.setStorageSync('favedList', favedList);
  },

  changeFavUser(userid, productid, boolean) {
    let product = this.data.product;
    if (!boolean) {
      let replaceChar = product.favuser.replace(userid + ';', '');
      wx.request({
        url: app.globalData.baseUrl + '/api/products/update?id=' + productid + '&favUserList=' + replaceChar,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          if (!res.data.errno) {
            wx.showToast({
              title: '取消收藏成功！',
            })
            product.faved = boolean;
            this.setData({
              product
            })
          } else {
            wx.showToast({
              title: '操作失败，请稍后再试',
              icon: 'error'
            })
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      let replaceChar = product.favuser + userid + ';';
      wx.request({
        url: app.globalData.baseUrl + '/api/products/update?id=' + productid + '&favUserList=' + replaceChar,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          if (!res.data.errno) {
            wx.showToast({
              title: '收藏成功！',
            })
            product.faved = boolean;
            this.setData({
              product
            })
          } else {
            wx.showToast({
              title: '操作失败，请稍后再试',
              icon: 'error'
            })
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  },

  expansion(e) {
    let itemIdx = e.currentTarget.dataset.item_idx;
    let product = this.data.product;
    let expansionShow = product.judge[itemIdx].expansionShow;
    let string = 'product.judge[' + itemIdx + '].expansionShow';
    this.setData({
      [string]: !expansionShow
    })
  },

  changeCurrent(e) {
    let index = e.detail.index;
    this.setData({
      active: this.data.tabs[index].tab_name,
      toView: this.data.tabs[index].view_id
    });
    console.log("toView:" + this.data.toView);
  },

  contentScroll(e) {
    let tabViewHeight = this.data.tabViewHeight;
    console.log("tabViewHeight:" + tabViewHeight);
    let scrollTop = e.detail.scrollTop;
    console.log("e.detail.scrollTop:" + scrollTop);
    let active = this.data.active;
    let index = 0;
    for (var i = 0; i < tabViewHeight.length; i++) {
      if (scrollTop >= tabViewHeight[i - 1]) {
        console.log("i:" + i + ",scrollTop>=:" + (scrollTop >= tabViewHeight[i - 1]));
        index = i;
      }
    }

    this.setData({
      active: this.data.tabs[index].tab_name
    })
  },

  loginClose() {
    this.setData({
      loginShow: false
    })
  },

  logined(user) {
    this.setData({
      logined: true,
      loginShow: false,
      user: user.detail
    })
    console.log("user:" + JSON.stringify(this.data.user))
  },

  goRegister() {
    this.setData({
      loginShow: false,
      registerShow: true
    })
  },

  loginOpen() {
    this.setData({
      loginShow: true,
      registerShow: false
    })
  },

  registerOpen() {
    this.setData({
      loginShow: false,
      registerShow: true
    })
  },

  registerClose() {
    this.setData({
      registerShow: false
    })
  },

  goLogin() {
    this.setData({
      loginShow: true,
      registerShow: false
    })
  },

})