// pages/personalReply/personalReply.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    avatarURL: '',
    reply: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // onLoad: function (options) {
  //   const that = this
  //   wx.getStorage({
  //     key: 'openid',
  //     success (res) {
  //       const openid = res.data
  //       db.collection('reply').where({
  //         _openid: openid
  //       }).get().then(res => {
  //         console.log(res.data)
  //         that.setData({
  //           reply: res.data
  //         })
  //       })
  //     }
  //   })
  // },
  onLoad: function (options) {
    const that = this
    wx.getStorage({
      key: 'openid',
      success (res) {
        const openid = res.data
        wx.cloud.callFunction({
          name: 'joinReplyPost',
          data: {
            openid: openid
          },
          success: function(res) {
            console.log("res:")
            console.log(res.result.list.list)
            that.setData({reply: res.result.list.list})
          }
        })
        
      }
    })
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // const that = this;
    // if (length(this.data.reply))
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

// let: {
//   reply_openid: '$_openid',
//   reply_postid: '$post_id'
// },
// pipeline: $.pipeline()
//   .match(_.expr($.and([
//     $.eq(['$_id', '$$reply_postid']),
//     $.eq([openid, '$$reply_openid'])
//   ]))).done(),