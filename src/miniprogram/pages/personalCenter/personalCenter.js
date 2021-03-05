// miniprogram/pages/personalCenter/personalCenter.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    unloginImgUrl: "https://6869-hitsz-raubs-1302289355.tcb.qcloud.la/user-unlogin.png?sign=f949568557d87dc285b15bb2b3d99d21&t=1591697281",
    personalInfoBtnImgUrl: "https://6869-hitsz-raubs-1302289355.tcb.qcloud.la/personal_inf_s.png?sign=43303673d8da357341bcdf2e8fe19d16&t=1591697315",
    guanzhuBtnImgUrl:"https://6869-hitsz-raubs-1302289355.tcb.qcloud.la/guanzhu_s.png?sign=b8a5fc9a66defa073a94bf5af8f0964c&t=1591697339",
    huifuBtnImgUrl:"https://6869-hitsz-raubs-1302289355.tcb.qcloud.la/huifu_s.png?sign=261e812a8080d91d2e65d21e2c1abf51&t=1591697356",
    logged: false,
    userInfo:{},
    nickName:""
  },
  onLoad: function(){
    const _this = this;
    //判断是否之前登录过
    wx.getStorage({
      key: 'openid',
      success (res) {
        //console.log(res)
        const openid = res.data
        _this.setData({
          logged: true,
        });
        //继续从缓存中获取头像
        wx.getStorage({
          key: 'avatarUrl',
          success(res) {
            _this.setData({
              unloginImgUrl:res.data
            });
          }
        })
        //从数据库中获取昵称
        db.collection('user').where({
          _openid: openid // 填入当前用户 openid
        }).get().then(res => {
          console.log(res)
          _this.setData({
            nickName:res.data[0].name
          });
        })
      },
      fail(err){
        console.log('该用户尚未登录')
      }
    })
  },
  onGetUserInfo: function(e) {
    const _this = this
    if (!this.data.logged && e.detail.userInfo) {
      this.getOpenid()
      const avatarUrl = e.detail.userInfo.avatarUrl
      const userInfo = e.detail.userInfo
      this.setData({
        logged: true,
        unloginImgUrl: avatarUrl,
        userInfo: userInfo
      });

      //缓存用户userId和头像
      wx.setStorage({
        data: userInfo,
        key: 'userInfo',
      });
      wx.setStorage({
        data: avatarUrl,
        key: 'avatarUrl',
      })
      
      

      //若该用户不在数据库中则创建该用户信息
      db.collection('user').where({
        _openid: this.data.openid // 填入当前用户 openid
      }).get().then(res => {
        if(res.data == 0){//用户不在user表里
          _this.setData({
            nickName:userInfo.nickName
          })
          db.collection('user').add(
            {
              data:{
                name: userInfo.nickName,
                grade:"",
                department:""
              }
            }
          )
        }else{
          _this.setData({
            nickName:res.data.name
          })
        }

      })
      
      //console.log(this.data.userInfo);
    }
  },
  getOpenid(){
    const _this = this
    wx.cloud.callFunction({
      name:'login',
      complete:res=>{
        var openid = res.result.openid
        wx.setStorageSync('openid', openid)
        _this.setData({
          'openid': openid
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})

