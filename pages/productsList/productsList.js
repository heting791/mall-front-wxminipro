const app = getApp();

// pages/productsList/productsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // subCateItem: {
    //   "id": 1,
    //   "name": "上装1",
    //   "choose": ["包邮", "品牌", "电池容量","包邮", "品牌", "电池容量"],
    //   products: [
    //     {
    //       "id": 1,
    //       "name": "男童防晒衣夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //       "oPrice": 180,
    //       "cPrice": 170,
    //       "desc": "袜子，适合秋冬", "tags": ["包邮", "天猫"], "index_img": "/images/index/floor/products/miaosha-1.jpg"
    //     },
    //     {
    //       "id": 2,
    //       "name": "夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //       "oPrice": 490,
    //       "cPrice": 190,
    //       "desc": "袜子，适合秋冬", "tags": ["包邮", "天猫"], "index_img": "/images/index/floor/products/miaosha-2.jpg"
    //     },
    //     {
    //       "id": 3,
    //       "name": "男童防晒衣夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //       "oPrice": 180,
    //       "cPrice": 170,
    //       "desc": "袜子，适合秋冬", "tags": ["包邮", "天猫"], "index_img": "/images/index/floor/products/miaosha-1.jpg"
    //     },
    //     {
    //       "id": 4,
    //       "name": "夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
    //       "oPrice": 490,
    //       "cPrice": 190,
    //       "desc": "袜子，适合秋冬", "tags": ["包邮", "天猫"], "index_img": "/images/index/floor/products/miaosha-2.jpg"
    //     },
    //     {
    //       "id": 5,
    //       "name": "hellokitty童装 2019夏季新款儿童透气网眼女童棉袜中大童袜子",
    //       "oPrice": 180,
    //       "cPrice": 170,
    //       "desc": "袜子，适合秋冬", "tags": ["包邮", "天猫"], "index_img": "/images/index/floor/products/kanjia-1.jpg",
    //       "options": [
    //         {
    //           "name": "网络类型",
    //           "lists": ["WIFI", "4G"]
    //         },
    //         {
    //           "name": "新订单提示",
    //           "lists": ["滴滴声", "真人语音"]
    //         },
    //         {
    //           "name": "切纸方式",
    //           "lists": ["手动撕纸", "自动切纸"]
    //         },
    //         {
    //           "name": "对接方式",
    //           "lists": ["自己对接", "系统对接"]
    //         }
    //       ]
    //     },
    //     {
    //       "id": 6,
    //       "name": "2019夏季新款儿童透气网眼女童棉袜中大童袜子 hellokitty童装",
    //       "oPrice": 180,
    //       "cPrice": 170,
    //       "desc": "袜子，适合秋冬", "tags": ["包邮", "天猫"], "index_img": "/images/index/floor/products/kanjia-2.jpg"
    //     }
    //   ]
    // }

    subCateItem: {},
    testImage: "",
    tempData: [],
    tempImages: [],
    doneImagesLen: 0,
    asc: false,
    desc: false,
    listDetails: false,
    originData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("productsList-options:" + JSON.stringify(options));
    let categories = wx.getStorageSync('categories');
    let productList = wx.getStorageSync('productList');
    let choose = [],
      products = [];
    let count = 0;
    if (!options.faved) {
      if (options.categoryId && !options.subCateId) {
        if (categories && productList) {
          categories.forEach(function (item) {
            if (item.id == options.categoryId) {
              choose = item.choose;
            }
          });

          productList.forEach(function (item) {
            if (item.cate == options.categoryId) {
              products.unshift(item);
              count++;
            }
          })
          console.log("choose:" + JSON.stringify(choose));
          console.log("count:" + count);
        }
      } else if (options.subCateId) {
        if (categories && productList) {
          categories.forEach(function (item) {
            if (item.id == options.categoryId) {
              choose = item.choose;
            }
          });

          productList.forEach(function (item) {
            if ((item.cate == options.categoryId) && (item.subCate == options.subCateId)) {
              products.unshift(item);
              count++;
            }
          });
          console.log("count:" + count);
        }
      } else if (options.keyword) {
        console.log("keyword:" + options.keyword);
        wx.request({
          url: app.globalData.baseUrl + '/api/products/list?keyword=' + options.keyword,
          success: (res) => { // 请求成功之后的回调函数
            // this.data.tempData = res.data.data;
            const key = `subCateItem.products`;
            this.setData({
              tempData: res.data.data,
              [key]: res.data.data
            })
            this.initImage();
            // this.getImage();
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
      if (choose.length) {
        let string = 'subCateItem.choose';
        this.setData({
          [string]: choose
        })
      }
      if (products.length) {
        let string = 'subCateItem.products';
        this.setData({
          [string]: products
        })
      }
    } else {
      this.setData({
        faved: true
      })
      let userid = wx.getStorageSync('user').id;
      wx.request({
        url: app.globalData.baseUrl + '/api/fav/list?userid=' + userid,
        method: 'GET',
        success: (res) => { // 请求成功之后的回调函数
          console.log(res);
          if (!res.data.errno) {
            let resdata = res.data.data;
            let subCateItem = {};
            subCateItem["products"] = resdata;
            let tempData = resdata;
            this.setData({
              subCateItem,
              tempData
            })
            this.initImage();
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

  initImage() {
    let data = this.data.tempData;
    for (var i = 0; i < data.length; i++) {
      const key = `subCateItem.products[${i}].image1`;
      this.setData({
        [key]: app.globalData.baseUrl1 + '/public/' + data[i].image
      })
    }
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
      let string = 'subCateItem.products';
      this.setData({
        [string]: data
      })
      wx.setStorageSync('originData', data)
    }
  },

  getImage() {
    let data = this.data.tempData;
    let idList = [];
    data.forEach(function (item) {
      idList.push(item.id);
    })
    console.log("idList:" + JSON.stringify(idList));
    // wx.request({
    //   url: app.globalData.baseUrl + '/api/products/getImage?idList=' + idList,
    //   method: 'GET',
    //   success: (res) => { // 请求成功之后的回调函数
    //     console.log("success");
    //     this.checkImage(res.data);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // })
  },

  checkImage(res) {
    console.log("checkImage");
    let oriRes = this.data.tempData;
    let tempImages = res.data;
    for (var i = 0; i < oriRes.length; i++) {
      // console.log("i:" + i + "," + this.data.subCateItem.products[i].image1);
      for (var j = 0; j < tempImages.length; j++) {
        if (tempImages[j].id == oriRes[i].id) {
          console.log("yes");
          const key = `subCateItem.products[${i}].image1`;
          // this.setData({
          //   [key]: app.globalData.baseUrl + '/public/' + 
          // });
        }
      }
    }

    // // this.setData({
    // //   ['tempArr[' + needChangeArrIndex + '].flag']: true,
    // // })


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
    console.log("退出商品分类");
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

  toFaved(e) {
    let user = wx.getStorageSync('user');
    if (user != "") {
      let userid = user.id;
      let item_id = e.currentTarget.dataset.item_id;
      let allData = this.data.subCateItem.products;
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
    let allData = this.data.subCateItem.products;
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
    let allData = this.data.subCateItem.products;
    for (var i = 0; i < allData.length; i++) {
      if (allData[i].id == productid) {
        allData[i].faved = boolean;
      }
    }
    let string = 'subCateItem.products';
    this.setData({
      [string]: allData
    })
  },

  goToDetails(e) {
    let itemId = e.currentTarget.dataset.item_id;
    console.log("click-id:" + e.currentTarget.dataset.item_id);
    wx.navigateTo({
      url: `/pages/goodsDetails/goodsDetails?itemId=` + itemId,
    })
  },

  changeListMode() {
    let listDetails = this.data.listDetails;
    this.setData({
      listDetails: !listDetails
    })
  },

  synthesis() {
    let originData = wx.getStorageSync('originData');
    console.log("before:" + JSON.stringify(originData[0]));
    console.log("length:" + originData.length);
    let string = 'subCateItem.products';
    this.setData({
      asc: false,
      desc: false,
      [string]: originData
    })
    console.log("now:" + JSON.stringify(this.data.subCateItem.products[0]));
  },

  changePriceSort() {
    let sortWay;
    let products = this.data.subCateItem.products;
    let originData = wx.getStorageSync('originData');
    console.log("before-products:" + products[0].id + ",ori:" + originData[0].id);
    let string = 'subCateItem.products';
    if (this.data.asc) {
      sortWay = "asc";
    } else if (this.data.desc) {
      sortWay = "desc";
    } else {
      sortWay = ""
    }
    console.log("sortWay:" + sortWay);
    if (sortWay == "" || sortWay == "desc") {
      this.setData({
        asc: true,
        desc: false
      })
    } else if (sortWay == "asc") {
      this.setData({
        desc: true,
        asc: false
      })
    }
    const sortedData = products.sort((a, b) => {
      if (sortWay == "" || sortWay == "desc") {
        return a.price - b.price;
      } else if (sortWay == "asc") {
        return b.price - a.price;
      }
    })
    this.setData({
      [string]: sortedData
    })
    console.log("after-products:" + products[0].id + ",ori:" + originData[0].id);
  }

  // toFaved(e) {
  //   console.log("itemId:" + e.currentTarget.dataset.item_id);
  //   let itemId = e.currentTarget.dataset.item_id;
  //   let currentList = this.data.subCateItem.products;
  //   let currentItem;
  //   let productList = wx.getStorageSync('productList');
  //   let favedList = wx.getStorageSync('favedList');
  //   let delete_idx;
  //   currentList.forEach(function (item) {
  //     if (item.id == itemId) {
  //       currentItem = item;
  //     }
  //   })
  //   if (currentItem.faved) {
  //     currentItem.faved = false;
  //     for (var i = 0; i < favedList.length; i++) {
  //       if (favedList[i].id == currentItem.id) {
  //         delete_idx = i;
  //         break;
  //       }
  //     }
  //     favedList.splice(delete_idx, 1);
  //   } else {
  //     currentItem.faved = true;
  //     if (favedList) {
  //       favedList.unshift(currentItem);
  //     } else {
  //       favedList = [];
  //       favedList.unshift(currentItem);
  //     }
  //   }
  //   console.log("favedList:" + JSON.stringify(favedList));
  //   currentList.forEach(function (item) {
  //     if (item.id == itemId) {
  //       item = currentItem;
  //     }
  //   })
  //   let string = 'subCateItem.products';
  //   this.setData({
  //     [string]: currentList
  //   })
  //   productList.forEach(function (item) {
  //     if (item.id == currentItem.id) {
  //       console.log("yes!productId:" + currentItem.id);
  //       item.faved = currentItem.faved;
  //     }
  //     console.log("product.faved:" + currentItem.faved);
  //   })
  //   wx.setStorageSync('productList', productList);
  //   wx.setStorageSync('favedList', favedList);
  // }
})