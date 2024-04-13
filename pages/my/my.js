const app = getApp();
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginShow: false,
    registerShow: false,
    logined: false,
    wxLogin: false,
    user: {
      id: -1,
      username: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.setData({
      noPayCount: 0,
      noDeliverCount: 0,
      noReceiveCount: 0,
      noJudgeCount: 0
    })

    // let loginFlag = this.checkLogin();
    // console.log("loginFlag:" + loginFlag);

    // wx.showModal({
    //   title: '切换账号确认', //提示的标题
    //   content: '切换账号后本账号的购物车内的商品信息将会清空且不可恢复，确认操作吗？', //提示的内容
    //   success: function (res) {
    //     if (res.confirm) {
    //       console.log("yes!confirm!!");
    //     } else if (res.cancel) {}
    //   }
    // })

    let user = wx.getStorageSync('user');
    console.log("storage-user:" + JSON.stringify(user));
    if (user != "") {

      this.setData({
        loginShow: false,
        user,
        logined: true
      })

      this.afterLogined();

    } else {}

    // let noPayCount = wx.getStorageSync('noPayCount');
    // let noDeliverCount = wx.getStorageSync('noDeliverCount');
    // let noReceiveCount = wx.getStorageSync('noReceiveCount');
    // let noJudgeCount = wx.getStorageSync('noJudgeCount');

    let favedDot = wx.getStorageSync('favedDot');

    // if (noPayCount) {
    //   this.setData({
    //     noPayCount
    //   })
    // }
    // if (noDeliverCount) {
    //   this.setData({
    //     noDeliverCount
    //   })
    // }
    // if (noReceiveCount) {
    //   this.setData({
    //     noReceiveCount
    //   })
    // }
    // if (noJudgeCount) {
    //   this.setData({
    //     noJudgeCount
    //   })
    // }

    if (favedDot) {
      this.setData({
        favedDot
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
                            that.setData({
                              user: obj,
                              logined: true,
                              wxLogin: true
                            })
                            wx.setStorageSync('user', obj);
                            that.afterLogined();
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
      return false;
    }
  },

  goOrderList(e) {
    let loginFlag = this.checkLogin();
    if (loginFlag) {
      console.log("click-way:" + e.currentTarget.dataset.way);
      let way = e.currentTarget.dataset.way;
      wx.navigateTo({
        url: `/pages/orderList/orderList?way=` + way,
      });
    }
  },

  toAllOrder() {

    let loginFlag = this.checkLogin();
    if (loginFlag) {
      wx.navigateTo({
        url: `/pages/orderList/orderList`,
      });
    }
  },

  toFavedList() {
    let loginFlag = this.checkLogin();
    if (loginFlag) {
      wx.navigateTo({
        url: `/pages/productsList/productsList?faved=true`,
      });
    }
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
      wxLogin: false,
      user: user.detail
    })

    this.afterLogined();

    console.log("user:" + JSON.stringify(this.data.user))
  },

  afterLogined() {
    wx.request({
      url: app.globalData.baseUrl + '/api/order/list?userid=' + this.data.user.id,
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        if (res.data.errno != -1 && res.data.data.length > 0) {
          let resdata = res.data.data;
          console.log("订单列表请求成功！");
          let orderStatusList = ["noPayCount", "noDeliverCount", "noReceiveCount", "noJudgeCount"];
          let orderStatusCount = [0, 0, 0, 0];
          for (var i = 0; i < resdata.length; i++) {
            for (var j = 0; j < orderStatusList.length; j++) {
              if (resdata[i].status == j) {
                let string = orderStatusList[j];
                orderStatusCount[j]++;
                this.setData({
                  [string]: orderStatusCount[j]
                })
              }
            }
          }
        } else {}
      },
      error: (err) => {
        console.log(err);
      }
    })
  },

  goRegister() {
    this.setData({
      loginShow: false,
      registerShow: true
    })
  },

  loginOpen() {
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
                      logined: true,
                      wxLogin: true
                    })
                    wx.setStorageSync('user', obj);
                    that.afterLogined();
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

    // this.checkLogin();
    // this.setData({
    //   loginShow: true,
    //   registerShow: false
    // })
  },

  toggleUser() {
    this.loginOpen();
    // wx.showModal({
    //   title: '切换账号确认', //提示的标题
    //   content: '切换账号后本账号的购物车内的商品信息将会清空且不可恢复，确认操作吗？', //提示的内容
    //   success: function (res) {
    //   if (res.confirm) {
    // that.setData({
    //   loginShow: true,
    //   registerShow: false
    // })
    //     } else if (res.cancel) {}
    //   }
    // })
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


  loginOut() {
    let that = this;
    wx.showModal({
      title: '警告', //提示的标题
      content: '确定退出登录吗？', //提示的内容
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('user', "");
          that.setData({
            user: "",
            logined: false
          })
          wx.showToast({
            title: '退出登录成功',
          })
          that.onLoad();
        } else if (res.cancel) {}
      }
    })
  },

  goAddressList() {
    let loginFlag = this.checkLogin();
    if (loginFlag) {
      wx.navigateTo({
        url: '/pages/deliveryAddressList/deliveryAddressList'
      })
    }
  }

})