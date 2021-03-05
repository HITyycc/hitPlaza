//index.js
const app = getApp()

Page({

  data: {
    activeNames: ['1'],
    avatarUrl: '../../img/tabIcon/user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    unionId: '',
    nickName: '',
    myJoin: [],
    myCreate: []
  },
  onShow: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    this.setUserData()
    this.init_index()
    // 获取用户信息 
    // wx.getSetting({
    //   success: res => {
    //     if (!res.authSetting['scope.userInfo']) {
    //       wx.authorize({
    //         scope: 'scope.userInfo',
    //         success () {
    //           setUserData()
    //           const db = wx.cloud.database()
    //           db.collection('user').add({
    //             data: {
    //               unionId: this.data.unionId,
    //               nikeName: this.data.nickName,
    //             }
    //           })
    //           init_index()
    //         }
    //       })
    //     }
    //     else { 
    //       setUserData()
    //       init_index() 
    //     } 
    //   }
    // })

  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  gotoCommunity: function() {
    // const nextPage = event.target.id;
    const url = "/pages/classcontent/classcontent";
    wx.navigateTo({
      url: 'url',
    })({
      url: 'url',
    })
    console.log("navigate")
  },

  createCommunity: function() {},

  setUserData: function() {
    // wx.getUserInfo({
    //   success: res => {
    //     this.setData({
    //       avatarUrl: res.userInfo.avatarUrl,
    //       userInfo: res.userInfo,
    //       unionId: res.userInfo.unionId,
    //       nickName: res.userInfo.nickName
    //     })
    //   }
    // })
    this.setData({
      unionId: 'e0cx',
      nickName: 'cx'
    })
  },

  init_index: function() {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    
    console.log('unionId', this.data.unionId) 
    const db = wx.cloud.database({
      env: "hitsz-raubs"
    })
    const _this = this
    wx.getStorage({
      key: 'openid',
      success (res) {
        const openid = res.data
        db.collection('join_community').where({
          "_openid": openid,
          "status": 'admin'
        }).get({
          success: function(res) {
            _this.setData({ myCreate: res.data })
          }
        })
        db.collection('join_community').where({
          "_openid": openid,
          "status": 'student'
        }).get({
          success: function(res) {
            console.log(res.data)
            _this.setData({ myJoin: res.data})
          }
        })
      }
      })
    
    
  },


  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
})
