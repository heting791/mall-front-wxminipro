// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    elementsHeight: [{
      "name": "userCate",
      "height": 0
    }, {
      "name": "productsCate",
      "height": 0
    }, {
      "name": "favCate",
      "height": 0
    }, {
      "name": "addressCate",
      "height": 0
    }, {
      "name": "cartCate",
      "height": 0
    }, {
      "name": "orderCate",
      "height": 0
    }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    var query = wx.createSelectorQuery();
    query.selectAll('.func').boundingClientRect((rect) => {
      for (var i = 0; i < rect.length; i++) {
        console.log("height:" + rect[i].height);
        let string = 'elementsHeight[' + i + '].height';
        that.setData({
          [string]: rect[i].height - 8
        })
      }
    }).exec();
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

  goUrl(e) {
    console.log(e);
    let url = e.currentTarget.dataset.src;
    wx.setClipboardData({
      data: url,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  }
})