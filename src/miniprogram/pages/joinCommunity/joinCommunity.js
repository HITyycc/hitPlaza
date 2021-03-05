// pages/joinCommunity/joinCommunity.js
const DB = wx.cloud.database().collection("community") //云数据库里的post table（表）
const DB_join = wx.cloud.database().collection("join_community")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    invitation_code: '',
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    wx.getStorage({
      key: 'openid',
      success (res) {
        that.setData({
          openid: res.data
        })
      }
    })
  },

  invitation_code_input(event){ // 获取帖子内容
    var content = event.detail.value
    this.setData({
      invitation_code: content
    })
  },

  join_one(event){ //点击发布
    const that = this
    DB.where({
      invitationCode: that.data.invitation_code // 填入当前用户 openid
    }).get().then(res => {
      DB_join.where({
        _openid: this.data.openid,
        communityId: res.data[0]._id
      }).get().then(result => {
        if (result.data.length >= 1) {
          wx.showToast({
            title: '已经加入！', // 标题
            icon: 'success',  // 图标类型，默认success
            duration: 1500  // 提示窗停留时间，默认1500ms
          })
        }
        else {
          if (res.data.length >= 1) {
            DB_join.add({
              data: {
                communityId: res.data[0]._id,
                communityName: res.data[0].name,
                status: 'student',
                score: 60
              },
              success(res) {
                wx.showToast({
                  title: '加入成功！', // 标题
                  icon: 'success',  // 图标类型，默认success
                  duration: 1500  // 提示窗停留时间，默认1500ms
                })
                setTimeout(function () {
                  wx.switchTab({
                    url: "../index/index",
                  })
                 }, 1000)
              },
              fail(res) {
                wx.showToast({
                  title: '加入失败！', // 标题
                  icon: 'error',  // 图标类型，默认success
                  duration: 1500  // 提示窗停留时间，默认1500ms
                })
              }
            })
          } else {
            wx.showToast({
              title: '邀请码错误！', // 标题
              icon: 'error',  // 图标类型，默认success
              duration: 1500  // 提示窗停留时间，默认1500ms
            })
          }
        }
      })
    });
  },

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