
const app = getApp();

// pages/orderDetails/orderDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.itemId) {
      console.log("options.itemId:" + options.itemId);
      let item_id = options.itemId;
      let order = {};
      let firstOrder;
      let totalOrderList = wx.getStorageSync('totalOrderList');
      wx.request({
        url: app.globalData.baseUrl + '/api/order/details?id=' + item_id,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          console.log(res);
          if (res.data.errno != -1) {
            let resdata = res.data.data[0];
            console.log("订单详情请求成功！");
            order = resdata;
            let totalPrice = order.price * order.count;
            totalPrice = totalPrice.toFixed(2);
            order['totalPrice'] = totalPrice;
            if (order.addressid == 0) {
              order.area = "";
              order.deatailad = "";
              order.name = "",
              order.phoneprefix = "";
              order.phone = "";
            }
            if (order.remark != "") {
              order.tempRemarks = order.remark.substr(0,9);
            }
            order.image1 = app.globalData.baseUrl1 + '/public/' + resdata.image;
            this.setData({
              order
            });
            let currentButtons;
            let status = this.data.order.status;
            console.log("status:" + status);
            if (options.currentButtons) {
              console.log("options.currentButtons:" + options.currentButtons);
              currentButtons = JSON.parse(options.currentButtons);
            } else if (status != '已完成') {
              currentButtons = wx.getStorageSync('currentButtons');
            }
            if (status != '已完成') {
              this.setData({
                currentButtons
              })
            }
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
      // totalOrderList.forEach(function (item) {
      //   if (item.order.id == item_id) {
      //     order = item.order;
      //     firstOrder = item;
      //     console.log("item.order.status:" + item.order.status);
      //   }
      // });
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

  operation(e) {
    let currentOrder = this.data.order;
    let button_idx = e.currentTarget.dataset.button_idx;
    let currentButtons = this.data.currentButtons.buttons;
    let orderList = [];
    let way = this.data.currentButtons.way;
    let alertText, nextStatus, badge, nextBadge, successText;
    if (currentButtons[button_idx].page) {
      let page = currentButtons[button_idx].page;
      orderList.unshift(currentOrder.id);
      let jsonOrderList = JSON.stringify(orderList);
      if (way != "judge") {
        wx.setStorageSync('noPayList', true);
        wx.navigateTo({
          url: page + `?orderList=` + jsonOrderList,
        })
      } else {
        let jsonOrder = JSON.stringify(currentOrder);
        wx.navigateTo({
          url: page + `?order=` + jsonOrder,
        })
      }

    } else {
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
                  setTimeout(function () {
                    wx.switchTab({
                      url: '/pages/index/index',
                    })
                  }, 2000)
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
          }
        }
      })
    }
  },

  detailShow() {
    this.setData({
      detailInfoShow: !(this.data.detailInfoShow)
    })
  },

  back() {
    wx.navigateBack();
  }
})