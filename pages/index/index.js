// index.js
// 获取应用实例
const APP = getApp();
APP.globalData.baseUrl = 'http://8.138.103.44:8000';
APP.globalData.baseUrl1 = 'http://8.138.103.44:3000';
console.log("app:" + JSON.stringify(APP));
console.log("index.globalData.id:" + APP.globalData.id);

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    banners: [{
      "id": 1,
      "name": "banner1",
      "src": "../../images/index/swiper/swiper-1.png",
      "link": "/pages/goodsDetails/goodsDetails?itemId=22"
    }, {
      "id": 2,
      "name": "banner2",
      "src": "../../images/index/swiper/swiper-2.png",
      "link": "/pages/goodsDetails/goodsDetails?itemId=33"
    }, {
      "id": 4,
      "name": "banner4",
      "src": "../../images/index/swiper/swiper-4.jpg",
      "link": "/pages/goodsDetails/goodsDetails?itemId=44"
    }],
    currentIndex: 0,
    categories: [{
      "id": 1,
      "icon": "../../images/index/categroies/category-1.png",
      "name": "手机"
    }, {
      "id": 2,
      "icon": "../../images/index/categroies/category-2.png",
      "name": "热门家电"
    }, {
      "id": 3,
      "icon": "../../images/index/categroies/category-3.png",
      "name": "电视影音"
    }, {
      "id": 4,
      "icon": "../../images/index/categroies/category-4.png",
      "name": "配件"
    }],
    noticeList: [{
      "id": 0,
      "title": "系统新上线，作者可高兴啦！ 戳 戳 戳我查看系统说明 系统新上线，作者可高兴啦！ 戳 戳 戳我查看系统说明",
      "content": ""
    }, {
      "id": 1,
      "title": "戳 戳 戳我查看系统说明 系统新上线，作者可高兴啦！戳 戳 戳我查看系统说明 系统新上线，作者可高兴啦！",
      "content": ""
    }],
    floor: [{
      "id": 1,
      "title": "限时秒杀",
      "icon": "../../images/index/floor/miaosha.png",
      "lists": [
        {
          "id": 1,
          "name": "男童防晒衣夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
          "oPrice": 180,
          "cPrice": 170,
          "index_img": "/images/index/floor/products/miaosha-1.jpg"
        },
        {
          "id": 2,
          "name": "夏装薄外套2019年新款童装儿童中大童透气帅洋气休闲潮",
          "oPrice": 490,
          "cPrice": 190,
          "index_img": "/images/index/floor/products/miaosha-2.jpg"
        }
      ]
    }, {
      "id": 2,
      "title": "爆品推荐",
      "icon": "../../images/index/floor/recommend.png",
      "lists": [
        {
          "id": 1,
          "name": "儿童睡衣男童短袖纯棉夏季薄款男孩中大童卡通宝宝家居服套装夏天",
          "oPrice": 180,
          "cPrice": 170,
          "index_img": "/images/index/floor/products/tuijian-1.jpg"
        },
        {
          "id": 2,
          "name": "男童短袖纯棉夏季薄款男孩中大童卡通宝宝家居服套装夏天",
          "oPrice": 180,
          "cPrice": 170,
          "index_img": "/images/index/floor/products/tuijian-2.jpg"
        }
      ]
    }, {
      "id": 3,
      "title": "疯狂砍价",
      "icon": "../../images/index/floor/kanjia.png",
      "lists": [
        {
          "id": 1,
          "name": "hellokitty童装 2019夏季新款儿童透气网眼女童棉袜中大童袜子",
          "oPrice": 180,
          "cPrice": 170,
          "index_img": "/images/index/floor/products/kanjia-1.jpg"
        },
        {
          "id": 2,
          "name": "2019夏季新款儿童透气网眼女童棉袜中大童袜子 hellokitty童装",
          "oPrice": 180,
          "cPrice": 170,
          "index_img": "/images/index/floor/products/kanjia-2.jpg"
        }
      ]
    }, {
      "id": 4,
      "title": "全民拼团",
      "icon": "../../images/index/floor/pingtuan.png",
      "lists": [
        {
          "id": 1,
          "name": "小票打印机工厂定制版小票打印机工厂定制版小票打印机工厂定制版小票打印机工厂定制版小票打印机工厂定制版",
          "oPrice": 180,
          "cPrice": 170,
          "index_img": "/images/index/floor/products/pintuan-1.jpg"
        },
        {
          "id": 2,
          "name": "WiFi云标签机FP-N20WWiFi云标签机FP-N20WWiFi云标签机FP-N20WWiFi云标签机FP-N20WWiFi云标签机FP-N20W",
          "oPrice": 180,
          "cPrice": 170,
          "index_img": "/images/index/floor/products/pintuan-2.jpg"
        }
      ]
    }],
    "index_products": [],
    reachBottom: false,
    flag: false, // 节流阀：默认关
    frontPage: false, // 上一页，存在true，不存在false
    nextPage: false, // 下一页，存在true，不存在false
    totalPages: 0, // 所有页
    currentPage: 0, // 当前页
    totalRows: 0, // 总条数
    rows: 6, // 每页条数
    tempData: [], // 旧数据
    pageData: [], // 当前页数据
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  clickNotice() {
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  onLoad() {

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    wx.request({
      url: APP.globalData.baseUrl + '/api/products/list',
      method: 'GET',
      success: (res) => { // 请求成功之后的回调函数
        console.log(res);
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].image = APP.globalData.baseUrl1 + '/public/' + res.data.data[i].image;
        }
        console.log("image:" + res.data.data[55].image);
        this.setData({
          index_products: res.data.data
        })
        this.setList();
      },
      error: (err) => {
        console.log(err);
      }
    })

    const array = [10, 300, 50, 62, 400, -20, 182.7, -100.36, 66];
    // const filterArray = array.filter(this.filtration);
    // console.log("filterArray:" + filterArray);

    // wx.request({
    //   url: APP.globalData.baseUrl + "/api/user/register", // 请求的接口地址，必须基于 https 协议
    //   method: 'POST',
    //   // header: {  
    //   //   'Content-Type': 'application/x-www-form-urlencoded'  
    //   // },
    //   data: {
    //     username: 'zhangsan',
    //     pwd: 123456
    //   },
    // success: (res) => { // 请求成功之后的回调函数
    //   console.log(res);
    // },
    // error: (err) => {
    //   console.log(err);
    // }
    // })
  },
  onReachBottom() {
    this.nextPage();
  },
  onPullDownRefresh(e) {
    // this.frontPage();
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log("userinfo:" + JSON.stringify(this.data.userInfo));

      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  categoryClick(e) {
    const categoryId = e.currentTarget.dataset.category_id;
    console.log("categoryId:" + categoryId);
    wx.setStorageSync('category_id', categoryId);
    wx.switchTab({
      url: '/pages/category/category',
    })
  },

  bannerClick(e) {
    console.log("url:" + e.currentTarget.dataset.link);
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },

  goSearch(e) {
    console.log("keyword:" + JSON.stringify(e.detail.value));
    if (e.detail.value.keyword == "") {
      wx.showToast({
        title: '请输入关键字',
        icon: "error",
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: '/pages/productsList/productsList?keyword=' + e.detail.value.keyword,
      })
    }
  },

  setList() {
    let that = this;
    let totalPages = that.data.totalPages;
    let currentPage = that.data.currentPage;
    let rows = that.data.rows;
    let tempData = that.data.tempData;
    let pageData = that.data.pageData;
    let index_products = that.data.index_products;

    // 数据总条数 = 数组长度
    this.data.totalRows = this.data.index_products.length;
    console.log("totalRows:" + this.data.totalRows);

    // 总页数 = 取整（数据总条数 / 每页条数）
    // 若不能整除，则总页数 + 1
    let x = 0;
    if (this.data.totalRows % rows != 0) {
      x = 1;
    }
    totalPages = parseInt(this.data.totalRows / rows) + x;
    console.log("rows:" + rows);
    console.log("totalPages:" + totalPages);

    // 若总页数 > 1：下一页存在
    if (totalPages > 1) {
      that.setData({
        nextPage: true
      })
    }

    tempData = this.data.index_products.filter(function (item, index, products) {
      return index >= rows * currentPage && index <= rows * (currentPage + 1) - 1;
    });

    pageData = pageData.concat(tempData);

    console.log("init pageData.id:");
    // for(var i = 0;i < pageData.length; i++){
    //   console.log(pageData[i].id + ",");
    // }

    pageData.forEach(function (item) {
      console.log(item.id);
    })

    that.setData({
      totalPages: totalPages,
      tempData: tempData,
      pageData: pageData
    });
  },

  nextPage() {
    console.log("nextPage");
    let that = this;
    let rows = that.data.rows;
    let currentPage = that.data.currentPage;
    let nextPage = that.data.nextPage;
    let tempData = that.data.tempData;
    let pageData = that.data.pageData;
    let totalPages = that.data.totalPages;
    let flag = that.data.flag;
    console.log("front-flag:" + flag);
    if (nextPage && !(flag)) {

      flag = true;
      wx.showLoading({
        title: '下一页加载中...',
      });

      setTimeout(function () {
        wx.hideLoading();
        that.setData({
          flag: false
        })
      }, 1000)

      console.log("flag:" + flag);

      currentPage += 1;
      tempData = this.data.index_products.filter(function (item, index, products) {
        return index >= rows * currentPage && index <= rows * (currentPage + 1) - 1;
      });

      pageData = pageData.concat(tempData);

      if (currentPage >= 1) {
        that.setData({
          frontPage: true
        })
      }
      if (currentPage == totalPages - 1) {
        that.setData({
          nextPage: false
        })
      }

      console.log("nextPage-pageData.id:");

      pageData.forEach(function (item) {
        console.log(item.id);
      })

      that.setData({
        currentPage: currentPage,
        flag: flag,
        pageData: pageData
      })
    }


    else if (!(nextPage)) {
      console.log("到底啦");
      wx.showToast({
        title: '到底啦',
      })
      that.setData({
        reachBottom: true
      })
    }
    else if (flag) {
      console.log("节流中...");
    }
  },

  frontPage() {
    console.log("frontPage");
    let that = this;
    let rows = that.data.rows;
    let currentPage = that.data.currentPage;
    let frontPage = that.data.frontPage;
    let pageData = that.data.pageData;
    let totalPages = that.data.totalPages;
    let flag = that.data.flag;

    if (frontPage && !(flag)) {

      flag = true;
      wx.showLoading({
        title: '数据加载中...',
      })

      setTimeout(function () {
        wx.hideLoading();
        that.setData({
          flag: false
        })
      }, 1000)

      currentPage -= 1;
      pageData = this.data.index_products.filter(function (item, index, products) {
        return index >= rows * currentPage && index <= rows * (currentPage + 1) - 1;
      });

      if (currentPage >= 1) {
        that.setData({
          frontPage: true
        })
      } else {
        that.setData({
          frontPage: false
        })
      }
      if (currentPage == totalPages - 1) {
        that.setData({
          nextPage: false
        })
      }

      console.log("nextPage-pageData.id:");

      pageData.forEach(function (item) {
        console.log(item.id);
      })

      that.setData({
        currentPage: currentPage,
        flag: flag,
        pageData: pageData
      })
    }

    else if (!(frontPage)) {
      console.log("到顶啦");
    }

    else if (flag) {
      console.log("节流中...");
    }
  },

  goToDetails(e) {
    let item_id = JSON.stringify(e.currentTarget.dataset.item_id);
    console.log("clickItemId:" + item_id);
    wx.navigateTo({
      url: `/pages/goodsDetails/goodsDetails?itemId=` + item_id,
    })
  }

})
