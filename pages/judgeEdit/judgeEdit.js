const app = getApp();

// pages/judgeEdit/judgeEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    judgeImages: "",
    detailInfoShow: false,
    rearPath: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    if (e.order) {
      let jsonOrder = JSON.parse(e.order);
      let orderid = jsonOrder.id;
      wx.request({
        url: app.globalData.baseUrl + '/api/order/details?id=' + orderid,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          console.log(res);
          if (res.data.errno != -1) {
            let resdata = res.data.data[0];
            resdata.image1 = '/images/index/img-loading.png';
            console.log("订单详情请求成功！");
            this.setData({
              order: resdata
            });
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

  rateChange(e) {
    console.log("e:" + JSON.stringify(e));
    console.log("detail-e:" + e.detail);
    let value = e.detail;
    this.setData({
      value
    })
  },


  fileChange(e) {
    console.log("e:" + JSON.stringify(e));
    console.log("file:" + JSON.stringify(e.detail.file));
    let files = e.detail.file;
    let fileList = this.data.fileList;
    let judgeImages = this.data.judgeImages;
    files.forEach(function (item) {
      if (item.size > 1024 * 1024) { // 1 MB
        wx.showToast({
          title: '文件过大，请选择小于1MB的文件',
          icon: 'none'
        });
        return false; // 阻止文件上传
      } else {
      let file = {};
      file.url = item.url;
      judgeImages += item.url + ";";
      fileList.push(file);
      }
    })
    let rearPath = this.data.rearPath;
    let that = this;
    for (var i = 0; i < files.length; i++) {
      if (files[i].size <= 1024 * 1024) {
        wx.uploadFile({
          url: app.globalData.baseUrl1 + '/upload', // 上传接口地址
          filePath: files[i].url, // 文件路径
          name: 'judge', // 服务器接收文件的字段名
          formData: {
            // 可以添加其他参数，如用户信息等
          },
          success(res) {
            // 上传成功处理逻辑
            console.log(res);
            if (res.statusCode != 200) {
              wx.showToast({
                title: '上传失败，请选择小于1MB的文件或稍后再试',
                icon: 'none',
                duration: 3000
              })
            } else {
              // let tempPath = res.data;
              // tempPath = tempPath.split('\\');
              // let finalSinglePath = "";
              // for (var i = 0; i < tempPath.length - 1; i++) {
              //   finalSinglePath.concat(tempPath[i]);
              // }
              // finalSinglePath.concat(tempPath[tempPath.length - 1]);
              // console.log("finalSinglePath:" + finalSinglePath);
              rearPath += res.data + ";";
              console.log("rearPath:" + rearPath);
              let rearPathLen = rearPath.split(";").length - 1;
              console.log("rearPathLen:" + rearPathLen + ",files.length:" + files.length);
              if (rearPathLen == files.length) {
                wx.showToast({
                  title: '上传成功！',
                })
              }
              that.setData({
                rearPath
              })
            }
            // 更新文件列表状态等
          },
          fail(error) {
            // 上传失败处理逻辑
            console.log('上传失败', error);
            // 可以提示用户上传失败等
          }
        });
      }

    }
    console.log("fileList:" + JSON.stringify(fileList));
    console.log("judgeImages:" + JSON.stringify(judgeImages));
    this.setData({
      fileList,
      judgeImages
    });
  },

  deleteFile() {
    wx.showToast({
      title: '删除文件功能还在开发中，敬请期待',
      icon: 'none'
    })
  },

  check(judgeItem) {
    console.log("check-value:" + JSON.stringify(judgeItem));
    if (!judgeItem.star) {
      wx.showToast({
        title: '请评分',
        icon: "none"
      })
      this.setData({
        pass: false
      })
      return;
    }
    // if (!judgeItem.content) {
    //   wx.showToast({
    //     title: '请输入评价内容',
    //     icon: "none"
    //   })
    //   this.setData({
    //     pass: false
    //   })
    //   return;
    // }
    if (typeof (this.data.pass) == "undefined" || !this.data.pass) {
      this.setData({
        pass: true
      })
    }
    console.log("pass:" + this.data.pass);
  },

  formSubmit(e) {
    console.log("e:" + JSON.stringify(e));
    let productList = wx.getStorageSync('productList');
    let judgeItem = e.detail.value;
    this.check(judgeItem);
    console.log("rearPath:" + this.data.rearPath);

    if (this.data.pass) {

      const value = e.detail.value;
      let images = "";
      if (typeof (this.data.rearPath) != "undefined") {
        images = this.data.rearPath;
      }
      wx.request({
        url: app.globalData.baseUrl1 + "/api/judge/addJudge",
        method: 'POST',
        data: {
          orderid: value.orderid,
          rate: value.star,
          content: value.content,
          images: images
        },
        // header: {
        //   'content-type': 'multipart/form-data; boundary=XXX'
        // },
        success: function (res) {
          //参数值为res.data,直接将返回的数据传入
          console.log(res);
          if (res.statusCode == 200) {
            wx.request({
              url: app.globalData.baseUrl + '/api/order/update?id=' + value.orderid + '&status=' + 4,
              method: 'GET',
              success: (res) => { // 请求成功之后的回调函数
                console.log(res);
                if (res.data.errno != -1) {
                  wx.showToast({
                    title: '评价成功！'
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
          } else {
            wx.showToast({
              title: '请稍后再试',
              icon: "none"
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })

    } else {
      this.check(judgeItem);
    }
  }
})