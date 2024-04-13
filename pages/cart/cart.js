const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';

// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // products: [
    //   {
    //     "id": 1,
    //     "name": "男童防晒衣夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //     "oPrice": 180,
    //     "cPrice": 170,
    //     "index_img": "/images/index/floor/products/miaosha-1.jpg"
    //   },
    //   {
    //     "id": 2,
    //     "name": "夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //     "oPrice": 490,
    //     "cPrice": 190,
    //     "index_img": "/images/index/floor/products/miaosha-2.jpg"
    //   },
    //   {
    //     "id": 3,
    //     "name": "男童防晒衣夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //     "oPrice": 180,
    //     "cPrice": 170,
    //     "index_img": "/images/index/floor/products/miaosha-1.jpg"
    //   },
    //   {
    //     "id": 4,
    //     "name": "夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //     "oPrice": 490,
    //     "cPrice": 190,
    //     "index_img": "/images/index/floor/products/miaosha-2.jpg"
    //   },
    //   {
    //     "id": 5,
    //     "name": "hellokitty童装 2019夏季新款儿童透气网眼女童棉袜中大童袜子",
    //     "oPrice": 180,
    //     "cPrice": 170,
    //     "index_img": "/images/index/floor/products/kanjia-1.jpg",
    //     "options": [
    //       {
    //         "name": "网络类型",
    //         "lists":["WIFI","4G"]
    //       },
    //       {
    //         "name": "新订单提示",
    //         "lists":["滴滴声","真人语音"]
    //       },
    //       {
    //         "name": "切纸方式",
    //         "lists":["手动撕纸","自动切纸"]
    //       },
    //       {
    //         "name": "对接方式",
    //         "lists":["自己对接","系统对接"]
    //       }
    //     ]
    //   },
    //   {
    //     "id": 6,
    //     "name": "2019夏季新款儿童透气网眼女童棉袜中大童袜子 hellokitty童装",
    //     "oPrice": 180,
    //     "cPrice": 170,
    //     "index_img": "/images/index/floor/products/kanjia-2.jpg"
    //   }
    // ]
    show: false,
    edit: false,
    cartList: [],
    addOrderIds: [],
    checkedLen: 0,
    loginShow: false,
    registerShow: false,
    noLogin: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let user = wx.getStorageSync('user');
    if (user != "") {
      let userid = user.id;
      wx.request({
        url: app.globalData.baseUrl + '/api/cart/list?userid=' + userid,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数       
          let resdata = res.data.data;
          this.setData({
            cartList: resdata
          });
          this.initCart();
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.setData({
        noLogin: true
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
    this.onLoad();
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

  checkLogin() {
    let user = wx.getStorageSync('user');
    console.log("storage-user:" + JSON.stringify(user));
    if (user != "") {

      this.setData({
        loginShow: false,
        user,
        logined: true
      })

      this.afterLogined();

      return true;

    } else {
      // this.setData({
      //   loginShow: true,
      //   user
      // })
      let that = this;
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
                      that.setData({
                        user: obj,
                        noLogin: false
                      })
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
      return false;
    }
  },

  goShopping() {
    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  loginClose() {
    this.setData({
      loginShow: false
    })
  },

  logined(user) {
    this.setData({
      loginShow: false
    })
  },

  goRegister() {
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
    this.checkLogin();
  },

  goToDetails(e) {
    console.log(e);
    let productid = e.currentTarget.dataset.item_id;
    wx.navigateTo({
      url: '/pages/goodsDetails/goodsDetails?itemId=' + productid,
    })
  },

  changeChecked(e) {
    let cartList = this.data.cartList;
    let index = e.currentTarget.dataset.item_idx;
    console.log("checked-index:" + e.currentTarget.dataset.item_idx);
    if (cartList[index].checked) {
      cartList[index].checked = false;
    } else {
      cartList[index].checked = true;
    }
    this.setData({
      cartList
    });
    this.statistics();
  },

  changeAll() {
    let allChecked = this.data.allChecked;
    let cartList = this.data.cartList
    if (allChecked) {
      cartList.forEach(function (item) {
        item.checked = false;
      })
    } else {
      cartList.forEach(function (item) {
        item.checked = true;
      })
    }
    this.setData({
      cartList
    })
    this.statistics();
  },

  subtract(e) {
    let cartList = this.data.cartList;
    console.log("click-index:" + e.currentTarget.dataset.item_idx);
    let index = e.currentTarget.dataset.item_idx;
    let cartId = cartList[index].cartid;
    let buyCount = cartList[index].count;
    let string = 'cartList[' + index + '].count';
    let string1 = 'cartList[' + index + '].checked';
    if (!(cartList[index].subtractDisabled)) {
      buyCount -= 1;
    }
    wx.request({
      url: app.globalData.baseUrl + "/api/cart/update?id=" + cartId, // 请求的接口地址，必须基于 https 协议
      method: 'POST',
      // header: {  
      //   'Content-Type': 'application/x-www-form-urlencoded'  
      // },
      data: {
        args: cartList[index].checkedOpList.toString(),
        price: cartList[index].checkedPrice,
        count: buyCount,
        ttprice: (cartList[index].checkedPrice * cartList[index].count).toFixed(2)
      },
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          this.setData({
            [string]: buyCount,
            [string1]: true
          });
          this.statistics();
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

  addCount(e) {
    let cartList = this.data.cartList;
    console.log("click-index:" + e.currentTarget.dataset.item_idx);
    let index = e.currentTarget.dataset.item_idx;
    let cartId = cartList[index].cartid;
    let buyCount = cartList[index].count;
    let string = 'cartList[' + index + '].count';
    let string1 = 'cartList[' + index + '].checked';
    if (!(cartList[index].addCountDisabled)) {
      buyCount += 1;
    }
    wx.request({
      url: app.globalData.baseUrl + "/api/cart/update?id=" + cartId, // 请求的接口地址，必须基于 https 协议
      method: 'POST',
      // header: {  
      //   'Content-Type': 'application/x-www-form-urlencoded'  
      // },
      data: {
        args: cartList[index].checkedOpList.toString(),
        price: cartList[index].checkedPrice,
        count: buyCount,
        ttprice: (cartList[index].checkedPrice * cartList[index].count).toFixed(2)
      },
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {
          wx.showToast({
            title: '操作成功',
            icon: 'none'
          })
          this.setData({
            [string]: buyCount,
            [string1]: true
          });
          this.statistics();
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

  initCart() {
    let cartList = this.data.cartList;
    let checkedCount = 0;
    let totalPrice = 0;
    let cartListLen = this.data.cartList.length;
    if (cartList.length) {

      cartList.forEach(function (item) {
        let singleCount = item.count;
        let singlePrice = item.price;
        if (item.checked) {
          checkedCount++;
          totalPrice += (singleCount * singlePrice);
        }
        if (singleCount == 1) {
          item.subtractDisabled = true;
        } else {
          item.subtractDisabled = false;
        }
      });
      if (checkedCount == cartListLen) {
        this.setData({
          allChecked: true
        })
      } else {
        this.setData({
          allChecked: false
        })
      }
      totalPrice = totalPrice.toFixed(2);
      this.setData({
        cartList,
        checkedCount,
        totalPrice
      });
      cartList.forEach(function (item) {
        let checkedOpString = "";
        if (typeof (item.checkedOpList) == "undefined" || (item.checkedOpList == "")) {
          item.checkedOpList = item.args.split(",");
        }
        item.checkedOpList.forEach(function (items) {
          checkedOpString += (items + ';');
        });
        item.checkedOpList1 = checkedOpString;
        item.checkedPrice = item.price;
        item.checkedImage = app.globalData.baseUrl1 + '/public/' + item.image;
      })
      this.setData({
        cartList
      });
    }
  },

  statistics() {
    let cartList = this.data.cartList;
    let checkedCount = 0;
    let totalPrice = 0;
    let cartListLen = this.data.cartList.length;
    if (cartList.length) {

      cartList.forEach(function (item) {
        let singleCount = item.count;
        let singlePrice = item.price;
        if (item.checked) {
          checkedCount++;
          totalPrice += (singleCount * singlePrice);
        }
        if (singleCount == 1) {
          item.subtractDisabled = true;
        } else {
          item.subtractDisabled = false;
        }
      });
      if (checkedCount == cartListLen) {
        this.setData({
          allChecked: true
        })
      } else {
        this.setData({
          allChecked: false
        })
      }
      totalPrice = totalPrice.toFixed(2);
      this.setData({
        cartList,
        checkedCount,
        totalPrice
      });
    }
  },

  optionsOpen(e) {
    console.log("click-idx:" + e.currentTarget.dataset.item_idx);
    let cartList = this.data.cartList;
    let changeOpIdx = e.currentTarget.dataset.item_idx;
    let changeId = cartList[changeOpIdx].productid;
    let checkedOpList = cartList[changeOpIdx].checkedOpList;
    console.log("optionsOpen-checkedOpList:" + checkedOpList);
    let productList;
    wx.request({
      url: app.globalData.baseUrl + '/api/products/details?id=' + changeId,
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {
          productList = res.data.data;
          let optionList = [];
          let checkedOpList = cartList[changeOpIdx].checkedOpList;
          console.log("optionsOpen-chackedOpList:" + checkedOpList);
          let optionsPrice = productList.argsassemblyvalue.split(";");
          let productId;
          let optionsNameList = productList.argsname.split(";");
          let optionListsList = productList.argsvalue.split(";");
          for (var i = 0; i < optionsNameList.length; i++) {
            let tempLists = optionListsList[i].split(",");
            let obj = {
              name: optionsNameList[i],
              lists: tempLists
            }
            optionList.push(obj);
          }
          productId = changeOpIdx;
          // productList.forEach(function (item) {
          //   if (item.id == cartList[changeOpIdx].product.id) {
          //     optionList = item.options;
          //     productId = item.id;
          //   }
          // })
          for (var i = 0; i < optionList.length; i++) {
            optionList[i].checked = checkedOpList[i];
          }
          console.log("optionList:" + JSON.stringify(optionList) + ",checkedOpList:" + JSON.stringify(checkedOpList) + ",productId:" + productId + ",optionsPrice:" + optionsPrice);
          this.setData({
            show: true,
            changeOpIdx,
            optionList,
            checkedOpList,
            optionsPrice,
            originPrice: cartList[changeOpIdx].defaultprice,
            originImage: cartList[changeOpIdx].checkedImage
          });
          wx.setStorageSync('checkedOpList', checkedOpList);
          this.changeSinglePrice();
        }
      },
      error: (err) => {
        console.log(err);
      }
    })
  },

  changeSinglePrice() {
    let cartList = this.data.cartList;
    let changeOpIdx = this.data.changeOpIdx;
    let checkedOpList = wx.getStorageSync('checkedOpList');
    let jsonCheckedOpList = JSON.stringify(checkedOpList);
    let optionsPrice = this.data.optionsPrice;
    let product = cartList[changeOpIdx];
    let checkedIndex = -1;
    let tempCheckedImage, tempCheckedPrice;
    tempCheckedImage = this.data.checkedImage;
    tempCheckedPrice = this.data.checkedPrice;
    let originPrice = this.data.originPrice;
    let originImage = this.data.originImage;
    console.log("product:" + JSON.stringify(product));
    console.log("checkedOpList:" + JSON.stringify(checkedOpList) + ",optionsPrice:" + JSON.stringify(optionsPrice));
    console.log("optionsPriceLen:" + optionsPrice.length);
    console.log("originPrice:" + originPrice + ",originImage:" + originImage);
    this.setData({
      checkedName: product.title
    })
    let checkedOpString = "";
    if (typeof (checkedOpList) == 'string') {
      checkedOpList = checkedOpList.split(',');
    }
    checkedOpList.forEach(function (items) {
      checkedOpString += (items + ';');
    });
    let checkedOpList1 = checkedOpString;
    console.log("1-checkedOpList1:" + checkedOpList1);
    for (var j = 0; j < optionsPrice.length; j++) {
      let tempReferenceOption = optionsPrice[j].split(",");
      let referenceOption = tempReferenceOption;
      referenceOption.splice(checkedOpList.length, tempReferenceOption.length - checkedOpList.length);
      let jsonReferenceOption = JSON.stringify(referenceOption);

      console.log("referenceOption:" + referenceOption);
      console.log("compare:" + (JSON.stringify(referenceOption) == JSON.stringify(checkedOpList)));

      if (jsonCheckedOpList === jsonReferenceOption) {
        console.log("no default:true");
        checkedIndex = j;
        break;
      } else {}
    }

    if (checkedIndex != -1) {
      console.log("no default:true");
      let tempReferenceOption = optionsPrice[checkedIndex].split(",");
      tempCheckedImage = app.globalData.baseUrl1 + '/public/' + tempReferenceOption[checkedOpList.length + 1];
      tempCheckedPrice = tempReferenceOption[checkedOpList.length];
    } else {
      console.log("no default:false");
      tempCheckedImage = originImage;
      tempCheckedPrice = originPrice;
    }

    this.setData({
      tempCheckedImage,
      tempCheckedPrice,
      tempCheckedOplist1: checkedOpList1
    });

  },

  changeOption(e) {
    let optionList = this.data.optionList;
    let key = e.currentTarget.dataset.key;
    let value = e.currentTarget.dataset.value;
    let index = e.currentTarget.dataset.index;
    let checkedOpList = wx.getStorageSync('checkedOpList');
    let changeOpIdx = this.data.changeOpIdx;
    var change = 'checkedOpList[' + index + ']';

    let temp = this.data.cartList;
    console.log("before-temp:" + temp[changeOpIdx].checkedOpList);

    console.log("optionList:" + JSON.stringify(optionList) + ",key:" + key + ",vlaue:" + value + ",index:" + index + ",checkedOpList:" + JSON.stringify(checkedOpList) + ",changeOpIdx:" + changeOpIdx);

    // this.setData({
    //   [change]: value
    // })
    checkedOpList[index] = value;

    temp = this.data.cartList;
    console.log("after-temp:" + temp[changeOpIdx].checkedOpList);

    for (var i = 0; i < optionList.length; i++) {
      var string_key = 'optionList[' + i + '].checked';
      var string_value = value
      for (var j = 0; j < optionList[i].lists.length; j++) {
        if (optionList[i].lists[j] == value) {
          this.setData({
            [string_key]: string_value
          })
        }
      }
      console.log("checked:" + optionList[i].checked);
    }

    this.setData({
      checkedOpList
    })
    wx.setStorageSync('checkedOpList', checkedOpList);
    let cartList = this.data.cartList;
    console.log("after-change:" + JSON.stringify(cartList[changeOpIdx].checkedOpList + ",storage:" + wx.getStorageSync('checkedOpList')));
    this.changeSinglePrice();
    // this.statistics();
  },

  optionsClose() {
    this.setData({
      show: false
    })
  },

  optionsConfirm() {
    let cartList = this.data.cartList;
    let changeOpIdx = this.data.changeOpIdx;
    let cartId = cartList[changeOpIdx].cartid;
    let tempCheckedOplist1 = this.data.tempCheckedOplist1;
    let tempCheckedPrice = this.data.tempCheckedPrice;
    let tempCheckedImage = this.data.tempCheckedImage;
    let checkedOpList = this.data.checkedOpList;
    console.log("string-checkedOpList:" + this.data.checkedOpList.toString());

    // cartList[changeOpIdx].checkedPrice = tempCheckedPrice;
    // cartList[changeOpIdx].checkedImage = tempCheckedImage;
    // cartList[changeOpIdx].checkedOpList = checkedOpList;
    // cartList[changeOpIdx].checkedOpList1 = tempCheckedOplist1;

    // console.log("no-data-cartList:" + cartList[changeOpIdx].checkedOpList1);

    let string = 'cartList[' + changeOpIdx + '].checkedPrice';
    let string1 = 'cartList[' + changeOpIdx + '].checkedImage';
    let string2 = 'cartList[' + changeOpIdx + '].checkedOpList1';
    let string3 = 'cartList[' + changeOpIdx + '].checkedOpList';
    let string4 = 'cartList[' + changeOpIdx + '].checked';

    wx.request({
      url: app.globalData.baseUrl + "/api/cart/update?id=" + cartId, // 请求的接口地址，必须基于 https 协议
      method: 'POST',
      // header: {  
      //   'Content-Type': 'application/x-www-form-urlencoded'  
      // },
      data: {
        args: checkedOpList.toString(),
        price: tempCheckedPrice,
        count: cartList[changeOpIdx].count,
        ttprice: (tempCheckedPrice * cartList[changeOpIdx].count).toFixed(2)
      },
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1) {
          wx.showToast({
            title: '操作成功',
          })
          this.setData({
            [string]: tempCheckedPrice,
            [string1]: tempCheckedImage,
            [string2]: tempCheckedOplist1,
            [string3]: checkedOpList,

            //   // cartList,

            [string4]: true,
            checkedImage: tempCheckedImage,
            checkedPrice: tempCheckedPrice,
            show: false
          });

          let cartList1 = this.data.cartList;
          console.log("3-checkedPrice:" + cartList1[changeOpIdx].checkedPrice);

          this.statistics();

          console.log("after-3-checkedPrice:" + cartList1[changeOpIdx].checkedPrice);

          // this.afterChange();
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

  afterChange() {
    let cartList = this.data.cartList;
    let changeOpIdx = this.data.changeOpIdx;
    let tempCheckedOplist1 = this.data.tempCheckedOplist1;
    let tempCheckedPrice = this.data.tempCheckedPrice;
    let tempCheckedImage = this.data.tempCheckedImage;
    let checkedOpList = this.data.checkedOpList;

    cartList[changeOpIdx].checkedPrice = tempCheckedPrice;
    cartList[changeOpIdx].checkedImage = tempCheckedImage;
    cartList[changeOpIdx].checkedOpList = checkedOpList;
    cartList[changeOpIdx].checkedOpList1 = tempCheckedOplist1;
    // let string = 'cartList[' + changeOpIdx + '].checkedPrice';
    // let string1 = 'cartList[' + changeOpIdx + '].checkedImage';
    // let string2 = 'cartList[' + changeOpIdx + '].checkedOpList1';
    // let string3 = 'cartList[' + changeOpIdx + '].checkedOpList';
    let string4 = 'cartList[' + changeOpIdx + '].checked';
    this.setData({
      // [string]: tempCheckedPrice,
      // [string1]: tempCheckedImage,
      // [string2]: tempCheckedOplist1,
      // [string3]: checkedOpList,
      cartList,
      [string4]: true,
      checkedImage: tempCheckedImage,
      checkedPrice: tempCheckedPrice,
      show: false
    });
    this.statistics();
    let cartList1 = this.data.cartList;
    console.log("3-checkedOpList1:" + cartList1[changeOpIdx].checkedOpList1);
  },

  editOpen() {
    this.setData({
      edit: true
    })
  },

  editClose() {
    this.setData({
      edit: false
    })
  },

  toDelete(e) {
    console.log("click-idx:" + e.currentTarget.dataset.item_idx);
    let delete_idx = e.currentTarget.dataset.item_idx;
    let cartList = this.data.cartList;
    let delete_id = cartList[delete_idx].cartid;
    wx.request({
      url: app.globalData.baseUrl + '/api/cart/delete?id=' + delete_id,
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        if (res.data.errno != -1) {
          wx.showToast({
            title: '删除成功！',
          })
          cartList.splice(delete_idx, 1);
          this.setData({
            cartList
          });
          this.statistics();
        }
      },
      error: (err) => {
        console.log(err);
      }
    })

  },

  orderConfirm() {
    let cartList = this.data.cartList;
    let buyCount = this.data.checkedCount;
    let totalPrice = this.data.totalPrice;
    let tempOrder = [],
      orderItem = {};
    if (!buyCount) {
      wx.showToast({
        title: '请至少选择一件商品',
        icon: "none"
      })
    } else {
      // let totalOrderList = wx.getStorageSync('totalOrderList');
      // let orderId;
      // if (totalOrderList) {
      //   orderId = (totalOrderList[0].order.id) + 1;
      // } else {
      //   orderId = 1;
      // }
      // cartList.forEach(function (item) {
      //   if (item.checked) {
      //     let order = item;
      //     order["id"] = orderId;
      //     orderItem = {};
      //     orderItem["order"] = order;
      //     tempOrder.push(orderItem);
      //     orderId++;
      //   }
      //   item.checked = false;
      // });

      let orderIds = [];
      let username = wx.getStorageSync('user').username;
      let userid = wx.getStorageSync('user').id;
      let date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      let createtime = year + month + day + hours + minutes;
      console.log("createtime:" + createtime.toString());

      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].checked) {
          console.log("");
          let obj = {
            productid: cartList[i].productid,
            index: i
          }
          orderIds.unshift(obj);
          let productIDNumber = cartList[i].idnumber;
          let orderid;
          orderid = createtime + username + productIDNumber;
          console.log("orderid:" + orderid);
          // console.log("args:" + cartList[i].checkedOpList.toString() + ",price:" + cartList[i].product.checkedPrice + ",count:" + cartList[i].buyCount + ",ttprice:" + (cartList[i].product.checkedPrice * cartList[i].buyCount).toFixed(2));
          wx.request({
            url: app.globalData.baseUrl + "/api/order/new", // 请求的接口地址，必须基于 https 协议
            method: 'POST',
            // header: {  
            //   'Content-Type': 'application/x-www-form-urlencoded'  
            // },
            data: {
              orderid: orderid,
              userid: userid,
              productid: cartList[i].productid,
              addressid: 0,
              args: cartList[i].checkedOpList.toString(),
              price: cartList[i].checkedPrice,
              count: cartList[i].count,
              ttprice: (cartList[i].checkedPrice * cartList[i].count).toFixed(2),
              delivery: "快递配送",
              remark: "",
            },
            success: (res) => { // 请求成功之后的回调函数
              console.log(res);
              if (res.data.errno != -1) {
                let orderid = res.data.data.id;
                this.afterAddOrder(orderid);
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
      }
      // wx.setStorageSync('cartList', cartList);

      // wx.setStorageSync('tempOrder', tempOrder);
      // wx.setStorageSync('tempBuyCount', buyCount);
      // wx.setStorageSync('tempTotalPrice', totalPrice);
      // wx.reLaunch({
      //   url: `/pages/orderConfirm/orderConfirm?cart=true`,
      // })
    }
  },

  afterAddOrder(orderid) {
    let checkedCartLen = 0;
    this.data.cartList.forEach(function (item) {
      if (item.checked) {
        checkedCartLen += 1;
      }
    })
    let addOrderIds = this.data.addOrderIds;
    addOrderIds.unshift(orderid);
    this.setData({
      addOrderIds
    })
    if (addOrderIds.length == checkedCartLen) {
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
                this.afterConfirm(addOrderIds, defaultAddressid);
                break;
              }
            }
          } else {}
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  },

  afterConfirm(orderList1, defaultAddressid) {
    for (var i = 0; i < orderList1.length; i++) {
      let orderId = orderList1[i];
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
            this.finalCheck(orderList1);
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
  },

  finalCheck(orderList1) {
    let checkedLen = this.data.checkedLen;
    checkedLen += 1;
    console.log("checkedLen:" + checkedLen);
    this.setData({
      checkedLen
    })
    let checkedCartLen = 0;
    this.data.cartList.forEach(function (item) {
      if (item.checked) {
        checkedCartLen += 1;
      }
    })
    console.log("checkedCartLen:" + checkedCartLen);
    if (checkedLen == checkedCartLen) {
      let jsonOrderList1 = JSON.stringify(orderList1);
      this.data.cartList.forEach(function (item) {
        item.checked = false;
      })
      wx.setStorageSync('cartList', this.data.cartList);
      wx.redirectTo({
        url: '/pages/orderConfirm/orderConfirm?orderList=' + jsonOrderList1,
      })
    }
  }

})