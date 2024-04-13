const app = getApp();
// console.log("category.app.id:" + app.globalData.id);

Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    currentIndex: 0,
    searchHeight: '',
    intoView: '',
    tempData: [],
    allData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    let that = this;
    wx.request({
      url: app.globalData.baseUrl + '/api/category/list',
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        let categories = this.data.categories;
        res.data.data.forEach(function (item) {
          categories.push(item);
        })
        this.setData({
          categories
        })
        console.log("categories:" + JSON.stringify(categories));
        this.getProducts();
      },
      error: (err) => {
        console.log(err);
      }
    })

    wx.setStorageSync('categories', this.data.categories);

    console.log("sub-cate-list-inner:" + this.data.intoView);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight
        })
        console.log("windowHeight:" + res.windowHeight + ",screenHeight:" + res.screenHeight);
      }
    });
    console.log("windowHeight1:" + this.data.windowHeight);


    var query = wx.createSelectorQuery();
    setTimeout(function () {
      query.selectAll('.category-name').boundingClientRect((rect) => {
        var categoriesInfo = rect;
        that.setData({
          categoriesInfo: categoriesInfo
        })
        console.log("回调_category-name");
        console.log("rect:" + rect.length);
      }).exec();
    }, 500);

    // query.select('.sub-cate-box').boundingClientRect((rect) => {
    //   console.log("cname-id-rect:" + JSON.stringify(rect));
    // }).exec();

    query.select('.category-container').boundingClientRect((rect) => {
      let windowHeight = that.data.windowHeight;
      console.log("query_windowHeight:" + windowHeight);
      var categoryContainerTop = rect.top;
      let sideHeight = windowHeight;
      console.log("sideHeight:" + sideHeight);
      that.setData({
        categoryContainerTop,
        sideHeight
      })
      console.log("this.data.sideHeight:" + this.data.sideHeight);
      console.log("回调2_search");
      console.log("sub-cate-container-rect:" + JSON.stringify(rect));
    }).exec();

  },

  getProducts() {

    let categories = this.data.categories;
    console.log("scroll-categories:" + JSON.stringify(categories));
    let currentIndex = this.data.currentIndex;
    let that = this;
    console.log("category_id:" + wx.getStorageSync('category_id'));
    if (wx.getStorageSync('category_id')) {
      setTimeout(function () {
        let categoryId = wx.getStorageSync('category_id');
        currentIndex = categoryId;
        that.setData({
          currentIndex,
          intoView: "sub-cate-list-inner-" + wx.getStorageSync('category_id')
        })
        console.log("intoView:" + this.data.intoView);
      }, 500);
    }

    for (var i = 0; i < this.data.categories.length; i++) {
      wx.request({
        url: app.globalData.baseUrl + '/api/products/list?category=' + this.data.categories[i].name,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          this.initProducts(res.data.data);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  },

  initProducts(data) {
    let tempData = this.data.tempData;
    let allData = this.data.allData;
    let user = wx.getStorageSync('user');
    if (user != "") {
      let userid = user.id;
      console.log("usreid:" + userid);
      for (var i = 0; i < data.length; i++) {
        let favUser = data[i].favuser;
        if (favUser != "") {
          favUser = favUser.split(";");
          for (var j = 0; j < favUser.length; j++) {
            if (favUser[j] == userid) {
              data[i].faved = true;
            }
          }
        }
      }
    }
    let obj = {
      lists: data
    };
    tempData.push(obj);
    this.setData({
      tempData
    })
    // console.log("tempData:" + JSON.stringify(this.data.tempData));
    if (this.data.tempData.length == this.data.categories.length) {
      let categories = this.data.categories;
      for (var i = 0; i < this.data.categories.length; i++) {
        for (var j = 0; j < this.data.tempData.length; j++) {
          if (this.data.categories[i].name == this.data.tempData[j].lists[0].category) {
            categories[i].lists = this.data.tempData[j].lists;
          }
        }
        const key = `categories[${i}].lists`;
        this.setData({
          [key]: categories[i].lists
        })
      }
      this.initImage();
      this.data.categories.forEach(function (item) {
        allData = allData.concat(item.lists);
      })
      this.setData({
        allData
      })
    }
  },

  initImage() {
    let categories = this.data.categories;
    for (var i = 0; i < this.data.categories.length; i++) {
      for (var j = 0; j < categories[i].lists.length; j++) {
        categories[i].lists[j].image1 = app.globalData.baseUrl1 + '/public/' + categories[i].lists[j].image;
      }
      const key = `categories[${i}].lists`;
      this.setData({
        [key]: categories[i].lists
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let that = this;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getProducts();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("onHide");
    wx.removeStorageSync('category_id');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log("onUnload");
    wx.removeStorageSync('category_id');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    console.log("页面下拉加载");
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

  toFaved(e) {
    let user = wx.getStorageSync('user');
    if (user != "") {
      let userid = user.id;
      let item_id = e.currentTarget.dataset.item_id;
      let allData = this.data.allData;
      let breakLoop = false;
      for (var i = 0; i < allData.length; i++) {
        if (!breakLoop) {
          if (allData[i].id == item_id) {
            // allData[i].faved = !(allData[i].faved);
            let favFlag = allData[i].faved;
            if (favFlag) {
              let favUser = allData[i].favuser;
              let replaceChar = favUser.replace(userid + ';', '');
              console.log("replaceChar:" + replaceChar);
              wx.request({
                url: app.globalData.baseUrl + '/api/fav/delete?userid=' + userid + '&productid=' + item_id,
                method: 'GET',
                success: (res) => { // 请求成功之后的回调函数
                  console.log(res);
                  if (!res.data.errno) {
                    breakLoop = true;
                    this.changeFavUser(userid, item_id);
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
                url: app.globalData.baseUrl + '/api/fav/new?userid=' + userid + '&productid=' + item_id,
                method: 'GET',
                success: (res) => { // 请求成功之后的回调函数
                  console.log(res);
                  if (!res.data.errno) {
                    breakLoop = true;
                    this.changeFavUser(userid, item_id);
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
          }
        }
      }
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
    }
    // this.setData({
    //   allData
    // })
  },

  changeFavUser(userid, productid) {
    let allData = this.data.allData;
    let breakLoop = false;
    for (var i = 0; i < allData.length; i++) {
      if (!breakLoop) {
        if (allData[i].id == productid) {
          let favUser = allData[i].favuser;
          favUser = favUser.split(";");
          if (allData[i].faved) {
            let replaceChar = allData[i].favuser.replace(userid + ';', '');
            wx.request({
              url: app.globalData.baseUrl + '/api/products/update?id=' + productid + '&favUserList=' + replaceChar,
              method: 'GET',
              success: (res) => { // 请求成功之后的回调函数
                if (!res.data.errno) {
                  breakLoop = true;
                  wx.showToast({
                    title: '取消收藏成功！',
                  })
                  this.afterChangeFavUser(productid, false);
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
            let replaceChar = allData[i].favuser + userid + ';';
            wx.request({
              url: app.globalData.baseUrl + '/api/products/update?id=' + productid + '&favUserList=' + replaceChar,
              method: 'GET',
              success: (res) => { // 请求成功之后的回调函数
                if (!res.data.errno) {
                  breakLoop = true;
                  wx.showToast({
                    title: '收藏成功！',
                  })
                  this.afterChangeFavUser(productid, true);
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
        }
      }
    }
  },

  afterChangeFavUser(productid, boolean) {
    let allData = this.data.allData;
    let categories = this.data.categories;
    for (var i = 0; i < allData.length; i++) {
      if (allData[i].id == productid) {
        allData[i].faved = boolean;
      }
    }
    for (var j = 0; j < categories.length; j++) {
      for (var  k = 0; k < categories[j].lists.length; k++) {
        if (categories[j].lists[k].id == productid) {
          categories[j].lists[k].faved = boolean;
        }
      }
    }
    this.setData({
      allData,
      categories
    })
  },

  changeCurrent(e) {
    console.log("categoriesInfo:" + JSON.stringify(this.data.categoriesInfo));
    let categories = this.data.categories;
    let currentIndex = this.data.currentIndex;
    console.log("current-idx:" + e.currentTarget.dataset.idx);
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id == e.currentTarget.dataset.idx) {
        currentIndex = i;
        break;
      }
    }
    this.setData({
      currentIndex,
      intoView: "sub-cate-list-inner-" + e.currentTarget.dataset.idx
    });

    console.log("intoView:" + this.data.intoView);

  },
  selectItem(e) {
    console.log("idx:" + e.currentTarget.dataset.idx);
  },
  subCateClick(e) {
    let sub_cate_id = e.currentTarget.dataset.sub_cate_id;
    console.log("sub_cate_id:" + sub_cate_id);

    wx.navigateTo({
      url: `/pages/goodsDetails/goodsDetails?itemId=` + sub_cate_id,
    })
  },

  subCateScroll(e) {

    console.log("分类页面滚动");
    let scrollTop = e.detail.scrollTop;
    console.log("e.detail.scrollTop:" + scrollTop);
    let categoriesInfo = this.data.categoriesInfo;
    let categoriesHeight = [];
    let tempHeight = 0;
    let currentIndex = this.data.currentIndex;
    console.log("before-currentIndex:" + currentIndex);
    for (var i = 0; i < categoriesInfo.length; i++) {
      tempHeight += (categoriesInfo[i].height + 10);
      categoriesHeight[i] = tempHeight;
      console.log("categoriesHeight:" + JSON.stringify(categoriesHeight));
      if (scrollTop >= categoriesHeight[i - 1]) {
        console.log("i:" + i + ",scrollTop>=:" + (scrollTop >= categoriesHeight[i]));
        currentIndex = i;
        // break;
      }
    }
    if (scrollTop >= 0 && scrollTop < categoriesHeight[0]) {
      currentIndex = 0;
    }

    console.log("after-currentIndex:" + currentIndex);
    this.setData({
      currentIndex
    })
  },

  goToCate(e) {
    console.log("current category id:" + e.currentTarget.dataset.cate_id);
    wx.navigateTo({
      url: `/pages/productsList/productsList?categoryId=` + e.currentTarget.dataset.cate_id,
    })
  },

})