const app = getApp();

// pages/components/register/register.js
Component({

  options: {

  },

  properties: {
    registerShow: {
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
    cpwd: {
      type: String,
      value: ""
    },
  },


  methods: {
    registerClose() {
      // this.setData({
      //   registerShow: false
      // })
      this.triggerEvent('registerClose');
    },



    goLogin() {
      // this.setData({
      //   loginShow: true,
      //   registerShow: false
      // })
      this.triggerEvent('goLogin');
    },



    registerCheck(e) {
      console.log(e.detail.value);
      let username = e.detail.value.username;
      let pwd = e.detail.value.pwd;
      let cpwd = e.detail.value.cpwd;
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
      } else if (!(pwd == cpwd)) {
        wx.showToast({
          title: '两次密码不一致',
          icon: "none"
        })
      } else {
        if (username != "") {
          wx.request({
            url: app.globalData.baseUrl + '/api/user/find?username=' + username,
            method: 'GET',
            success: (res) => { // 请求成功之后的回调函数
              if (res.data.errno == -1) {
                wx.showToast({
                  title: '用户名已存在',
                  icon: "error"
                })
              } else {
                wx.request({
                  url: app.globalData.baseUrl + "/api/user/register", // 请求的接口地址，必须基于 https 协议
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
                        title: '请稍后再试',
                        icon: "none"
                      })
                      this.setData({
                        username: "",
                        pwd: "",
                        cpwd: ""
                      })
                      this.triggerEvent('registerClose');
                    } else {
                      wx.showToast({
                        title: '注册成功'
                      })
                      this.setData({
                        username: "",
                        pwd: "",
                        cpwd: ""
                      })
                      wx.clearStorageSync();
                      this.triggerEvent('goLogin');
                    }
                  },
                  error: (err) => {
                    console.log(err);
                  }
                })
              }
            },
            error: (err) => {
              console.log(err);
            }
          })
        }
      }
    },

  }
})