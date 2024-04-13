const app = getApp();

// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonList: [{
        "way": "pay",
        "buttons": [{
          "text": "去支付",
          "page": "/pages/orderConfirm/orderConfirm"
        }]
      },
      {
        "way": "delivery",
        "buttons": [{
          "text": "发货"
        }]
      },
      {
        "way": "receive",
        "buttons": [{
          "text": "确认收货"
        }]
      },
      {
        "way": "judge",
        "buttons": [{
          "text": "去评价",
          "page": "/pages/judgeEdit/judgeEdit"
        }]
      },
      {
        "way": "complate",
        "buttons": [{
          "text": "查看详情"
        }]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // let totalOrderList = wx.getStorageSync('totalOrderList');
    let user = wx.getStorageSync('user');
    let userid = user.id;
    let wayOrderList = [];
    let way, cnWay, rearStatus;
    let buttonList = this.data.buttonList;
    let currentButtons;
    if (options.way) {
      way = options.way;
      switch (way) {
        case 'pay':
          cnWay = "未支付";
          rearStatus = 0;
          break;
        case 'delivery':
          cnWay = "待发货";
          rearStatus = 1;
          break;
        case 'receive':
          cnWay = "待收货";
          rearStatus = 2;
          break;
        case 'judge':
          cnWay = "待评价";
          rearStatus = 3;
          break;
      }
      wx.request({
        url: app.globalData.baseUrl + '/api/order/list?userid=' + userid + '&status=' + rearStatus,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          console.log(res);
          if (res.data.errno != -1 && res.data.data.length > 0) {
            let resdata = res.data.data;
            console.log("订单列表请求成功！");
            this.setData({
              wayOrderList: resdata
            })
            console.log("image:" + JSON.stringify(this.data.wayOrderList));
            buttonList.forEach(function (item) {
              if (item.way == way) {
                currentButtons = item;
              }
            });
            this.setData({
              currentButtons,
              way
            });
            this.initImage();
            wx.setStorageSync('currentButtons', currentButtons);
          } else {
            wx.showToast({
              title: '请稍后再试',
            })
          }
        },
        error: (err) => {
          console.log(err);
        }
      })
      // if (totalOrderList) {
      //   totalOrderList.forEach(function (item) {
      //     if (item.order.status == cnWay) {
      //       wayOrderList.push(item);
      //     }
      //   })
      // }
    } else {
      wx.request({
        url: app.globalData.baseUrl + '/api/order/list?userid=' + userid,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          console.log(res);
          if (res.data.errno != -1 && res.data.data.length > 0) {
            let resdata = res.data.data;
            let totalOrderList = resdata;
            console.log("订单列表请求成功！");
            wayOrderList = totalOrderList;
            wayOrderList.forEach(function (item) {
              let status = item.status;
              let way;
              switch (status) {
                case 0:
                  way = 'pay';
                  break;
                case 1:
                  way = 'delivery';
                  break;
                case 2:
                  way = 'receive';
                  break;
                case 3:
                  way = 'judge';
                  break;
                case 4:
                  way = 'complate';
                  break;
              }
              item.way = way;
              buttonList.forEach(function (items) {
                if (items.way == way) {
                  item.buttons = items.buttons;
                }
              })
            })
            this.setData({
              wayOrderList
            })
            this.initImage();
          } else {}
        },
        error: (err) => {
          console.log(err);
        }
      })
    }


    // if (wayOrderList.length) {
    //   this.setData({
    //     wayOrderList
    //   })
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

  initImage() {
    let wayOrderList = this.data.wayOrderList;
    if (wayOrderList.length > 0) {
      for (var i = 0; i < wayOrderList.length; i++) {
        wayOrderList[i].image1 = app.globalData.baseUrl1 + '/public/' + wayOrderList[i].image;
        let status = wayOrderList[i].status;
        let way;
        switch (status) {
          case 0:
            way = '待支付';
            break;
          case 1:
            way = '待发货';
            break;
          case 2:
            way = '待收货';
            break;
          case 3:
            way = '待评价';
            break;
          case 4:
            way = '已完成';
            break;
        }
        wayOrderList[i].status1 = way;
      }
      this.setData({
        wayOrderList
      })
    }
  },

  operation(e) {
    console.log("item_idx:" + e.currentTarget.dataset.item_idx + ",button_idx:" + e.currentTarget.dataset.button_idx);
    let currentButtons, way;
    let item_idx = e.currentTarget.dataset.item_idx;
    let button_idx = e.currentTarget.dataset.button_idx;
    let itemList = this.data.wayOrderList;
    let currentOrder = itemList[item_idx];
    console.log("currentOrder:" + JSON.stringify(currentOrder));
    let orderList = [];
    let alertText, nextStatus, badge, nextBadge, successText;
    let that = this;
    if (this.data.currentButtons) {
      currentButtons = this.data.currentButtons.buttons;
      way = this.data.way;
    } else {
      currentButtons = currentOrder.buttons;
      way = currentOrder.way;
    }

    if (currentButtons[button_idx].page) {
      let page = currentButtons[button_idx].page;
      orderList.unshift(currentOrder.id);
      let jsonOrderList = JSON.stringify(orderList);
      let tempOrder = [];
      tempOrder.unshift(currentOrder);
      console.log("tempOrder:" + JSON.stringify(tempOrder));
      if (way != "judge") {
        console.log("yes!no-judge");
        wx.setStorageSync('noPayList', true);
        wx.navigateTo({
          url: page + `?orderList=` + jsonOrderList,
        })
      } else {
        console.log("else judge");
        let jsonOrder = JSON.stringify(currentOrder);
        wx.navigateTo({
          url: page + `?order=` + jsonOrder,
        })
      }
    } else if (way != 'complate') {
      let totalOrderList = wx.getStorageSync('totalOrderList');
      switch (way) {
        case 'delivery':
          alertText = "确认发货吗";
          nextStatus = "待收货";
          badge = "noDeliverCount";
          nextBadge = "noReceiveCount";
          successText = "发货成功！";
          break;
        case 'receive':
          alertText = '确认收货吗';
          nextStatus = "待评价";
          badge = "noReceiveCount";
          nextBadge = "noJudgeCount";
          successText = "收货成功！";
          break;
      }
      let badgeCount = wx.getStorageSync(badge);
      let nextBadgeCount = wx.getStorageSync(nextBadge);
      console.log("badgeCount:" + badgeCount);
      wx.showActionSheet({
        alertText: alertText,
        itemList: ["确定"],
        success(res) {
          console.log("tapIndex:" + res.tapIndex);
          if (res.tapIndex == 0) {

            let currentId = currentOrder.id;
            let status = currentOrder.status;
            console.log("currentId:" + currentId);
            wx.request({
              url: app.globalData.baseUrl + '/api/order/update?id=' + currentId + '&status=' + (status + 1),
              method: 'GET',
              success: (res) => { // 请求成功之后的回调函数
                console.log(res);
                if (res.data.errno != -1) {
                  wx.showToast({
                    title: successText,
                  });
                  itemList.splice(item_idx, 1);
                  that.setData({
                    wayOrderList: itemList
                  });
                } else {}
              },
              error: (err) => {
                console.log(err);
              }
            })

            // let deliveryTime = "";
            // if (way == "delivery") {
            //   var timestamp = Date.parse(new Date());
            //   var date = new Date(timestamp);
            //   //获取年份  
            //   var Y = date.getFullYear();
            //   //获取月份
            //   var M = date.getMonth() + 1;
            //   //获取当前天
            //   var D = date.getDate();
            //   //获取当前小时
            //   var H = date.getHours();
            //   // 获取当前分钟
            //   var S = date.getMinutes();
            //   deliveryTime = Y + '-' + M + '-' + D + ' ' + H + ':' + (S >= 10 ? S : '0' + S);
            //   console.log("发货时间：" + deliveryTime);
            // }
            // totalOrderList.forEach(function (item) {
            //   console.log("totalOrderList-id:" + item.order.id + ",currentOrder-id:" + currentOrder.order.id);
            //   if (item.order.id == currentOrder.order.id) {
            //     item.order.status = nextStatus;
            //     if (deliveryTime != "") {
            //       item.order.deliveryTime = deliveryTime;
            //     }
            //   }
            //   console.log("status:" + item.order.status);
            // });

            // setTimeout(function () {
            //   wx.showToast({
            //     title: successText,
            //   });
            //   itemList.splice(item_idx, 1);
            //   that.setData({
            //     wayOrderList: itemList
            //   });
            // }, 2000);
            // badgeCount--;
            // if (nextBadge) {
            //   nextBadgeCount++;
            // } else {
            //   nextBadgeCount = 1;
            // }
            // wx.setStorageSync('totalOrderList', totalOrderList);
            // wx.setStorageSync(badge, badgeCount);
            // wx.setStorageSync(nextBadge, nextBadgeCount);

          }
        }
      })
    } else {
      let e = {};
      e['item_id'] = currentOrder.id;
      this.toOrderDetails(e);
    }
  },

  toOrderDetails(e) {
    let item_id;
    if (e.currentTarget) {
      item_id = e.currentTarget.dataset.item_id;
    } else {
      item_id = e.item_id;
    }
    if (this.data.currentButtons) {
      wx.navigateTo({
        url: `/pages/orderDetails/orderDetails?itemId=` + item_id,
      })
    } else {
      let wayOrderList = this.data.wayOrderList;
      let currentButtons;
      wayOrderList.forEach(function (item) {
        if (item.id == item_id) {
          currentButtons = item;
        }
      })
      let jsonCurrentButtons = JSON.stringify(currentButtons);
      wx.navigateTo({
        url: `/pages/orderDetails/orderDetails?itemId=` + item_id + `&currentButtons=` + jsonCurrentButtons,
      })
    }
  }
})