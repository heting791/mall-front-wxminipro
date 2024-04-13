const app = getApp();

// pages/components/login/login.js
Component({

  options: {

  },

  properties: {
    loginShow: {
      type: Boolean,
      value: false
    },
    username: {
      type: String,
      value: ""
    },
    pwd: {
      type: String,
      value: ""
    },
  },


  methods: {
    loginClose() {
      // this.setData({
      //   loginShow: false
      // })
      this.triggerEvent('loginClose');
    },

    goRegister() {
      // this.setData({
      //   loginShow: false,
      //   registerShow: true
      // })
      this.triggerEvent('goRegister');
    },

    loginCheck(e) {
      let username = e.detail.value.username;
      let pwd = e.detail.value.pwd;
      console.log("username:" + username + ",pwd:" + pwd);
      if (username == "") {
        wx.showToast({
          title: '请输入用户名',
          icon: "error"
        })
      } else if (pwd == "") {
        wx.showToast({
          title: '请输入密码',
          icon: "error"
        })
      } else {
        wx.request({
          url: app.globalData.baseUrl + "/api/user/login", // 请求的接口地址，必须基于 https 协议
          method: 'POST',
          // header: {  
          //   'Content-Type': 'application/x-www-form-urlencoded'  
          // },
          data: {
            username: username,
            pwd: pwd
          },
          success: (res) => { // 请求成功之后的回调函数
            console.log(res);
            if (res.data.errno == -1) {
              wx.showToast({
                title: '用户名或密码错误',
                icon: "none"
              })
              this.setData({
                username: "",
                pwd: ""
              })
            } else {
              wx.showToast({
                title: '登录成功'
              })
              this.setData({
                username: "",
                pwd: ""
              })
              let user = {
                id: res.data.data.id,
                username: res.data.data.username
              }
              wx.clearStorageSync();
              wx.setStorageSync('user', user);
              this.triggerEvent('logined', user);
            }
          },
          error: (err) => {
            console.log(err);
          }
        })
      }
    },
  }
})